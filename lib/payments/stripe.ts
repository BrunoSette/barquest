import Stripe from "stripe";
import { redirect } from "next/navigation";
import { Team } from "@/lib/db/schema";
import {
  getProductsForUser,
  getTeamByStripeCustomerId,
  getUser,
  updateTeamSubscription,
} from "@/lib/db/queries";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function createSubscriptionCheckoutSession({
  team,
  priceId,
}: {
  team: Team | null;
  priceId: string;
}) {
  const user = await getUser();

  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
    return;
  }

  const baseUrl = process.env.BASE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
    customer: team.stripeCustomerId || undefined,
    client_reference_id: user.id.toString(),
    allow_promotion_codes: false,
  });

  if (session.url) {
    redirect(session.url);
  } else {
    console.error("Stripe session URL is undefined");
    redirect("/error");
  }
}

export async function createProductCheckoutSession({
  team,
  priceId,
}: {
  team: Team | null;
  priceId: string;
}) {
  const user = await getUser();

  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  const userProducts = await getProductsForUser(user.id);

  if (userProducts.some((p) => p.stripePriceId == priceId)) {
    redirect(`/pricing`);
  }

  const baseUrl = process.env.BASE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
    customer: team.stripeCustomerId || undefined,
    client_reference_id: user.id.toString(),
    allow_promotion_codes: false,
  });

  redirect(session.url!);
}

export async function createCustomerPortalSession(team: Team | null) {
  if (!team || !team.stripeCustomerId || !team.stripeProductId) {
    redirect("/pricing");
    return;
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(team.stripeProductId);
    if (!product.active) {
      throw new Error("Team's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the team's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: "Manage your subscription",
      },
      features: {
        payment_method_update: {
          enabled: true,
        },
        subscription_update: {
          enabled: true,
          default_allowed_updates: ["price", "quantity", "promotion_code"],
          proration_behavior: "create_prorations",
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id),
            },
          ],
        },
        subscription_cancel: {
          enabled: true,
          mode: "at_period_end",
          cancellation_reason: {
            enabled: true,
            options: [
              "too_expensive",
              "missing_features",
              "switched_service",
              "unused",
              "other",
            ],
          },
        },
      },
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: team.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/dashboard?success=true`,
    configuration: configuration.id,
  });
}

export async function handleSendGAEvent(customerId: string, event: string) {
  const MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID; // GA4 Measurement ID
  const API_SECRET = process.env.GA_MEASUREMENT_API_SECRET; // GA4 Measurement Protocol API secret

  fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
    {
      method: "POST",
      body: JSON.stringify({
        client_id: customerId,
        events: [
          {
            name: event,
            params: {
              customerId,
            },
          },
        ],
      }),
    }
  );
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const team = await getTeamByStripeCustomerId(customerId);

  if (!team) {
    console.error("Team not found for Stripe customer:", customerId);
    redirect("/sign-up?redirect=checkout");
    return;
  }

  if (status === "active") {
    try {
      const lineItems = subscription.items.data;
      if (!lineItems || lineItems.length === 0) {
        console.error("No line items found in subscription");
        redirect("/error?reason=no_line_items");
        return;
      }

      const product = lineItems[0]?.price?.product as Stripe.Product;
      if (!product) {
        console.error("Product not found in line items");
        redirect("/error?reason=product_not_found");
        return;
      }

      await updateTeamSubscription(team.id, {
        stripeSubscriptionId: subscriptionId,
        stripeProductId: product.id,
        planName: product.name,
        subscriptionStatus: "active",
      });
      redirect("/dashboard?payment_success=true");
    } catch (error) {
      console.error("Error updating team subscription:", error);
      redirect("/error?reason=update_failed");
    }
  } else {
    console.error("Payment not successful, status:", status);
    redirect("/dashboard?payment_failed=true");
  }
}

export async function getStripePrices() {
  try {
    const prices = await stripe.prices.list({
      expand: ["data.product"],
      active: true,
      type: "one_time",
    });

    return prices.data.map((price) => ({
      id: price.id,
      productId:
        typeof price.product === "string" ? price.product : price.product.id,
      unitAmount: price.unit_amount,
      currency: price.currency,
    }));
  } catch (error) {
    console.error("Error fetching Stripe prices:", error);
    return [];
  }
}

export async function getStripeProducts() {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    return products.data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      defaultPriceId:
        typeof product.default_price === "string"
          ? product.default_price
          : product.default_price?.id,
    }));
  } catch (error) {
    console.error("Error fetching Stripe products:", error);
    return [];
  }
}

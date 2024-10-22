import Stripe from "stripe";
import { redirect } from "next/navigation";
import { Team } from "@/lib/db/schema";
import {
  getTeamByStripeCustomerId,
  getUser,
  updateTeamSubscription,
} from "@/lib/db/queries";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function createCheckoutSession({
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

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}`,
    customer: team.stripeCustomerId || undefined, // Ensure this is set if needed
    client_reference_id: user.id.toString(),
    allow_promotion_codes: true,
  });

  if (session.url) {
    redirect(session.url);
  } else {
    console.error("Stripe session URL is undefined");
    redirect("/error");
  }
}

export async function createCustomerPortalSession(team: Team | null) {
  if (!team || !team.stripeCustomerId || !team.stripeProductId) {
    redirect("/pricing");
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: team.stripeCustomerId,
      return_url: `${process.env.BASE_URL}/dashboard`,
    });

    if (session.url) {
      redirect(session.url);
    } else {
      console.error("Customer portal session URL is undefined");
      redirect("/error");
    }
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    redirect("/error");
  }
}

export async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string | null;
  const paymentStatus = session.payment_status;

  console.log("Handling payment success for session:", session.id);
  console.log("Customer ID:", customerId);
  console.log("Payment Status:", paymentStatus);

  if (!customerId) {
    console.warn("No customer associated with this session.");
    // Handle logic for sessions without a customer, if applicable
    redirect("/dashboard?payment_success=true");
    return;
  }

  const team = await getTeamByStripeCustomerId(customerId);

  if (!team) {
    console.error("Team not found for Stripe customer:", customerId);
    redirect("/error?reason=team_not_found");
    return;
  }

  if (paymentStatus === "paid") {
    try {
      const lineItems = session.line_items?.data;
      if (!lineItems || lineItems.length === 0) {
        console.error("No line items found in session");
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
        stripeSubscriptionId: null,
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
    console.error("Payment not successful, status:", paymentStatus);
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

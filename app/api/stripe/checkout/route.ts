import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { users, teams, teamMembers } from "@/lib/db/schema";
import { setSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });

    // Check if customer is a string or null
    if (!session.customer || typeof session.customer === "string") {
      console.warn("Customer data is not available or is a string.");
      // Handle logic for sessions without a customer, if applicable
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      console.warn("No subscription found for this session.");
      // Handle logic for sessions without a subscription, if applicable
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price.product"],
    });

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      console.warn("No plan found for this subscription.");
      // Handle logic for sessions without a plan, if applicable
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const productId = (plan.product as Stripe.Product).id;

    if (!productId) {
      console.warn("No product ID found for this subscription.");
      // Handle logic for sessions without a product ID, if applicable
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const userId = session.client_reference_id;
    if (!userId) {
      console.warn("No user ID found in session's client_reference_id.");
      // Handle logic for sessions without a user ID, if applicable
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    if (user.length === 0) {
      console.warn("User not found in database.");
      // Handle logic for sessions without a user, if applicable
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const userTeam = await db
      .select({
        teamId: teamMembers.teamId,
      })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user[0].id))
      .limit(1);

    if (userTeam.length === 0) {
      console.warn("User is not associated with any team.");
      // Handle logic for sessions without a team, if applicable
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    await db
      .update(teams)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripeProductId: productId,
        planName: (plan.product as Stripe.Product).name,
        subscriptionStatus: subscription.status,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, userTeam[0].teamId));

    await setSession(user[0]);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error handling successful checkout:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

import Stripe from "stripe";
import {
  handleSubscriptionChange,
  handleSendGAEvent,
  stripe,
} from "@/lib/payments/stripe";
import { NextRequest, NextResponse } from "next/server";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 }
    );
  }

  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;
  switch (event.type) {
    case "invoice.payment_failed":
      await handleSendGAEvent(customerId, "purchase_failed");
      break;
    case "invoice.payment_succeeded":
      await handleSendGAEvent(customerId, "manual_event_PURCHASE");
      break;
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscriptionChange(subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

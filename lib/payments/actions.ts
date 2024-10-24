"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./stripe";
import { withTeam } from "@/lib/auth/middleware";

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get("priceId") as string;
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  if (portalSession) {
    redirect(portalSession.url);
  } else {
    throw new Error("Failed to create customer portal session");
  }
});

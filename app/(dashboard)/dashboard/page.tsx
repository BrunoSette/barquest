import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { BarExamDashboardComponent } from "@/components/bar-exam-dashboard";

export default async function SubscriptionPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <BarExamDashboardComponent userId={user.id} />;
}

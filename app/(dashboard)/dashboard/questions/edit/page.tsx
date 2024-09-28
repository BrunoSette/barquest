import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { ManageQuestionsComponent } from "@/components/manage-questions";

export default async function SubscriptionPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <ManageQuestionsComponent />;
}

import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { CreateQuestionsComponent } from "@/components/create-questions";

export default async function SubscriptionPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <CreateQuestionsComponent />;
}

import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { CreateQuestionsComponent } from "@/components/create-questions";

export default async function SubscriptionPage() {
  const user = await getUser();

  if (!user || user.role !== "admin") {
    redirect("/sign-in");
  }

  return <CreateQuestionsComponent />;
}

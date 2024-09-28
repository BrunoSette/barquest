import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import MultipleChoiceTest from "@/components/multiple-choice-test";

export default async function TestePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <MultipleChoiceTest />;
}

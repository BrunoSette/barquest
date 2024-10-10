import { redirect } from "next/navigation";
import { getUser, getQuestionCountsBySubject } from "@/lib/db/queries";
import { QuestionsSummary } from "@/components/QuestionsSummary";

export default async function SummaryPage() {
  const user = await getUser();

  if (!user || user.role !== "admin") {
    redirect("/sign-in");
  }

  const subjectCounts = await getQuestionCountsBySubject();

  return (
    <div>
      <QuestionsSummary subjectCounts={subjectCounts} />
    </div>
  );
}

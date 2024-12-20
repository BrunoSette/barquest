import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { DashboardComponent } from "@/components/dashboard";
import { fetchDashboardData } from "@/lib/db/dashboard";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { testHistory, userAnswers } from "@/lib/db/schema";

export const metadata = {
  title: "Dashboard - BarQuest",
  description: "Your Ultimate Prep Tool for the Ontario Bar Exam",
};

async function deleteTestHistory(testHistoryId: string) {
  "use server";
  if (!testHistoryId) {
    throw new Error("Test history ID is missing");
  }

  await db.transaction(async (tx) => {
    // First, delete related user answers
    await tx
      .delete(userAnswers)
      .where(eq(userAnswers.testHistoryId, parseInt(testHistoryId)));

    // Then, delete the test history
    await tx
      .delete(testHistory)
      .where(eq(testHistory.id, parseInt(testHistoryId)));
  });

  revalidatePath("/dashboard");
}

// Update the page props interface to match Next.js expectations
interface PageProps {
  searchParams: Promise<{ success?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dashboardData = await fetchDashboardData(user.id);
  // Await the searchParams Promise before using it
  const resolvedParams = await searchParams;
  const showWelcomeDialog = resolvedParams.success === "true";

  return (
    <DashboardComponent
      userId={user.id}
      initialData={dashboardData}
      deleteTestHistory={deleteTestHistory}
      showWelcomeDialog={showWelcomeDialog}
    />
  );
}

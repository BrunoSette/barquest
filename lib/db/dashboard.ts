import { db } from "@/lib/db/drizzle";
import { eq, sql, and } from "drizzle-orm";
import { userAnswers, testHistory, questions, subjects } from "@/lib/db/schema";

export async function fetchDashboardData(userId: number) {
  if (userId === undefined) {
    throw new Error("User ID is undefined");
  }

  const totalAnswersResult = await db
    .select({ count: sql`count(*)` })
    .from(userAnswers)
    .where(eq(userAnswers.userId, userId));
  const totalAnswers = Number(totalAnswersResult[0].count) || 0;

  const correctAnswersResult = await db
    .select({ count: sql`count(*)` })
    .from(userAnswers)
    .where(
      and(eq(userAnswers.userId, userId), eq(userAnswers.isCorrect, true))
    );
  const correctAnswers = Number(correctAnswersResult[0].count) || 0;

  const answersPerSubject = await db
    .select({
      subject: subjects.name,
      total_answers: sql`count(*)`.as("total_answers"),
      correct_answers:
        sql`sum(case when ${userAnswers.isCorrect} then 1 else 0 end)`.as(
          "correct_answers"
        ),
    })
    .from(userAnswers)
    .innerJoin(questions, eq(userAnswers.questionId, questions.id))
    .innerJoin(subjects, eq(questions.subjectId, subjects.id))
    .where(eq(userAnswers.userId, userId))
    .groupBy(subjects.name);

  const testHistories = await db
    .select()
    .from(testHistory)
    .where(eq(testHistory.userId, userId))
    .orderBy(sql`${testHistory.date} desc`);

  return {
    totalAnswers,
    correctAnswers,
    answersPerSubject: answersPerSubject.map((subject) => ({
      ...subject,
      total_answers: Number(subject.total_answers),
      correct_answers: Number(subject.correct_answers),
    })),
    testHistory: testHistories,
  };
}

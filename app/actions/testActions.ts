"use server";

import { Question } from "@/lib/db/schema";
import { db } from "@/lib/db/drizzle";
import { eq, inArray, not, sql, and } from "drizzle-orm";
import { questions, testHistory, userAnswers } from "@/lib/db/schema";

export async function getQuestions(
  userId: number,
  selectedSubjects: number[],
  numberOfQuestions: number,
  questionMode: string
): Promise<Question[]> {
  console.log(`Requesting ${numberOfQuestions} questions for subjects: ${selectedSubjects.join(', ')}, mode: ${questionMode}`);

  let query = db.select().from(questions);

  if (selectedSubjects.length > 0) {
    query = query.where(inArray(questions.subjectId, selectedSubjects));
  }

  if (questionMode === "unanswered") {
    const answeredQuestions = await db
      .select({ questionId: userAnswers.questionId })
      .from(userAnswers)
      .where(eq(userAnswers.userId, userId));

    const answeredQuestionIds = answeredQuestions
      .map((q) => q.questionId)
      .filter((id): id is number => id !== null);

    console.log(`User has answered ${answeredQuestionIds.length} questions`);

    if (answeredQuestionIds.length > 0) {
      query = query.where(not(inArray(questions.id, answeredQuestionIds)));
    }
  }

  // Add randomization to the query
  query = query.orderBy(sql`RANDOM()`);

  const totalQuestions = await db.select({ count: sql<number>`count(*)` }).from(questions);
  console.log(`Total questions in database: ${totalQuestions[0].count}`);

  const fetchedQuestions = await query;
  
  console.log(`Fetched ${fetchedQuestions.length} questions out of ${numberOfQuestions} requested`);

  // Slice the array to return only the requested number of questions (or all if fewer are available)
  return fetchedQuestions.slice(0, numberOfQuestions);
}

export async function getTestState(userId: number) {
  const latestTest = await db
    .select()
    .from(testHistory)
    .where(eq(testHistory.userId, userId))
    .orderBy(sql`${testHistory.date} DESC`)
    .limit(1);

  if (latestTest.length === 0) {
    return {
      currentQuestion: 0,
      score: 0,
      isTestComplete: false,
      isAnswered: false,
      timeLeft: 0,
      testHistoryId: null,
    };
  }

  const test = latestTest[0];
  const answeredQuestions = await db
    .select()
    .from(userAnswers)
    .where(eq(userAnswers.testHistoryId, test.id));

  return {
    currentQuestion: answeredQuestions.length,
    score: answeredQuestions.filter((a) => a.isCorrect).length,
    isTestComplete: test.timed,
    isAnswered: answeredQuestions.length > 0,
    timeLeft: 0,
    testHistoryId: test.id,
  };
}

export async function submitAnswer(
  userId: number,
  questionId: number,
  selectedAnswer: number,
  testHistoryId: number | null
) {
  const question = await db
    .select()
    .from(questions)
    .where(eq(questions.id, questionId))
    .limit(1);

  if (question.length === 0) {
    throw new Error("Question not found");
  }

  const isCorrect = selectedAnswer === question[0].correctAnswer;

  if (!testHistoryId) {
    const newTest = await db
      .insert(testHistory)
      .values({
        userId,
        score: isCorrect ? 1 : 0,
        questions: 1,
        timed: false,
        tutor: false,
        questionmode: "all",
        newQuestions: 1,
        date: new Date(),
      })
      .returning({ id: testHistory.id });
    testHistoryId = newTest[0].id;
  } else {
    await db
      .update(testHistory)
      .set({
        score: sql`${testHistory.score} + ${isCorrect ? 1 : 0}`,
        questions: sql`${testHistory.questions} + 1`,
        newQuestions: sql`${testHistory.newQuestions} + 1`,
      })
      .where(eq(testHistory.id, testHistoryId));
  }

  await db.insert(userAnswers).values({
    userId,
    questionId,
    selectedAnswer,
    isCorrect,
    testHistoryId,
  });
}

export async function completeTest(
  userId: number,
  testHistoryId: number | null
) {
  if (testHistoryId) {
    await db
      .update(testHistory)
      .set({ timed: true }) // Using 'timed' to indicate completion
      .where(eq(testHistory.id, testHistoryId));
  }
}

export async function resetTestState(userId: number) {
  // First, delete related user_answers
  await db
    .delete(userAnswers)
    .where(
      and(
        eq(userAnswers.userId, userId),
        inArray(
          userAnswers.testHistoryId,
          db
            .select({ id: testHistory.id })
            .from(testHistory)
            .where(and(eq(testHistory.userId, userId), eq(testHistory.timed, false)))
        )
      )
    );

  // Then, delete incomplete test history
  await db
    .delete(testHistory)
    .where(
      and(
        eq(testHistory.userId, userId),
        eq(testHistory.timed, false)
      )
    );

  // Create a new test history entry
  const newTest = await db
    .insert(testHistory)
    .values({
      userId,
      score: 0,
      questions: 0,
      timed: false,
      tutor: false,
      questionmode: "all",
      newQuestions: 0,
      date: new Date(),
    })
    .returning({ id: testHistory.id });

  return newTest[0].id;
}

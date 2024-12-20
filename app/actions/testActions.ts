"use server";

import { Question } from "@/lib/db/schema";
import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { subjects } from "@/lib/db/schema";
import { eq, inArray, not, sql, and } from "drizzle-orm";
import { questions, testHistory, userAnswers } from "@/lib/db/schema";

export async function getQuestions(
  userId: number,
  selectedSubjects: number[],
  numberOfQuestions: number,
  questionMode: string
): Promise<Question[]> {
  // Start with base conditions

  //TODO: ONLY GET APPROVED QUESTIONS
  // let conditions = [eq(questions.is_approved, true)];

  //ANY conditions
  let conditions: any[] = [];

  // Add subject condition if subjects are selected
  if (selectedSubjects.length > 0) {
    conditions.push(inArray(questions.subjectId, selectedSubjects));
  }

  // Build initial query with conditions
  let query = db
    .select()
    .from(questions)
    .where(and(...conditions));

  // Handle unanswered questions mode
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
      query = db
        .select()
        .from(questions)
        .where(
          and(...conditions, not(inArray(questions.id, answeredQuestionIds)))
        );
    }
  }

  // Execute the query and then apply randomization
  const fetchedQuestions = await query;
  const randomizedQuestions = fetchedQuestions.sort(() => Math.random() - 0.5);

  const totalQuestions = await db
    .select({ count: sql<number>`count(*)` })
    .from(questions);
  console.log(`Total questions in database: ${totalQuestions[0].count}`);

  console.log(
    `Fetched ${randomizedQuestions.length} questions out of ${numberOfQuestions} requested`
  );

  // Slice the array to return only the requested number of questions
  return randomizedQuestions.slice(0, numberOfQuestions);
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
  isTimed: boolean,
  isTutor: boolean,
  questionMode: string,
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

  const isCorrect = selectedAnswer === Number(question[0].correctAnswer);

  if (!testHistoryId) {
    const newTest = await db
      .insert(testHistory)
      .values({
        userId,
        score: isCorrect ? 1 : 0,
        questions: 1,
        timed: isTimed,
        tutor: isTutor,
        questionmode: questionMode,
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
        timed: isTimed,
        tutor: isTutor,
        questionmode: questionMode,
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
      .set({ userId: userId })
      .where(eq(testHistory.id, testHistoryId));
  }
}

export async function resetTestState(userId: number) {
  // First, delete related user_answers
  await db.delete(userAnswers).where(
    and(
      eq(userAnswers.userId, userId),
      inArray(
        userAnswers.testHistoryId,
        db
          .select({ id: testHistory.id })
          .from(testHistory)
          .where(
            and(eq(testHistory.userId, userId), eq(testHistory.timed, false))
          )
      )
    )
  );

  // Then, delete incomplete test history
  await db
    .delete(testHistory)
    .where(and(eq(testHistory.userId, userId), eq(testHistory.timed, false)));

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

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(token.value)),
  });

  return user;
}

// Add this new server action
export async function getQuestionsForManagement(): Promise<Question[]> {
  const questionsData = await db
    .select({
      id: questions.id,
      createdAt: questions.createdAt,
      updatedAt: questions.updatedAt,
      subjectId: questions.subjectId,
      questionText: questions.questionText,
      answer1: questions.answer1,
      answer2: questions.answer2,
      answer3: questions.answer3,
      answer4: questions.answer4,
      correctAnswer: questions.correctAnswer,
      is_approved: questions.is_approved,
      comments: questions.comments,
    })
    .from(questions)
    .leftJoin(subjects, eq(questions.subjectId, subjects.id));

  return questionsData;
}

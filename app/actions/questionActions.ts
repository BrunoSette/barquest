"use server";

import { db } from "@/lib/db/drizzle";
import { questions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface QuestionData {
  id?: string; // Make id optional since it's not needed for create
  subjectId: number;
  questionText: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  is_approved: boolean;
  correctAnswer: number;
  comments: string;
}

export async function createQuestion(questionData: QuestionData) {
  try {
    const result = await db
      .insert(questions)
      .values({
        subjectId: questionData.subjectId,
        questionText: questionData.questionText,
        answer1: questionData.answer1,
        answer2: questionData.answer2,
        answer3: questionData.answer3,
        answer4: questionData.answer4,
        correctAnswer: questionData.correctAnswer,
        comments: questionData.comments,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard/questions/edit");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error creating question:", error);
    return { success: false, error: "Failed to create question" };
  }
}

export async function updateQuestion(questionData: QuestionData) {
  if (!questionData.id) {
    return { success: false, error: "Question ID is required for update" };
  }

  try {
    await db
      .update(questions)
      .set({
        subjectId: questionData.subjectId,
        questionText: questionData.questionText,
        answer1: questionData.answer1,
        answer2: questionData.answer2,
        answer3: questionData.answer3,
        answer4: questionData.answer4,
        correctAnswer: questionData.correctAnswer,
        comments: questionData.comments,
        is_approved: questionData.is_approved,
        updatedAt: new Date(),
      })
      .where(eq(questions.id, parseInt(questionData.id)));

    revalidatePath("/dashboard/questions/edit");
    return { success: true };
  } catch (error) {
    console.error("Error updating question:", error);
    return { success: false, error: "Failed to update question" };
  }
}

export async function deleteQuestion(id: string) {
  try {
    await db.delete(questions).where(eq(questions.id, parseInt(id)));

    revalidatePath("/dashboard/questions/edit");
    return { success: true };
  } catch (error) {
    console.error("Error deleting question:", error);
    return { success: false, error: "Failed to delete question" };
  }
}

export async function approveQuestion(id: string) {
  try {
    await db
      .update(questions)
      .set({
        is_approved: true,
        updatedAt: new Date(),
      })
      .where(eq(questions.id, parseInt(id)));

    revalidatePath("/dashboard/questions/edit");
    return { success: true };
  } catch (error) {
    console.error("Error approving question:", error);
    return { success: false, error: "Failed to approve question" };
  }
}

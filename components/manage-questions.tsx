"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { QuestionCard } from "./manage-questions/EditQuestionCard";
import { EditQuestionDialog } from "@/components/manage-questions/EditQuestionDialog";
import { DeleteQuestionDialog } from "@/components/manage-questions/DeleteQuestionDialog";
import { SearchBar } from "@/components/manage-questions/SearchBar";
import { Question } from "@/types/question";
import {
  updateQuestion,
  deleteQuestion,
  approveQuestion,
} from "@/app/actions/questionActions";
import { getQuestionsForManagement } from "@/app/actions/testActions";

const subjects = [
  "Business Law",
  "Criminal Law",
  "Civil Litigation",
  "Estate Planning",
  "Family Law",
  "Professional Responsibility",
  "Public Law",
  "Real Estate",
];

export function ManageQuestionsComponent() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyUnapproved, setShowOnlyUnapproved] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [toasts, setToasts] = useState<
    { title: string; description: string; variant?: string }[]
  >([]);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const addToast = useCallback(
    (title: string, description: string, variant?: string) => {
      setToasts((prevToasts) => [
        ...prevToasts,
        { title, description, variant },
      ]);
    },
    []
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestionsForManagement();

        const mappedQuestions = data.map((item: any) => {
          // Get the actual answer string based on the correct answer index
          const correctAnswer = item[`answer${item.correctAnswer}`];

          return {
            id: item.id.toString(),
            subject: subjects[item.subjectId - 1],
            questionText: item.questionText,
            choices: [item.answer1, item.answer2, item.answer3, item.answer4],
            correctAnswer: correctAnswer,
            is_approved: item.is_approved,
            comments: item.comments,
          };
        });

        setQuestions(mappedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        addToast("Error", "Failed to fetch questions.", "destructive");
      }
    };

    fetchQuestions();
  }, [addToast]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleToggleUnapproved = (showUnapproved: boolean) => {
    setShowOnlyUnapproved(showUnapproved);
  };

  const filteredQuestions = questions.filter((q) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (q.subject && q.subject.toLowerCase().includes(searchTermLower)) ||
      (q.questionText &&
        q.questionText.toLowerCase().includes(searchTermLower)) ||
      (q.choices &&
        q.choices.some((choice) =>
          choice.toLowerCase().includes(searchTermLower)
        )) ||
      (q.comments && q.comments.toLowerCase().includes(searchTermLower));

    const matchesApprovalStatus = showOnlyUnapproved ? !q.is_approved : true;

    return matchesSearch && matchesApprovalStatus;
  });

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (question: Question) => {
    setQuestionToDelete(question);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = async (editedQuestion: Question) => {
    try {
      const subjectId = subjects.indexOf(editedQuestion.subject) + 1;

      // Convert correctAnswer to a number (index + 1)
      const correctAnswerIndex =
        editedQuestion.choices.indexOf(editedQuestion.correctAnswer) + 1;

      const result = await updateQuestion({
        id: editedQuestion.id,
        subjectId,
        questionText: editedQuestion.questionText,
        answer1: editedQuestion.choices[0],
        answer2: editedQuestion.choices[1],
        answer3: editedQuestion.choices[2],
        answer4: editedQuestion.choices[3],
        correctAnswer: correctAnswerIndex,
        is_approved: editedQuestion.is_approved ?? false,
        comments: editedQuestion.comments,
      });

      if (result.success) {
        setQuestions(
          questions.map((q) =>
            q.id === editedQuestion.id ? editedQuestion : q
          )
        );
        addToast(
          "Question Updated",
          "The question has been successfully updated."
        );
      } else {
        addToast("Error", "Failed to update question.", "destructive");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      addToast("Error", "Failed to update question.", "destructive");
    } finally {
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
    }
  };

  const confirmDelete = async () => {
    if (questionToDelete) {
      try {
        const result = await deleteQuestion(questionToDelete.id);

        if (result.success) {
          setQuestions(questions.filter((q) => q.id !== questionToDelete.id));
          addToast(
            "Question Deleted",
            "The question has been removed from the list."
          );
        } else {
          addToast("Error", "Failed to delete question.", "destructive");
        }
      } catch (error) {
        console.error("Error deleting question:", error);
        addToast("Error", "Failed to delete question.", "destructive");
      } finally {
        setIsDeleteDialogOpen(false);
        setQuestionToDelete(null);
      }
    }
  };

  const handleApprove = async (question: Question) => {
    try {
      const result = await approveQuestion(question.id);

      if (result.success) {
        setQuestions(
          questions.map((q) =>
            q.id === question.id ? { ...question, is_approved: true } : q
          )
        );
        addToast(
          "Question Approved",
          "The question has been approved successfully."
        );
      } else {
        addToast("Error", "Failed to approve question.", "destructive");
      }
    } catch (error) {
      console.error("Error approving question:", error);
      addToast("Error", "Failed to approve question.", "destructive");
    }
  };

  return (
    <ToastProvider>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Manage Questions
        </h1>

        <SearchBar
          onSearch={handleSearch}
          onToggleUnapproved={handleToggleUnapproved}
          showOnlyUnapproved={showOnlyUnapproved}
          totalQuestions={questions.length}
          filteredQuestions={filteredQuestions.length}
        />

        {questions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={() => handleEdit(question)}
              onDelete={() => handleDelete(question)}
              onApprove={() => handleApprove(question)}
            />
          ))
        ) : (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        )}

        <EditQuestionDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          question={editingQuestion}
          onSave={handleSaveEdit}
          subjects={subjects}
        />

        <DeleteQuestionDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
        />

        <ToastViewport />
        {toasts.map((toast, index) => (
          <Toast
            key={index}
            variant={
              toast.variant as "default" | "destructive" | null | undefined
            }
          >
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </Toast>
        ))}
      </div>
    </ToastProvider>
  );
}

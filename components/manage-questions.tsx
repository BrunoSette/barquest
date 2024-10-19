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
        const response = await fetch("/api/questions");
        if (response.ok) {
          const data = await response.json();
          // console.log("Fetched data:", data);

          const mappedQuestions = data.map((item: any) => ({
            id: item.id.toString(),
            subject: subjects[item.subjectId - 1],
            questionText: item.questionText,
            choices: [item.answer1, item.answer2, item.answer3, item.answer4],
            correctAnswer: item[`answer${item.correctAnswer}`],
            is_approved: item.is_approved,
            comments: item.comments,
          }));

          setQuestions(mappedQuestions);
        } else {
          addToast("Error", "Failed to fetch questions.", "destructive");
        }
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
      const response = await fetch(`/api/questions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editedQuestion.id,
          subjectId,
          questionText: editedQuestion.questionText,
          answer1: editedQuestion.choices[0],
          answer2: editedQuestion.choices[1],
          answer3: editedQuestion.choices[2],
          answer4: editedQuestion.choices[3],
          correctAnswer:
            editedQuestion.choices.indexOf(editedQuestion.correctAnswer) + 1,
          is_approved: editedQuestion.is_approved ?? false,
          comments: editedQuestion.comments,
        }),
      });

      if (response.ok) {
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
        const response = await fetch(`/api/questions`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: questionToDelete.id }),
        });

        if (response.ok) {
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
            />
          ))
        ) : (
          <p>No questions found.</p>
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

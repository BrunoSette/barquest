/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

type Question = {
  id: string;
  subject: string;
  questionText: string;
  choices: string[];
  correctAnswer: string;
  isApproved: boolean; // Updated field name
  comments: string;
};

const subjects = [
  "Business Law",
  "Criminal Law",
  "Civil Litigation",
  "Estate Planning",
  "Family Law",
  "Professional Responsibility - Barristers",
  "Professional Responsibility - Solicitors",
  "Public Law",
  "Real Estate",
];

export function ManageQuestionsComponent() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [toasts, setToasts] = useState<
    { title: string; description: string; variant?: string }[]
  >([]);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const addToast = (title: string, description: string, variant?: string) => {
    setToasts([...toasts, { title, description, variant }]);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data); // Log the fetched data

          // Map the fetched data to the expected structure
          const mappedQuestions = data.map((item: any) => ({
            id: item.id.toString(),
            subject: subjects[item.subjectId - 1], // Assuming subjectId is 1-based index
            questionText: item.questionText,
            choices: [item.answer1, item.answer2, item.answer3, item.answer4],
            correctAnswer: item[`answer${item.correctAnswer}`],
            isApproved: item.isApproved, // Map isApproved field
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
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredQuestions = questions.filter(
    (q) =>
      (q.subject &&
        q.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.questionText &&
        q.questionText.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (question: Question) => {
    setQuestionToDelete(question);
    setIsDeleteDialogOpen(true);
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

  const handleSaveEdit = async () => {
    if (editingQuestion) {
      try {
        const subjectId = subjects.indexOf(editingQuestion.subject) + 1;
        const response = await fetch(`/api/questions`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingQuestion.id,
            subjectId,
            questionText: editingQuestion.questionText,
            answer1: editingQuestion.choices[0],
            answer2: editingQuestion.choices[1],
            answer3: editingQuestion.choices[2],
            answer4: editingQuestion.choices[3],
            correctAnswer:
              editingQuestion.choices.indexOf(editingQuestion.correctAnswer) +
              1,
            isApproved: editingQuestion.isApproved, // Include isApproved in the request
            comments: editingQuestion.comments,
          }),
        });

        if (response.ok) {
          setQuestions(
            questions.map((q) =>
              q.id === editingQuestion.id ? editingQuestion : q
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
    }
  };

  return (
    <ToastProvider>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Manage Bar Exam Questions
        </h1>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>

        {questions.length > 0 ? (
          filteredQuestions.map((question) => (
            <Card key={question.id} className="mb-4">
              <CardHeader>
                <CardTitle>{question.subject}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-2">{question.questionText}</p>
                <ul className="list-disc pl-5">
                  {question.choices.map((choice, index) => (
                    <li
                      key={index}
                      className={
                        choice === question.correctAnswer
                          ? "text-green-600 font-semibold"
                          : ""
                      }
                    >
                      {choice}
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  <strong>Comments:</strong> {question.comments}
                </p>
                <p className="mt-2">
                  <strong>Approved:</strong>{" "}
                  {question.isApproved ? "Yes" : "No"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button onClick={() => handleEdit(question)} variant="outline">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(question)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No questions found.</p>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>
            {editingQuestion && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-subject">Subject</Label>
                  <Select
                    value={editingQuestion.subject}
                    onValueChange={(value) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        subject: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-question">Question</Label>
                  <Input
                    id="edit-question"
                    value={editingQuestion.questionText}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        questionText: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                </div>
                {editingQuestion.choices.map((choice, index) => (
                  <div key={index}>
                    <Label htmlFor={`edit-choice-${index}`}>
                      Choice {index + 1}
                    </Label>
                    <Input
                      id={`edit-choice-${index}`}
                      value={choice}
                      onChange={(e) => {
                        const newChoices = [...editingQuestion.choices];
                        newChoices[index] = e.target.value;
                        setEditingQuestion({
                          ...editingQuestion,
                          choices: newChoices,
                        });
                      }}
                    />
                  </div>
                ))}
                <div>
                  <Label>Correct Answer</Label>
                  <RadioGroup
                    value={editingQuestion.correctAnswer}
                    onValueChange={(value) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        correctAnswer: value,
                      })
                    }
                  >
                    {editingQuestion.choices.map((choice, index) => (
                      <div className="flex items-center space-x-2" key={index}>
                        <RadioGroupItem
                          value={choice}
                          id={`edit-correct-${index}`}
                        />
                        <Label htmlFor={`edit-correct-${index}`}>
                          {choice}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="edit-comments">Comments</Label>
                  <Input
                    id="edit-comments"
                    value={editingQuestion.comments}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        comments: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="edit-approved">Approved</Label>
                  <Switch
                    id="edit-approved"
                    checked={editingQuestion.isApproved}
                    onCheckedChange={(checked) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        isApproved: checked,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this question?</p>
            <DialogFooter>
              <Button
                onClick={() => setIsDeleteDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={confirmDelete} variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

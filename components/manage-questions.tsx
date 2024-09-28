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
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/toast"; // Import the shadcn toast components
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Question = {
  id: string;
  subject: string;
  question: string;
  choices: string[];
  correctAnswer: string;
};

const subjects = [
  "Constitutional Law",
  "Criminal Law",
  "Civil Procedure",
  "Contract Law",
  "Tort Law",
  "Property Law",
  "Administrative Law",
  "Evidence",
  "Professional Responsibility",
  "Business Associations",
];

export function ManageQuestionsComponent() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [toasts, setToasts] = useState<
    { title: string; description: string; variant?: string }[]
  >([]);

  const addToast = (title: string, description: string, variant?: string) => {
    setToasts([...toasts, { title, description, variant }]);
  };

  useEffect(() => {
    // In a real application, you would fetch questions from an API or database here
    const mockQuestions: Question[] = [
      {
        id: "1",
        subject: "Constitutional Law",
        question: "What is the supreme law of Canada?",
        choices: [
          "The Charter of Rights and Freedoms",
          "The Constitution Act, 1867",
          "The Constitution Act, 1982",
          "The Canada Act 1982",
        ],
        correctAnswer: "The Constitution Act, 1982",
      },
      {
        id: "2",
        subject: "Criminal Law",
        question: "What is the minimum mens rea required for murder in Canada?",
        choices: [
          "Recklessness",
          "Negligence",
          "Intent to cause bodily harm",
          "Intent to kill",
        ],
        correctAnswer: "Intent to cause bodily harm",
      },
    ];
    setQuestions(mockQuestions);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    addToast(
      "Question Deleted",
      "The question has been removed from the list."
    );
  };

  const handleSaveEdit = () => {
    if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id ? editingQuestion : q
        )
      );
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
      addToast(
        "Question Updated",
        "The question has been successfully updated."
      );
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

        {filteredQuestions.map((question) => (
          <Card key={question.id} className="mb-4">
            <CardHeader>
              <CardTitle>{question.subject}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-2">{question.question}</p>
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
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button onClick={() => handleEdit(question)} variant="outline">
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(question.id)}
                variant="destructive"
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
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
                  <Textarea
                    id="edit-question"
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: e.target.value,
                      })
                    }
                    className="min-h-[100px]"
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
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
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

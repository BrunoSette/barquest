"use client";

import { useState } from "react";
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

type Question = {
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

export function CreateQuestionsComponent() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    subject: "",
    question: "",
    choices: ["", "", "", ""],
    correctAnswer: "",
  });

  const [toasts, setToasts] = useState<
    { title: string; description: string; variant?: string }[]
  >([]);

  const addToast = (title: string, description: string, variant?: string) => {
    setToasts([...toasts, { title, description, variant }]);
  };

  const handleSubjectChange = (value: string) => {
    setCurrentQuestion({ ...currentQuestion, subject: value });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion({ ...currentQuestion, question: e.target.value });
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...currentQuestion.choices];
    newChoices[index] = value;
    setCurrentQuestion({ ...currentQuestion, choices: newChoices });
  };

  const handleCorrectAnswerChange = (value: string) => {
    setCurrentQuestion({ ...currentQuestion, correctAnswer: value });
  };

  const handleSaveQuestion = () => {
    if (
      currentQuestion.subject &&
      currentQuestion.question &&
      currentQuestion.choices.every((choice) => choice.trim() !== "") &&
      currentQuestion.correctAnswer
    ) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        subject: currentQuestion.subject,
        question: "",
        choices: ["", "", "", ""],
        correctAnswer: "",
      });
      addToast("Question Saved", "The question has been added to the list.");
    } else {
      addToast(
        "Incomplete Question",
        "Please fill in all fields before saving.",
        "destructive"
      );
    }
  };

  const handleFinish = () => {
    // Here you would typically send the questions to an API or database
    console.log(questions);
    addToast(
      "Questions Submitted",
      `${questions.length} questions have been created.`
    );
    // Reset the form
    setQuestions([]);
    setCurrentQuestion({
      subject: "",
      question: "",
      choices: ["", "", "", ""],
      correctAnswer: "",
    });
  };

  return (
    <ToastProvider>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Bar Exam Questions
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>New Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                onValueChange={handleSubjectChange}
                value={currentQuestion.subject}
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
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                placeholder="Enter the question text here"
                className="min-h-[100px]"
              />
            </div>
            {currentQuestion.choices.map((choice, index) => (
              <div key={index}>
                <Label htmlFor={`choice-${index}`}>Choice {index + 1}</Label>
                <Input
                  id={`choice-${index}`}
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  placeholder={`Enter choice ${index + 1}`}
                />
              </div>
            ))}
            <div>
              <Label>Correct Answer</Label>
              <RadioGroup
                onValueChange={handleCorrectAnswerChange}
                value={currentQuestion.correctAnswer}
              >
                {currentQuestion.choices.map((choice, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <RadioGroupItem value={choice} id={`correct-${index}`} />
                    <Label htmlFor={`correct-${index}`}>
                      {choice || `Choice ${index + 1}`}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={handleSaveQuestion}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Save Question
            </Button>
            <Button
              onClick={handleFinish}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-100"
            >
              Finish ({questions.length} questions)
            </Button>
          </CardFooter>
        </Card>

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

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
} from "@/components/ui/toast";

import { subjects } from "@/lib/utils";

type Question = {
  subject: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  comments: string; // Add comments field
};

// const subjects = [
//   { id: 1, name: "Business Law" },
//   { id: 2, name: "Criminal Law" },
//   { id: 3, name: "Civil Litigation" },
//   { id: 4, name: "Estate Planning" },
//   { id: 5, name: "Family Law" },
//   { id: 6, name: "Professional Responsibility" },
//   { id: 7, name: "Public Law" },
//   { id: 8, name: "Real Estate" },
// ];

export function CreateQuestionsComponent() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    subject: "",
    question: "",
    choices: ["", "", "", ""],
    correctAnswer: 0, // Initialize as 0
    comments: "", // Initialize comments
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
    setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(value) });
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion({ ...currentQuestion, comments: e.target.value });
  };

  const handleSaveQuestion = async () => {
    if (
      currentQuestion.subject &&
      currentQuestion.question &&
      currentQuestion.choices.every((choice) => choice.trim() !== "") &&
      currentQuestion.correctAnswer
    ) {
      try {
        const subject = subjects.find(
          (subj) => subj.name === currentQuestion.subject
        );

        if (!subject) {
          addToast("Error", "Invalid subject selected.", "destructive");
          return;
        }

        const response = await fetch("/api/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subjectId: subject.id,
            questionText: currentQuestion.question,
            answer1: currentQuestion.choices[0],
            answer2: currentQuestion.choices[1],
            answer3: currentQuestion.choices[2],
            answer4: currentQuestion.choices[3],
            correctAnswer: currentQuestion.correctAnswer,
            comments: currentQuestion.comments, // Include comments in the request
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setQuestions([...questions, currentQuestion]);
          setCurrentQuestion({
            subject: currentQuestion.subject,
            question: "",
            choices: ["", "", "", ""],
            correctAnswer: 0,
            comments: "", // Reset comments
          });
          addToast(
            "Question Saved",
            "The question has been added to the list."
          );
        } else {
          addToast("Error", "Failed to save the question.", "destructive");
        }
      } catch (error) {
        console.error("Error saving question:", error);
        addToast("Error", "Failed to save the question.", "destructive");
      }
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
      correctAnswer: 0,
      comments: "", // Reset comments
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
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
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
                <Textarea
                  id={`choice-${index}`}
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  placeholder={`Enter choice ${index + 1}`}
                  className="min-h-[100px]"
                />
              </div>
            ))}
            <div>
              <Label>Correct Answer</Label>
              <RadioGroup
                onValueChange={handleCorrectAnswerChange}
                value={currentQuestion.correctAnswer.toString()} // Convert to string for RadioGroup
              >
                {currentQuestion.choices.map((choice, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <RadioGroupItem
                      value={(index + 1).toString()}
                      id={`correct-${index}`}
                    />
                    <Label htmlFor={`correct-${index}`}>
                      {choice || `Choice ${index + 1}`}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            {currentQuestion.correctAnswer > 0 && (
              <div>
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={currentQuestion.comments}
                  onChange={handleCommentsChange}
                  placeholder="Enter comments for the correct answer"
                  className="min-h-[100px]"
                />
              </div>
            )}
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

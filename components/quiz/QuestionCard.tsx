"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";
import { Question } from "@/lib/db/schema";

type QuestionCardProps = {
  question: Question;
  currentQuestionNumber: number;
  totalQuestions: number;
  isAnswered: boolean;
  isTutor: boolean;
  selectedAnswer: number | null;
  setSelectedAnswer: (answer: number | null) => void;
  handleAnswer: () => Promise<void>;
  handlePreviousQuestion: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
  children?: React.ReactNode;
};

export default function QuestionCard({
  question,
  currentQuestionNumber,
  totalQuestions,
  isAnswered,
  isTutor,
  selectedAnswer,
  setSelectedAnswer,
  handleAnswer,
  handlePreviousQuestion,
  isLastQuestion,
  isFirstQuestion,
  children,
}: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col items-center">
          <span>
            Question {currentQuestionNumber} of {totalQuestions}
          </span>
          {children && (
            <div className="w-full mt-2">
              {children}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-6">{question.questionText}</p>
        <RadioGroup
          value={selectedAnswer?.toString() || ""}
          onValueChange={(value) => setSelectedAnswer(parseInt(value))}
        >
          {["answer1", "answer2", "answer3", "answer4"].map((choice, index) => {
            const answerId = index + 1;
            const isCorrect = answerId === question.correctAnswer;
            const isSelected = answerId === selectedAnswer;
            const textColorClass =
              isTutor && isAnswered
                ? isCorrect
                  ? "text-green-600"
                  : isSelected
                  ? "text-red-600"
                  : "text-gray-900"
                : "text-gray-900";

            return (
              <div
                key={index}
                className={`flex items-center space-x-2 mb-4 ${textColorClass}`}
              >
                <RadioGroupItem
                  value={answerId.toString()}
                  id={`choice-${index}`}
                  className="mt-1"
                />
                <Label
                  htmlFor={`choice-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {(question as any)[`answer${answerId}`]}
                </Label>
                {isTutor && isAnswered && (
                  <div className="ml-2">
                    {isCorrect ? (
                      <CheckCircle className="text-green-600 h-5 w-5" />
                    ) : (
                      isSelected && <XCircle className="text-red-600 h-5 w-5" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </RadioGroup>
        {isTutor && isAnswered && (
          <p className="text-lg mb-6 text-gray-600">{question.comments}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isFirstQuestion && (
          <Button onClick={handlePreviousQuestion} variant="outline">
            Previous Question
          </Button>
        )}
        <div className="flex-grow" />
        <Button
          onClick={handleAnswer}
          disabled={selectedAnswer === null && !isAnswered}
        >
          {isAnswered
            ? isLastQuestion
              ? "Finish"
              : "Next Question"
            : "Submit Answer"}
        </Button>
      </CardFooter>
    </Card>
  );
}

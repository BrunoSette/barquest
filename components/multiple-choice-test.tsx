"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#4CAF50", "#F44336"];

type Question = {
  id: string;
  subjectId: [number];
  questionText: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: number;
  comments: string;
};

export default function MultipleChoiceTest(userId: any) {
  const searchParams = useSearchParams();
  // Get parameters from URL
  const isTutor = searchParams.get("isTutor") === "true";
  const isTimed = searchParams.get("isTimed") === "true";
  const selectedSubjects = JSON.parse(
    searchParams.get("selectedSubjects") || "[]"
  ).map((id: string) => parseInt(id, 10));
  const questionMode = searchParams.get("questionMode") || "Unused";
  const numberOfQuestions = parseInt(
    searchParams.get("numberOfQuestions") || "1",
    10
  );
  const secondsPerQuestion = parseInt(
    searchParams.get("secondsPerQuestion") || "75",
    10
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("timeLeft");
    return savedTime ? parseInt(savedTime, 10) : secondsPerQuestion;
  });
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    let didCancel = false;

    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/filteredquestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subjectIds: selectedSubjects,
            maxQuestions: numberOfQuestions,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched questions:", data);

        if (!didCancel) {
          if (Array.isArray(data)) {
            setQuestions(data);
          } else {
            console.error("Unexpected response format:", data);
          }
        }
      } catch (error) {
        if (!didCancel) {
          console.error("Error fetching questions:", error);
        }
      }
    };

    fetchQuestions();

    return () => {
      didCancel = true;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (isTimed) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleNextQuestion();
            return secondsPerQuestion; // Reset to time from URL
          }
          const newTime = prevTime - 1;
          localStorage.setItem("timeLeft", newTime.toString());
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, secondsPerQuestion, isTimed]);

  const handleAnswerSelection = async (value: number) => {
    setSelectedAnswer(value);
    setIsAnswered(true); // Mark the question as answered

    const currentQ = questions[currentQuestion];
    const isCorrect = value === currentQ.correctAnswer;

    if (!submittedAnswers.has(Number(currentQ.id))) {
      try {
        const response = await fetch("/api/users-answers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId.userId, // This is passed as a prop
            question_id: currentQ.id,
            selected_answer: value,
            is_correct: isCorrect,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Answer submitted:", data);
        setSubmittedAnswers((prev) => new Set(prev).add(Number(currentQ.id)));
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    }
  };

  const handleNextQuestion = () => {
    if (questions.length === 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    const correctAnswer = currentQ.correctAnswer;

    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion === questions.length - 1) {
      setIsTestComplete(true);
      localStorage.removeItem("timeLeft"); // Clear the timer when the test is complete

      // Save the test result to the database
      saveTestResult(
        userId.userId,
        score,
        questions.length,
        isTimed,
        isTutor,
        questionMode,
        numberOfQuestions
      );
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false); // Reset the answered state for the next question
      setTimeLeft(secondsPerQuestion); // Reset timer for next question
      localStorage.setItem("timeLeft", secondsPerQuestion.toString());
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion === 0) {
      return;
    }

    setSelectedAnswer(null);
    setCurrentQuestion(currentQuestion - 1);
    setIsAnswered(false); // Reset the answered state for the previous question
    setTimeLeft(secondsPerQuestion); // Reset timer for previous question
    localStorage.setItem("timeLeft", secondsPerQuestion.toString());
  };

  const saveTestResult = async (
    userId: number,
    score: number,
    questions: number,
    timed: boolean,
    tutor: boolean,
    questionMode: string,
    newQuestions: number
  ) => {
    try {
      const response = await fetch("/api/save-test-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          score,
          questions,
          timed,
          tutor,
          questionMode,
          newQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Test result saved:", data);
    } catch (error) {
      console.error("Error saving test result:", error);
    }
  };

  const isLastQuestion = currentQuestion === questions.length - 1;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const resultData = [
    { name: "Correct", value: score },
    { name: "Incorrect", value: questions.length - score },
  ];

  if (isTestComplete) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Canadian Bar Exam Practice Test Results
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="text-center">
                Your Score: {score} / {questions.length} (
                {Math.round((score / questions.length) * 100)}%)
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-64 h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resultData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {resultData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard">
                <div className="bg-blue-500 text-white px-4 py-2 rounded">
                  Go to Dashboard
                </div>
              </Link>
              <Link href="/dashboard/newtest">
                <div className="bg-orange-500 text-white px-4 py-2 rounded">
                  Start New Test
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  console.log("Current question:", questions[currentQuestion]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Canadian Bar Exam Practice Test
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            {isTimed && (
              <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isTimed && (
            <Progress
              value={(timeLeft / secondsPerQuestion) * 100}
              className="mb-4"
            />
          )}
          <p className="text-lg mb-6">
            {questions[currentQuestion]?.questionText}
          </p>
          <RadioGroup
            value={selectedAnswer?.toString() || ""}
            onValueChange={(value) => handleAnswerSelection(parseInt(value))}
          >
            {[
              questions[currentQuestion]?.answer1,
              questions[currentQuestion]?.answer2,
              questions[currentQuestion]?.answer3,
              questions[currentQuestion]?.answer4,
            ].map((choice, index) => {
              const answerId = index + 1;
              const correctAnswer = questions[currentQuestion].correctAnswer;
              const isCorrect = answerId === correctAnswer;
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
                  <Label htmlFor={`choice-${index}`} className="flex-1">
                    {choice}
                  </Label>
                  {isTutor && isAnswered && (
                    <div className="ml-2">
                      {isCorrect ? (
                        <CheckCircle className="text-green-600 h-5 w-5" />
                      ) : isSelected ? (
                        <XCircle className="text-red-600 h-5 w-5" />
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </RadioGroup>
          {isAnswered && (
            <p className="text-lg mb-6 text-gray-600">
              {questions[currentQuestion]?.comments}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            {isLastQuestion ? "Finish" : "Next"}{" "}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

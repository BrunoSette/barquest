"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExamResults } from "./exam-results";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/lib/db/schema";
import { CheckCircle, XCircle } from "lucide-react";

export default function MultipleChoiceTest({ userId }: { userId: number }) {
  const searchParams = useSearchParams();
  const isTutor = searchParams.get("isTutor") === "true";
  const isTimed = searchParams.get("isTimed") === "true";
  const selectedSubjects = JSON.parse(
    searchParams.get("selectedSubjects") || "[]"
  ).map((id: string) => parseInt(id, 10));
  const questionMode = searchParams.get("questionMode") || "all";
  const numberOfQuestions = parseInt(
    searchParams.get("numberOfQuestions") || "1",
    10
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [testHistoryId, setTestHistoryId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<number>>(
    new Set()
  );
  const [timeLeft, setTimeLeft] = useState<number>(numberOfQuestions * 100); // Total time for the test

  // Fetch questions on mount
  useEffect(() => {
    let didCancel = false;

    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/filteredquestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subjectIds: selectedSubjects,
            maxQuestions: numberOfQuestions,
            questionMode,
            userId,
          }),
        });

        const data = await response.json();
        if (!didCancel && Array.isArray(data)) {
          setQuestions(data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();

    return () => {
      didCancel = true;
      localStorage.removeItem("timeLeft");
    };
  }, []);

  // Timer logic for timed tests
  useEffect(() => {
    if (isTimed) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            // handleTestCompletion(); // Handle test completion when time runs out
            // return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTimed]);

  // Handle test completion
  const handleTestCompletion = async () => {
    setIsTestComplete(true); // Mark the test as complete

    if (testHistoryId) {
      await updateTestResult(
        userId,
        score,
        questions.length,
        isTimed,
        isTutor,
        questionMode,
        numberOfQuestions,
        testHistoryId
      );
    }
  };

  // Handle answer submission
  const handleAnswerSubmission = async () => {
    const currentQ = questions[currentQuestion];

    if (submittedAnswers.has(Number(currentQ.id))) return;

    setIsAnswered(true); // Mark question as answered
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    const answerToSubmit = selectedAnswer !== null ? selectedAnswer : -1;

    if (!testHistoryId) {
      console.log("Creating test history for the first answer");
      const historyId = await saveTestResult(
        userId,
        score,
        numberOfQuestions,
        isTimed,
        isTutor,
        questionMode,
        numberOfQuestions
      );

      setTestHistoryId(historyId);
      console.log("Test history created ID:", historyId);

      // Fetch user answers after creating test history
      try {
        const response = await fetch("/api/users-answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            question_id: currentQ.id,
            selected_answer: answerToSubmit,
            is_correct: isCorrect,
            test_history_id: historyId, // Use newly created history ID
          }),
        });

        const data = await response.json();
        setSubmittedAnswers((prev) => new Set(prev).add(Number(currentQ.id)));
        if (isCorrect) setScore((prevScore) => prevScore + 1);
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    } else {
      // Fetch user answers if test history already exists
      try {
        const response = await fetch("/api/users-answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            question_id: currentQ.id,
            selected_answer: answerToSubmit,
            is_correct: isCorrect,
            test_history_id: testHistoryId, // Use existing history ID
          }),
        });

        const data = await response.json();
        setSubmittedAnswers((prev) => new Set(prev).add(Number(currentQ.id)));
        if (isCorrect) setScore((prevScore) => prevScore + 1);
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    }
  };

  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      handleTestCompletion();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const saveTestResult = async (
    userId: number,
    score: number,
    questions: number,
    timed: boolean,
    tutor: boolean,
    questionMode: string,
    newQuestions: number
  ): Promise<number | null> => {
    try {
      const response = await fetch("/api/save-test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      const data = await response.json();
      return data.id || null;
    } catch (error) {
      console.error("Error saving test result:", error);
      return null;
    }
  };

  const updateTestResult = async (
    userId: number,
    score: number,
    questions: number,
    timed: boolean,
    tutor: boolean,
    questionMode: string,
    newQuestions: number,
    testHistoryId: number
  ): Promise<void> => {
    try {
      const response = await fetch("/api/save-test-results", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          score,
          questions,
          timed,
          tutor,
          questionMode,
          newQuestions,
          testHistoryId,
        }),
      });

      await response.json();
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
      <ExamResults
        score={score}
        isTestComplete={true}
        questions={questions.map((q) => ({
          id: q.id,
          question: q.questionText,
          answer: q.correctAnswer.toString(),
        }))}
        resultData={resultData}
        testHistoryId={testHistoryId as number}
      />
    );
  }

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

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
              value={(timeLeft / (numberOfQuestions * 100)) * 100}
              className="mb-4"
            />
          )}
          <p className="text-lg mb-6">
            {questions[currentQuestion]?.questionText}
          </p>
          <RadioGroup
            value={selectedAnswer?.toString() || ""}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
          >
            {["answer1", "answer2", "answer3", "answer4"].map(
              (choice, index) => {
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
                    <Label
                      htmlFor={`choice-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {(questions[currentQuestion] as any)[`answer${answerId}`]}
                    </Label>
                    {isTutor && isAnswered && (
                      <div className="ml-2">
                        {isCorrect ? (
                          <CheckCircle className="text-green-600 h-5 w-5" />
                        ) : (
                          isSelected && (
                            <XCircle className="text-red-600 h-5 w-5" />
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </RadioGroup>
          {isTutor && isAnswered && (
            <p className="text-lg mb-6 text-gray-600">
              {questions[currentQuestion]?.comments}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => {
              if (!isAnswered) {
                handleAnswerSubmission();
              } else {
                handleNextQuestion();
              }
            }}
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
    </div>
  );
}

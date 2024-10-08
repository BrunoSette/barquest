"use client";

import { useTestLogic } from "@/hooks/useTestLogic";
import { ExamResults } from "./exam-results";
import QuestionCard from "./quiz/QuestionCard";
import TimerDisplay from "./quiz/TimerDisplay";
import { useEffect } from "react";
import { useSearchParams } from 'next/navigation';

export default function MultipleChoiceTest({
  userId,
}: {
  userId: number;
}) {
  const searchParams = useSearchParams();
  const searchParamsObject = searchParams ? Object.fromEntries(searchParams) : {};

  console.log("SearchParams in MultipleChoiceTest:", JSON.stringify(searchParamsObject, null, 2));

  const {
    questions,
    currentQuestion,
    score,
    isTestComplete,
    isAnswered,
    timeLeft,
    testHistoryId,
    selectedAnswer,
    setSelectedAnswer,
    handleSubmitAnswer,
    handleNextQuestion,
    handleCompleteTest,
    isTutor,
    isTimed,
    isLoading,
    handlePreviousQuestion,
    numberOfQuestions,
  } = useTestLogic(userId, searchParamsObject);

  useEffect(() => {
    console.log("MultipleChoiceTest rendered with state:", {
      currentQuestion,
      score,
      isTestComplete,
      isAnswered,
      timeLeft,
      testHistoryId,
      selectedAnswer,
      numberOfQuestions,
    });
  }, [currentQuestion, score, isTestComplete, isAnswered, timeLeft, testHistoryId, selectedAnswer, numberOfQuestions]);

  if (isLoading) {
    console.log("Test is loading");
    return <div>Loading questions...</div>;
  }

  if (isTestComplete) {
    console.log("Test is complete, rendering ExamResults");
    return (
      <ExamResults
        score={score}
        isTestComplete={true}
        questions={questions.map((q) => ({
          id: q.id,
          question: q.questionText,
          answer: q.correctAnswer.toString(),
        }))}
        resultData={[
          { name: "Correct", value: score },
          { name: "Incorrect", value: questions.length - score },
        ]}
        testHistoryId={testHistoryId as number}
      />
    );
  }

  if (questions.length === 0) {
    console.log("No questions available");
    return <div>No questions available.</div>;
  }

  const handleAnswer = async () => {
    console.log("handleAnswer called, isAnswered:", isAnswered);
    if (!isAnswered) {
      await handleSubmitAnswer();
    } else {
      if (currentQuestion === questions.length - 1) {
        console.log("Last question, completing test");
        await handleCompleteTest();
      } else {
        console.log("Moving to next question");
        await handleNextQuestion();
      }
    }
  };

  console.log("Rendering QuestionCard");
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Practice Quiz</h1>
      <p className="text-center mb-4">Total Questions: {numberOfQuestions}</p>
      <QuestionCard
        question={questions[currentQuestion]}
        currentQuestionNumber={currentQuestion + 1}
        totalQuestions={questions.length}
        isAnswered={isAnswered}
        isTutor={isTutor}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        handleAnswer={handleAnswer}
        handlePreviousQuestion={handlePreviousQuestion}
        isLastQuestion={currentQuestion === questions.length - 1}
        isFirstQuestion={currentQuestion === 0}
      >
        {isTimed && (
          <TimerDisplay
            timeLeft={timeLeft}
            totalTime={numberOfQuestions * 100}
          />
        )}
      </QuestionCard>
    </div>
  );
}

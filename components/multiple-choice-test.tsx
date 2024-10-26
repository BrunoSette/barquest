"use client";

import { useTestLogic } from "@/hooks/useTestLogic";
import { ExamResults } from "./exam-results";
import QuestionCard from "./quiz/QuestionCard";
import TimerDisplay from "./quiz/TimerDisplay";
import { useSearchParams } from "next/navigation";

export default function MultipleChoiceTest({ userId }: { userId: number }) {
  const searchParams = useSearchParams();
  const searchParamsObject = searchParams
    ? Object.fromEntries(searchParams)
    : {};

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
    answeredQuestions,
  } = useTestLogic(userId, searchParamsObject);

  if (isLoading) {
    console.log("Test is loading");
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="w-full max-w-2xl h-12 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full max-w-2xl space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
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
    return (
      <div>No questions available. Did you made a too restrictive filter?</div>
    );
  }

  const handleAnswer = async () => {
    console.log("handleAnswer called, isAnswered:", isAnswered);
    if (!isAnswered && selectedAnswer !== null) {
      await handleSubmitAnswer();
    }
    handleNextQuestion();
  };

  console.log("Rendering QuestionCard");
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <QuestionCard
        question={questions[currentQuestion]}
        currentQuestionNumber={currentQuestion + 1}
        totalQuestions={questions.length}
        isAnswered={isAnswered}
        isTutor={isTutor}
        selectedAnswer={answeredQuestions[currentQuestion] || selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        handleSubmitAnswer={handleSubmitAnswer}
        handleNextQuestion={handleAnswer}
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

import { useState, useEffect, useCallback, useRef } from "react";
import { Question } from "@/lib/db/schema";
import {
  getQuestions,
  getTestState,
  submitAnswer,
  completeTest,
  resetTestState, // Add this new function
} from "@/app/actions/testActions";

type TestState = {
  currentQuestion: number;
  score: number;
  isTestComplete: boolean;
  isAnswered: boolean;
  timeLeft: number;
  testHistoryId: number | null;
};

export function useTestLogic(
  userId: number,
  searchParams: { [key: string]: string | string[] | undefined } = {}
) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testState, setTestState] = useState<TestState>({
    currentQuestion: 0,
    score: 0,
    isTestComplete: false,
    isAnswered: false,
    timeLeft: 0,
    testHistoryId: null,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);

  const isTutor = searchParams?.isTutor === "true";
  const isTimed = searchParams?.isTimed === "true";
  const selectedSubjects = JSON.parse(
    (searchParams?.selectedSubjects as string) || "[]"
  );
  const questionMode = (searchParams?.questionMode as string) || "all";
  const numberOfQuestions = parseInt(
    Array.isArray(searchParams.numberOfQuestions)
      ? searchParams.numberOfQuestions[0]
      : searchParams.numberOfQuestions || "1",
    10
  );

  console.log("Search params:", JSON.stringify(searchParams, null, 2));
  console.log("isTutor:", isTutor);
  console.log("isTimed:", isTimed);
  console.log("selectedSubjects:", selectedSubjects);
  console.log("questionMode:", questionMode);
  console.log("Parsed numberOfQuestions:", numberOfQuestions);

  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTimeLeft = localStorage.getItem(`timeLeft_${userId}`);
    return storedTimeLeft ? parseInt(storedTimeLeft, 10) : 0;
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchQuestionsAndState = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      setIsLoading(true);
      try {
        console.log("Fetching questions and test state...");
        console.log("Number of questions requested:", numberOfQuestions);
        const fetchedQuestions = await getQuestions(
          userId,
          selectedSubjects,
          numberOfQuestions,
          questionMode
        );
        console.log("Fetched questions:", fetchedQuestions);
        setQuestions(fetchedQuestions);

        // Reset the test state before starting a new test
        await resetTestState(userId);
        const fetchedTestState = await getTestState(userId);
        console.log("Fetched test state:", fetchedTestState);
        setTestState(fetchedTestState);
      } catch (error) {
        console.error("Error fetching questions and test state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionsAndState();
  }, [userId, selectedSubjects, numberOfQuestions, questionMode]);

  useEffect(() => {
    if (isTimed && !isLoading && !testState.isTestComplete) {
      const totalTime = numberOfQuestions * 100; // 100 seconds per question
      const storedTimeLeft = localStorage.getItem(`timeLeft_${userId}`);
      const initialTimeLeft = storedTimeLeft ? parseInt(storedTimeLeft, 10) : totalTime;
      setTimeLeft(initialTimeLeft);

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime <= 1 ? 0 : prevTime - 1;
          localStorage.setItem(`timeLeft_${userId}`, newTime.toString());
          if (newTime === 0) {
            clearInterval(timerRef.current!);
            handleCompleteTest();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimed, isLoading, testState.isTestComplete, numberOfQuestions, userId]);

  const handleSubmitAnswer = useCallback(async () => {
    if (selectedAnswer === null) return;
    console.log("Submitting answer:", selectedAnswer);

    await submitAnswer(
      userId,
      questions[testState.currentQuestion].id,
      selectedAnswer,
      testState.testHistoryId
    );

    setTestState((prevState) => {
      const newState = {
        ...prevState,
        score:
          prevState.score +
          (selectedAnswer === questions[prevState.currentQuestion].correctAnswer
            ? 1
            : 0),
        isAnswered: true,
      };
      console.log("Updated test state after submitting answer:", newState);
      return newState;
    });
  }, [userId, questions, testState, selectedAnswer]);

  const handleNextQuestion = useCallback(async () => {
    console.log("Moving to next question");
    if (testState.currentQuestion < questions.length - 1) {
      setTestState((prevState) => {
        const newState = {
          ...prevState,
          currentQuestion: prevState.currentQuestion + 1,
          isAnswered: false,
        };
        console.log("Updated test state for next question:", newState);
        return newState;
      });
      setSelectedAnswer(null);
    } else {
      console.log("Reached last question");
    }
  }, [questions.length, testState]);

  const handleCompleteTest = useCallback(async () => {
    console.log("Completing test");
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    localStorage.removeItem(`timeLeft_${userId}`);
    await completeTest(userId, testState.testHistoryId);
    setTestState((prevState) => {
      const newState = { ...prevState, isTestComplete: true };
      console.log("Test completed, final state:", newState);
      return newState;
    });
  }, [userId, testState.testHistoryId]);

  const handlePreviousQuestion = useCallback(() => {
    console.log("Moving to previous question");
    if (testState.currentQuestion > 0) {
      setTestState((prevState) => {
        const newState = {
          ...prevState,
          currentQuestion: prevState.currentQuestion - 1,
          isAnswered: true, // Assuming the previous question was answered
        };
        console.log("Updated test state for previous question:", newState);
        return newState;
      });
    } else {
      console.log("Already at the first question");
    }
  }, [testState]);

  return {
    questions,
    currentQuestion: testState.currentQuestion,
    score: testState.score,
    isTestComplete: testState.isTestComplete,
    isAnswered: testState.isAnswered,
    timeLeft: testState.timeLeft,
    testHistoryId: testState.testHistoryId,
    selectedAnswer,
    setSelectedAnswer,
    handleSubmitAnswer,
    handleNextQuestion,
    handleCompleteTest,
    handlePreviousQuestion,
    isTutor,
    isTimed,
    isLoading,
    numberOfQuestions, // Add this to the returned object
    timeLeft,
  };
}

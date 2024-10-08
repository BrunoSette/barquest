import { useState, useEffect, useCallback, useRef } from "react";
import { Question } from "@/lib/db/schema";
import {
  getQuestions,
  getTestState,
  submitAnswer,
  completeTest,
  resetTestState,
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

  const [answeredQuestions, setAnsweredQuestions] = useState<{
    [key: number]: number;
  }>({});

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

  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // This effect will run only on the client-side
    const storedTimeLeft = localStorage.getItem(`timeLeft_${userId}`);
    setTimeLeft(
      storedTimeLeft ? parseInt(storedTimeLeft, 10) : numberOfQuestions * 100
    );

    // Retrieve answered questions from localStorage
    const storedAnsweredQuestions = localStorage.getItem(`answeredQuestions_${userId}`);
    if (storedAnsweredQuestions) {
      setAnsweredQuestions(JSON.parse(storedAnsweredQuestions));
    }

    // Retrieve questions from localStorage
    const storedQuestions = localStorage.getItem(`questions_${userId}`);
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, [userId, numberOfQuestions]);

  useEffect(() => {
    const fetchQuestionsAndState = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      setIsLoading(true);
      try {
        console.log("Fetching questions and test state...");
        console.log("Number of questions requested:", numberOfQuestions);
        
        // Check if questions are already in localStorage
        const storedQuestions = localStorage.getItem(`questions_${userId}`);
        let fetchedQuestions;
        if (storedQuestions) {
          fetchedQuestions = JSON.parse(storedQuestions);
        } else {
          fetchedQuestions = await getQuestions(
            userId,
            selectedSubjects,
            numberOfQuestions,
            questionMode
          );
          // Save questions to localStorage
          localStorage.setItem(`questions_${userId}`, JSON.stringify(fetchedQuestions));
        }
        
        console.log("Fetched questions:", fetchedQuestions);
        setQuestions(fetchedQuestions);

        // Reset the test state before starting a new test
        await resetTestState(userId);
        const fetchedTestState = await getTestState(userId);
        console.log("Fetched test state:", fetchedTestState);
        setTestState(fetchedTestState);

        // Restore answered questions state
        const storedAnsweredQuestions = localStorage.getItem(`answeredQuestions_${userId}`);
        if (storedAnsweredQuestions) {
          const parsedAnsweredQuestions = JSON.parse(storedAnsweredQuestions);
          setAnsweredQuestions(parsedAnsweredQuestions);
          setTestState(prevState => ({
            ...prevState,
            currentQuestion: Object.keys(parsedAnsweredQuestions).length,
            isAnswered: Object.keys(parsedAnsweredQuestions).length > 0,
          }));
        }
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
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime <= 1 ? 0 : prevTime - 1;
          if (typeof window !== "undefined") {
            localStorage.setItem(`timeLeft_${userId}`, newTime.toString());
          }
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

    const updatedAnsweredQuestions = {
      ...answeredQuestions,
      [testState.currentQuestion]: selectedAnswer,
    };
    setAnsweredQuestions(updatedAnsweredQuestions);

    // Save answered questions to localStorage
    localStorage.setItem(`answeredQuestions_${userId}`, JSON.stringify(updatedAnsweredQuestions));

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
  }, [userId, questions, testState, selectedAnswer, answeredQuestions]);

  const handleNextQuestion = useCallback(() => {
    console.log("Moving to next question");
    if (testState.currentQuestion < questions.length - 1) {
      setTestState((prevState) => {
        const nextQuestion = prevState.currentQuestion + 1;
        const newState = {
          ...prevState,
          currentQuestion: nextQuestion,
          isAnswered: !!answeredQuestions[nextQuestion],
        };
        console.log("Updated test state for next question:", newState);
        return newState;
      });
      setSelectedAnswer(answeredQuestions[testState.currentQuestion + 1] || null);
    } else {
      console.log("Reached last question");
    }
  }, [questions.length, testState, answeredQuestions]);

  const handlePreviousQuestion = useCallback(() => {
    console.log("Moving to previous question");
    if (testState.currentQuestion > 0) {
      setTestState((prevState) => {
        const previousQuestion = prevState.currentQuestion - 1;
        const newState = {
          ...prevState,
          currentQuestion: previousQuestion,
          isAnswered: !!answeredQuestions[previousQuestion],
        };
        console.log("Updated test state for previous question:", newState);
        return newState;
      });
      setSelectedAnswer(answeredQuestions[testState.currentQuestion - 1] || null);
    } else {
      console.log("Already at the first question");
    }
  }, [testState, answeredQuestions]);

  const handleCompleteTest = useCallback(async () => {
    console.log("Completing test");
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // If there's a selected answer for the last question and it hasn't been submitted yet, submit it
    if (selectedAnswer !== null && !testState.isAnswered) {
      await handleSubmitAnswer();
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(`timeLeft_${userId}`);
      localStorage.removeItem(`answeredQuestions_${userId}`);
      localStorage.removeItem(`questions_${userId}`);
    }
    await completeTest(userId, testState.testHistoryId);
    setTestState((prevState) => {
      const newState = { ...prevState, isTestComplete: true };
      console.log("Test completed, final state:", newState);
      return newState;
    });
  }, [userId, testState, selectedAnswer, handleSubmitAnswer]);

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
    numberOfQuestions,
    timeLeft,
    answeredQuestions,
  };
}
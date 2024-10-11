"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { StatCard } from "./dashboard/StatCard";
import { calculatePassProbability } from "@/app/actions/calculatePassProbability";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

// Dynamic imports
const PerformanceBySubjectCard = dynamic(() =>
  import("./dashboard/PerformanceBySubjectCard").then(
    (mod) => mod.PerformanceBySubjectCard
  )
);

const OverallPerformanceChart = dynamic(() =>
  import("./dashboard/OverallPerformanceChart").then(
    (mod) => mod.OverallPerformanceChart
  )
);

const PerformanceHistoryChart = dynamic(() =>
  import("./dashboard/PerformanceHistoryChart").then(
    (mod) => mod.PerformanceHistoryChart
  )
);

const TestHistoryCard = dynamic(() =>
  import("./dashboard/TestHistoryCard").then((mod) => mod.TestHistoryCard)
);

const ProbabilityGauge = dynamic(() =>
  import("./dashboard/ProbabilityGauge").then((mod) => mod.ProbabilityGauge)
);

interface DashboardProps {
  userId: number;
  initialData: {
    totalAnswers: number;
    correctAnswers: number;
    answersPerSubject: {
      subject: string;
      total_answers: number;
      correct_answers: number;
    }[];
    testHistory: any[]; // Replace 'any' with the correct type
  };
  deleteTestHistory: (testHistoryId: any) => Promise<void>;
}

export function DashboardComponent({
  initialData,
  deleteTestHistory,
  userId,
}: DashboardProps) {
  const [probabilityData, setProbabilityData] = useState<{
    passProbability: number;
    marginOfError: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const { totalAnswers, correctAnswers, answersPerSubject, testHistory } =
    initialData;

  const performanceData = answersPerSubject.map((subjectData) => ({
    subject: subjectData.subject,
    correct: subjectData.correct_answers,
    incorrect: subjectData.total_answers - subjectData.correct_answers,
  }));

  const remainingQuestions = Math.max(0, 30 - totalAnswers);

  useEffect(() => {
    async function fetchProbabilityData() {
      try {
        const data = await calculatePassProbability(userId);
        setProbabilityData(data);
      } catch (error) {
        console.error("Error fetching probability data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProbabilityData();
  }, [userId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/newtest">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <PlusCircle className="mr-2 h-4 w-4" /> Create a New Test
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2">
          {totalAnswers >= 30 ? (
            <ProbabilityGauge
              probabilityData={probabilityData}
              loading={loading}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Current Pass Probability</CardTitle>
                <CardDescription>
                  Answer more questions to see your pass probability.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-48 flex flex-col items-center justify-center">
                  <p className="text-center text-lg mb-4">
                    You need to answer{" "}
                    <span className="font-bold">{remainingQuestions}</span> more
                    {remainingQuestions === 1 ? " question" : " questions"} to
                    see this data.
                  </p>
                  <Link href="/dashboard/newtest">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <PlusCircle className="mr-2 h-4 w-4" /> Create a New Test
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
          <StatCard
            title="Total Questions"
            value={totalAnswers}
            icon={BookOpen}
            subtitle={
              testHistory.length > 0 &&
              correctAnswers !== null &&
              totalAnswers > 0
                ? (() => {
                    const now = new Date();
                    const oneWeekAgo = new Date(now);
                    oneWeekAgo.setDate(now.getDate() - 7);
                    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
                    const lastWeekQuestions = testHistory
                      .filter((test) => {
                        const testDate = new Date(test.date);
                        return (
                          testDate >= oneWeekAgo && testDate < startOfToday
                        );
                      })
                      .reduce((sum, test) => sum + test.questions, 0);
                    const difference = totalAnswers - lastWeekQuestions;
                    return `+${difference} from last week`;
                  })()
                : undefined
            }
          />
          <StatCard
            title="Correct Answers"
            value={correctAnswers}
            icon={CheckCircle}
            subtitle={
              correctAnswers !== null && totalAnswers > 0
                ? `${totalAnswers - correctAnswers} Incorrect in ${
                    testHistory.length === 1
                      ? "1 test"
                      : `${testHistory.length} tests`
                  }`
                : undefined
            }
          />
          <StatCard
            title="Total Score"
            value={
              totalAnswers !== null &&
              correctAnswers !== null &&
              totalAnswers > 0
                ? `${((correctAnswers / totalAnswers) * 100).toFixed(0)}%`
                : 0
            }
            icon={TrendingUp}
            subtitle={
              testHistory.length !== null &&
              correctAnswers !== null &&
              totalAnswers > 0
                ? (() => {
                    const now = new Date();
                    const oneWeekAgo = new Date(now);
                    oneWeekAgo.setDate(now.getDate() - 7);
                    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
                    const lastWeekTests = testHistory.filter((test) => {
                      const testDate = new Date(test.date);
                      return testDate >= oneWeekAgo && testDate < startOfToday;
                    });
                    if (lastWeekTests.length === 0) {
                      const currentScore =
                        (correctAnswers / totalAnswers) * 100;
                      return `+${currentScore.toFixed(1)}% from last week`;
                    }
                    const lastWeekCorrect = lastWeekTests.reduce(
                      (sum, test) => sum + test.score,
                      0
                    );
                    const lastWeekTotal = lastWeekTests.reduce(
                      (sum, test) => sum + test.questions,
                      0
                    );
                    const lastWeekScore =
                      lastWeekTotal > 0
                        ? (lastWeekCorrect / lastWeekTotal) * 100
                        : 0;
                    const currentScore = (correctAnswers / totalAnswers) * 100;
                    const difference = currentScore - lastWeekScore;
                    return `${difference > 0 ? "+" : ""}${difference.toFixed(
                      1
                    )}% from last week`;
                  })()
                : undefined
            }
          />
        </div>
      </div>

      <div className="w-full mt-6">
        <PerformanceBySubjectCard
          performanceData={performanceData}
          loading={false}
        />
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <OverallPerformanceChart
            correctAnswers={correctAnswers}
            totalAnswers={totalAnswers}
            loading={false}
          />
          <PerformanceHistoryChart testHistory={testHistory} loading={false} />
        </div>
      </div>

      <TestHistoryCard
        testHistory={testHistory}
        deleteTestHistory={deleteTestHistory}
        loading={false}
      />
    </div>
  );
}

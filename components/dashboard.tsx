"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { StatCard } from "./dashboard/StatCard";

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
}: DashboardProps) {
  const { totalAnswers, correctAnswers, answersPerSubject, testHistory } =
    initialData;

  const performanceData = answersPerSubject.map((subjectData) => ({
    subject: subjectData.subject,
    correct: subjectData.correct_answers,
    incorrect: subjectData.total_answers - subjectData.correct_answers,
  }));

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

      <div className="grid gap-2 grid-cols-3">
        <StatCard
          title="Total Questions"
          value={totalAnswers}
          icon={BookOpen}
          subtitle={
            testHistory.length > 0 &&
            correctAnswers !== null &&
            totalAnswers > 0
              ? (() => {
                  const lastWeekQuestions = testHistory
                    .filter(
                      (test) =>
                        new Date(test.date) >=
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    )
                    .reduce((sum, test) => sum + test.questions, 0);
                  const difference = totalAnswers - lastWeekQuestions;
                  return `${difference} from last week`;
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
                  testHistory.length === 1 ? '1 test' : `${testHistory.length} tests`
                }`
              : undefined
          }
        />
        <StatCard
          title="Total Score"
          value={
            totalAnswers !== null && correctAnswers !== null && totalAnswers > 0
              ? `${((correctAnswers / totalAnswers) * 100).toFixed(0)}%`
              : 0
          }
          icon={TrendingUp}
          subtitle={
            testHistory.length !== null &&
            correctAnswers !== null &&
            totalAnswers > 0
              ? (() => {
                  const lastWeekScore = testHistory
                    .filter(
                      (test) =>
                        new Date(test.date) >=
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    )
                    .reduce((sum, test) => sum + test.score, 0);
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

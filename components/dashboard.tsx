"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { StatCard } from "./dashboard/StatCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

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
  showWelcomeDialog?: boolean;
}

export function DashboardComponent({
  initialData,
  deleteTestHistory,
  showWelcomeDialog = false,
}: DashboardProps) {
  const { totalAnswers, correctAnswers, answersPerSubject, testHistory } =
    initialData;

  const performanceData = answersPerSubject.map((subjectData) => ({
    subject: subjectData.subject,
    correct: subjectData.correct_answers,
    incorrect: subjectData.total_answers - subjectData.correct_answers,
  }));

  const [isWelcomeOpen, setIsWelcomeOpen] = useState(showWelcomeDialog);

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
                  const now = new Date();
                  // Get the date exactly 7 days ago (start of "last week")
                  const oneWeekAgo = new Date(now);
                  oneWeekAgo.setDate(now.getDate() - 7);

                  // Get the date at the start of today (end of "last week")
                  const startOfToday = new Date(now.setHours(0, 0, 0, 0));

                  // Filter for tests between oneWeekAgo and startOfToday (only last week's tests)
                  const lastWeekQuestions = testHistory
                    .filter((test) => {
                      const testDate = new Date(test.date);
                      return testDate >= oneWeekAgo && testDate < startOfToday;
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
                  const now = new Date();
                  // Get the date exactly 7 days ago (start of "last week")
                  const oneWeekAgo = new Date(now);
                  oneWeekAgo.setDate(now.getDate() - 7);

                  // Get the date at the start of today (end of "last week")
                  const startOfToday = new Date(now.setHours(0, 0, 0, 0));

                  // Filter for tests between oneWeekAgo and startOfToday (only last week's tests)
                  const lastWeekTests = testHistory.filter((test) => {
                    const testDate = new Date(test.date);
                    return testDate >= oneWeekAgo && testDate < startOfToday;
                  });

                  if (lastWeekTests.length === 0) {
                    // If no tests from last week, set last week score to 0
                    const currentScore = (correctAnswers / totalAnswers) * 100;
                    // Difference is just the current score
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
                  console.log("current score", currentScore);
                  console.log("last week score", lastWeekScore);
                  const difference = currentScore - lastWeekScore;
                  console.log("difference", difference);
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

      <Dialog open={isWelcomeOpen} onOpenChange={setIsWelcomeOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Welcome to BarQuest! 🎉
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p>
                Congratulations on joining BarQuest! We are here to help you
                prepare for your Ontario Bar Exam with confidence.
              </p>
              <p>
                To get started, click the &ldquo;Create a New Test&rdquo; button
                below to begin your practice. You can track your progress and
                performance right here on your dashboard.
              </p>
              <p>
                Good luck with your studies! Remember, consistent practice is
                key to success.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              asChild
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              <a href="/dashboard/newtest">Create a New Test</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

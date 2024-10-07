"use client";

import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  BookOpen,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { TestDetail } from "@/app/types";
import { PerformanceBySubjectCard } from "./ui/performance-by-subject-card";
import { TestHistoryCard } from "./test-history-card";
import { useDashboardData } from "./hooks/useDashboardData";
import { StatCard } from "./dashboard/StatCard";
import { OverallPerformanceChart } from "./dashboard/OverallPerformanceChart";
import { PerformanceHistoryChart } from "./dashboard/PerformanceHistoryChart";

export function TestDetailsDialog({
  testId,
  testDate,
}: {
  testId: number;
  testDate?: string;
}) {
  const [testDetails, setTestDetails] = useState<TestDetail[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTestDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/users-answers?test_history_id=${testId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch test details");
      }
      const data = await response.json();
      setTestDetails(data);
    } catch (error) {
      console.error("Error fetching test details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(isOpen) => isOpen && fetchTestDetails()}>
      {" "}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white text-primary hover:bg-primary-foreground text-md px-8 py-5 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          View Test Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Test Details
          </DialogTitle>
          {testDate && (
            <DialogDescription className="text-muted-foreground">
              Test taken on {new Date(testDate).toLocaleString()}
            </DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className="h-[70vh] mt-6 pr-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          ) : testDetails ? (
            testDetails.map((detail, index) => (
              <div
                key={index}
                className="mb-8 p-6 bg-card rounded-lg shadow-md border border-border"
              >
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                  Question {index + 1}: {detail.question_text}
                </h3>
                <div className="mb-4 p-3 bg-muted rounded-md">
                  <p className="font-medium text-muted-foreground">
                    Your Answer:{" "}
                    <span
                      className={
                        detail.is_correct
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {detail[`answer${detail.selected_answer}`]}
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  {["answer1", "answer2", "answer3", "answer4"].map(
                    (answerKey, idx) => {
                      const answerNumber = idx + 1;
                      const isCorrectAnswer =
                        answerNumber === detail.correct_answer;
                      const isSelectedAnswer =
                        answerNumber === detail.selected_answer;
                      let Icon = null;
                      let bgColorClass = "";

                      if (isCorrectAnswer) {
                        Icon = CheckCircle2;
                        bgColorClass = "bg-green-100";
                      } else if (isSelectedAnswer && !detail.is_correct) {
                        Icon = XCircle;
                        bgColorClass = "bg-red-100";
                      }

                      return (
                        <div
                          key={idx}
                          className={`flex items-center p-2 rounded-md ${bgColorClass}`}
                        >
                          {Icon && (
                            <Icon
                              className={`w-5 h-5 mr-2 ${
                                isCorrectAnswer
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            />
                          )}
                          <p
                            className={`flex-grow ${
                              isCorrectAnswer
                                ? "text-green-700"
                                : isSelectedAnswer && !detail.is_correct
                                ? "text-red-700"
                                : "text-card-foreground"
                            }`}
                          >
                            {detail[answerKey]}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <p>Subject: {detail.subject}</p>
                </div>
                {detail.comments && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Comments:</span>{" "}
                      {detail.comments}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No details available
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function DashboardComponent({ userId }: { userId: number }) {
  const { totalAnswers, correctAnswers, answersPerSubject, testHistory, loading, deleteTestHistory } = useDashboardData(userId);

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Questions Attempted"
          value={totalAnswers}
          icon={BookOpen}
        />
        <StatCard
          title="Correct Answers"
          value={correctAnswers}
          icon={CheckCircle}
          subtitle={totalAnswers !== null && correctAnswers !== null && totalAnswers > 0
            ? `${((correctAnswers / totalAnswers) * 100).toFixed(0)}% correct rate`
            : undefined}
        />
        <StatCard
          title="Incorrect Answers"
          value={totalAnswers !== null && correctAnswers !== null ? totalAnswers - correctAnswers : null}
          icon={XCircle}
          subtitle={totalAnswers !== null && correctAnswers !== null && totalAnswers > 0
            ? `${(((totalAnswers - correctAnswers) / totalAnswers) * 100).toFixed(0)}% error rate`
            : undefined}
        />
      </div>

      <div className="w-full mt-6">
        <PerformanceBySubjectCard
          performanceData={performanceData}
          loading={loading}
        />
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <OverallPerformanceChart
            correctAnswers={correctAnswers}
            totalAnswers={totalAnswers}
            loading={loading}
          />
          <PerformanceHistoryChart
            testHistory={testHistory}
            loading={loading}
          />
        </div>
      </div>

      <TestHistoryCard
        testHistory={testHistory}
        loading={loading}
        deleteTestHistory={deleteTestHistory}
      />
    </div>
  );
}
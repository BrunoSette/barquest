"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  PlusCircle,
  BookOpen,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { COLORS } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { TestDetail, TestHistory } from "@/app/types";
import { PerformanceBySubjectCard } from "./ui/performance-by-subject-card";
import { TestHistoryCard } from "./test-history-card";

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
  const [totalAnswers, setTotalAnswers] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [answersPerSubject, setAnswersPerSubject] = useState<
    { subject: string; total_answers: number; correct_answers: number }[]
  >([]);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);

  const deleteTestHistory = async (testHistoryId: number) => {
    try {
      const response = await fetch("/api/save-test-results", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testHistoryId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Refresh the data after deletion
      await fetchTotalAnswers();
    } catch (error) {
      console.error("Error deleting test history:", error);
    }
  };

  async function fetchTotalAnswers() {
    try {
      const response = await fetch(`/api/total_answers?user_id=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setTotalAnswers(data.total_answers);
      setCorrectAnswers(data.correct_answers);
      setAnswersPerSubject(data.answers_per_subject);
      setTestHistory(data.test_history);
      console.log("Data test history", data.test_history);
    } catch (error) {
      console.error("Error fetching total answers:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTotalAnswers();
  }, [userId]);

  const overallPerformance = [
    { name: "Correct", value: correctAnswers },
    { name: "Incorrect", value: (totalAnswers || 0) - (correctAnswers || 0) },
  ];

  const performanceData = answersPerSubject.map((subjectData) => ({
    subject: subjectData.subject,
    correct: subjectData.correct_answers,
    incorrect: subjectData.total_answers - subjectData.correct_answers,
  }));

  const performanceHistory = testHistory.map((test) => ({
    date: new Date(test.date).toLocaleString(), // Format the date
    score: (test.score / test.questions) * 100, // Calculate the score
  }));

  console.log("performanceData", performanceData);

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Questions Attempted
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAnswers !== null && correctAnswers !== null ? (
                totalAnswers
              ) : (
                <Skeleton className="w-[100%] h-[16px]" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Correct Answers
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAnswers !== null && correctAnswers !== null ? (
                correctAnswers
              ) : (
                <Skeleton className="w-[100%] h-[16px]" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalAnswers !== null &&
              correctAnswers !== null &&
              totalAnswers > 0 ? (
                `${((correctAnswers / totalAnswers) * 100).toFixed(
                  0
                )}% correct rate`
              ) : (
                <div></div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Incorrect Answers
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAnswers !== null && correctAnswers !== null ? (
                totalAnswers - correctAnswers
              ) : (
                <Skeleton className="w-[100%] h-[16px]" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalAnswers !== null &&
              correctAnswers !== null &&
              totalAnswers > 0 ? (
                `${(
                  ((totalAnswers - correctAnswers) / totalAnswers) *
                  100
                ).toFixed(0)}% error rate`
              ) : (
                <div></div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Subject */}
      <div className="w-full mt-6">
        <PerformanceBySubjectCard
          performanceData={performanceData}
          loading={loading}
        />
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          {/* Overall Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overallPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {overallPerformance.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          {/* Performance History */}
          <Card>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      style={{ fontSize: "12px" }}
                      tickFormatter={(date) => {
                        const parsedDate = new Date(date);
                        return isNaN(parsedDate.getTime())
                          ? "Invalid Date"
                          : format(parsedDate, "dd/MM");
                      }}
                    />
                    <YAxis type="number" style={{ fontSize: "12px" }} />
                    <Tooltip contentStyle={{ fontSize: "12px" }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={COLORS[0]}
                      name="Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
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

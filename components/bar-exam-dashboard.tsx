"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { PlusCircle, BookOpen, CheckCircle, XCircle } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface TestDetail {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  comment?: string;
}

interface TestHistory {
  id: number;
  score: number;
  questions: number;
  timed: boolean;
  tutor: boolean;
  questionmode: string;
  new_questions: number;
  date: string;
}

export function TestDetailsDialog({ test }: { test: TestHistory }) {
  const [testDetails, setTestDetails] = useState<TestDetail[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTestDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/user-answers?test_history_id=${test.id}`
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
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] w-[90vw]">
        <DialogHeader>
          <DialogTitle>Test Details</DialogTitle>
          <DialogDescription>
            Test taken on {new Date(test.date).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : testDetails ? (
            testDetails.map((detail, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Question {index + 1}: {detail.question}
                </h3>
                <p className="mb-1">
                  Your Answer:{" "}
                  <span
                    className={
                      detail.isCorrect ? "text-green-600" : "text-red-600"
                    }
                  >
                    {detail.userAnswer}
                  </span>
                </p>
                {!detail.isCorrect && (
                  <p className="mb-1 text-green-600">
                    Correct Answer: {detail.correctAnswer}
                  </p>
                )}
                {detail.comment && (
                  <p className="mt-2 text-sm text-gray-600">{detail.comment}</p>
                )}
              </div>
            ))
          ) : (
            <p>No details available</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function BarExamDashboardComponent({ userId }: { userId: number }) {
  const [totalAnswers, setTotalAnswers] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [answersPerSubject, setAnswersPerSubject] = useState<
    { subject: string; total_answers: number; correct_answers: number }[]
  >([]);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);

  useEffect(() => {
    const fetchTotalAnswers = async () => {
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
    };

    if (userId) {
      fetchTotalAnswers();
    }
  }, [userId]); // Ensure this runs only when userId changes

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
        <h1 className="text-3xl font-bold">Bar Exam Practice Dashboard</h1>
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

      <div className="w-full mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance by Subject</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  layout="horizontal"
                  margin={{ top: 5, right: 2, left: 2, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="subject"
                    type="category"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis type="number" style={{ fontSize: "12px" }} />
                  <Tooltip contentStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="correct" fill={COLORS[0]} name="Correct" />
                  <Bar dataKey="incorrect" fill={COLORS[1]} name="Incorrect" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
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
                      tickFormatter={(date) => format(new Date(date), "dd/MM")}
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Table>
              <TableCaption>A list of your recent test attempts.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-center">Ord.</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Questions</TableHead>
                  <TableHead className="text-center">Timed</TableHead>
                  <TableHead className="text-center">Tutor</TableHead>
                  <TableHead className="text-center">Test Mode</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testHistory
                  .slice()
                  .sort((a, b) => +new Date(b.date) - +new Date(a.date))
                  .map((test, index, array) => (
                    <TableRow key={`${test.id}-${index}`}>
                      <TableCell className="text-center">
                        {array.length - index}
                      </TableCell>
                      <TableCell className="text-center">
                        {totalAnswers !== null && totalAnswers > 0
                          ? ((test.score / test.questions) * 100).toFixed(0)
                          : "0"}
                        %
                      </TableCell>
                      <TableCell className="text-center">
                        {test.questions}
                      </TableCell>
                      <TableCell className="text-center">
                        {test.timed ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-center">
                        {test.tutor ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-center">
                        {test.questionmode}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(test.date).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {/* Use the TestDetailsDialog component */}
                        <TestDetailsDialog test={test} />
                      </TableCell>
                    </TableRow>
                  ))}
                {/* New row for questions sum and score average */}
                <TableRow>
                  <TableCell className="text-center font-bold">Total</TableCell>
                  <TableCell className="text-center font-bold">
                    {testHistory.length > 0
                      ? (
                          testHistory.reduce((acc, test) => {
                            if (test.questions > 0) {
                              return acc + (test.score / test.questions) * 100;
                            }
                            return acc;
                          }, 0) / testHistory.length
                        ).toFixed(0)
                      : "0"}
                    %
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {testHistory.reduce((acc, test) => acc + test.questions, 0)}
                  </TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

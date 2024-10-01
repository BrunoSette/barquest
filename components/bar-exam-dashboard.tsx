"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";

const COLORS = ["#F97316", "#3B82F6"]; // Orange and Blue

export function BarExamDashboardComponent({ userId }: { userId: number }) {
  const [totalAnswers, setTotalAnswers] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number | null>(null);
  const [answersPerSubject, setAnswersPerSubject] = useState<
    { subject: string; total_answers: number; correct_answers: number }[]
  >([]);
  const [testHistory, setTestHistory] = useState<
    {
      id: number;
      score: number;
      questions: number;
      timed: boolean;
      tutor: boolean;
      new_questions: number;
      date: string;
    }[]
  >([]);

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
      } catch (error) {
        console.error("Error fetching total answers:", error);
      }
    };

    if (userId) {
      fetchTotalAnswers();
    }
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
    date: test.date,
    score: test.score,
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
            <div className="text-2xl font-bold">{totalAnswers}</div>
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
              {totalAnswers !== null && correctAnswers !== null
                ? correctAnswers
                : "Loading..."}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalAnswers !== null && correctAnswers !== null
                ? `${((correctAnswers / totalAnswers) * 100).toFixed(2)}% correct rate`
                : "Loading..."}
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
              {totalAnswers !== null && correctAnswers !== null
                ? totalAnswers - correctAnswers
                : "Loading..."}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalAnswers !== null && correctAnswers !== null
                ? `${(((totalAnswers - correctAnswers) / totalAnswers) * 100).toFixed(2)}% error rate`
                : "Loading..."}
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
                <Bar dataKey="correct" fill="#F97316" name="Correct" />
                <Bar dataKey="incorrect" fill="#3B82F6" name="Incorrect" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                  <YAxis type="number" style={{ fontSize: "12px" }} />
                  <Tooltip contentStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#F97316"
                    name="Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your recent test attempts.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">Ord.</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Questions</TableHead>
                <TableHead className="text-center">Timed</TableHead>
                <TableHead className="text-center">Tutor</TableHead>
                <TableHead className="text-center">New Questions</TableHead>
                <TableHead className="text-center">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testHistory.map((test, index) => (
                <TableRow key={test.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    {((test.score / test.questions) * 100).toFixed(2)}%
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
                    {test.new_questions}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(test.date).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

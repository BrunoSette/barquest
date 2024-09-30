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

const performanceData = [
  { subject: "Business Law", correct: 75, incorrect: 25 },
  { subject: "Criminal Law", correct: 68, incorrect: 32 },
  { subject: "Civil Litigation", correct: 82, incorrect: 18 },
  { subject: "Estate Planning", correct: 70, incorrect: 30 },
  { subject: "Family Law", correct: 65, incorrect: 35 },
  {
    subject: "Professional Responsibility",
    correct: 70,
    incorrect: 30,
  },
  { subject: "Public Law", correct: 65, incorrect: 35 },
  { subject: "Real Estate", correct: 65, incorrect: 35 },
];

const overallPerformance = [
  { name: "Correct", value: 72 },
  { name: "Incorrect", value: 28 },
];

const COLORS = ["#F97316", "#3B82F6"]; // Orange and Blue

const testHistory = [
  {
    id: 1,
    score: "85%",
    questions: 50,
    timed: "Yes",
    tutor: "No",
    newQuestions: 10,
    date: "2023-10-01",
  },
  {
    id: 2,
    score: "90%",
    questions: 60,
    timed: "No",
    tutor: "Yes",
    newQuestions: 15,
    date: "2023-10-02",
  },
  {
    id: 3,
    score: "78%",
    questions: 40,
    timed: "Yes",
    tutor: "No",
    newQuestions: 5,
    date: "2023-10-05",
  },
  {
    id: 4,
    score: "92%",
    questions: 55,
    timed: "No",
    tutor: "Yes",
    newQuestions: 20,
    date: "2023-10-08",
  },
  {
    id: 5,
    score: "88%",
    questions: 45,
    timed: "Yes",
    tutor: "No",
    newQuestions: 8,
    date: "2023-10-10",
  },
];

const performanceHistory = testHistory.map((test) => ({
  date: test.date,
  score: parseFloat(test.score),
}));

export function BarExamDashboardComponent() {
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
            <div className="text-2xl font-bold">1,284</div>
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
            <div className="text-2xl font-bold">924</div>
            <p className="text-xs text-muted-foreground">72% success rate</p>
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
            <div className="text-2xl font-bold">360</div>
            <p className="text-xs text-muted-foreground">28% error rate</p>
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
              {testHistory.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="text-center">{test.id}</TableCell>
                  <TableCell className="text-center">{test.score}</TableCell>
                  <TableCell className="text-center">
                    {test.questions}
                  </TableCell>
                  <TableCell className="text-center">{test.timed}</TableCell>
                  <TableCell className="text-center">{test.tutor}</TableCell>
                  <TableCell className="text-center">
                    {test.newQuestions}
                  </TableCell>
                  <TableCell className="text-center">{test.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

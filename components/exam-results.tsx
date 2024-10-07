"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import Link from "next/link";
import { ArrowRight, BarChart2, Home } from "lucide-react";
import { TestDetailsDialog } from "./dashboard/TestDetailsDialog";
import { ExamResultsProps } from "@/app/types";
// import { COLORS } from "@/lib/utils";

export function ExamResults({
  isTestComplete,
  score,
  questions,
  // resultData,
  testHistoryId,
}: ExamResultsProps) {
  if (!isTestComplete) {
    return null; // Or a loading state
  }

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Practice Quiz Results
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Your Performance
          </CardTitle>
          <CardDescription className="text-center">
            You scored {score} out of {questions.length} questions correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full max-w-md mb-6">
            <Progress value={percentage} className="h-4" />
            <p className="text-center mt-2 text-2xl font-bold">{percentage}%</p>
          </div>
          {/* <div className="w-64 h-64 mb-8"> */}
          {/* <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resultData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resultData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer> */}
          {/* </div> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
            <Link href="/dashboard" passHref>
              <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white p-5">
                <Home className="mr-2 h-6 w-6" /> Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/newtest" passHref>
              <Button className="w-full bg-orange-500 hover:bg-orange-700 text-white p-5">
                <ArrowRight className="mr-2 h-6 w-6" /> Start New Test
              </Button>
            </Link>
            {testHistoryId && <TestDetailsDialog testId={testHistoryId} />}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2" />
            Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Great job on completing the practice test! Here&apos;s a breakdown
            of your performance:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Total questions: {questions.length}</li>
            <li>Correct answers: {score}</li>
            <li>Incorrect answers: {questions.length - score}</li>
            <li>Accuracy rate: {percentage}%</li>
          </ul>
          <p className="mt-4">
            Keep practicing to improve your score. Remember to review the
            questions you got wrong to strengthen your understanding of those
            topics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

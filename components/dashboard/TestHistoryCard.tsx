import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TestDetailsDialog } from "@/components/dashboard/TestDetailsDialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TestHistoryCardProps, TestHistoryItem } from "@/app/types";

const formatDate = (date: string | number | Date | undefined) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
};

const calculateScore = (score: number, questions: number) => {
  if (questions <= 0) return "0";
  return ((score / questions) * 100).toFixed(0);
};

export const TestHistoryCard: React.FC<TestHistoryCardProps> = ({
  testHistory,
  loading,
  deleteTestHistory,
}) => {
  const sortedTestHistory = useMemo(
    () =>
      [...testHistory].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [testHistory]
  );

  const totalQuestions = useMemo(
    () =>
      sortedTestHistory.reduce((acc, test) => acc + Number(test.questions), 0),
    [sortedTestHistory]
  );

  const averageScore = useMemo(() => {
    if (sortedTestHistory.length === 0) return "0";
    const totalScore = sortedTestHistory.reduce((acc, test) => {
      if (Number(test.questions) > 0) {
        return acc + (test.score / Number(test.questions)) * 100;
      }
      return acc;
    }, 0);
    return (totalScore / sortedTestHistory.length).toFixed(0);
  }, [sortedTestHistory]);

  const handleDelete = async (testId: number) => {
    try {
      await deleteTestHistory(testId);
    } catch (error) {
      console.error("Failed to delete test history:", error);
    }
  };

  const renderTableRow = (
    test: TestHistoryItem,
    index: number,
    array: TestHistoryItem[]
  ) => (
    <TableRow key={`${test.id}-${index}`}>
      <TableCell className="text-center">{array.length - index}</TableCell>
      <TableCell className="text-center">
        {calculateScore(test.score, Number(test.questions))}%
      </TableCell>
      <TableCell className="text-center">{test.questions}</TableCell>
      <TableCell className="text-center">{test.timed ? "Yes" : "No"}</TableCell>
      <TableCell className="text-center">{test.tutor ? "Yes" : "No"}</TableCell>
      <TableCell className="text-center">{test.questionmode}</TableCell>
      <TableCell className="text-center">{formatDate(test.date)}</TableCell>
      <TableCell className="text-center">
        <TestDetailsDialog
          testId={test.id}
          testDate={
            test.date
              ? new Date(test.date).toLocaleString("en-US", {
                  timeZone: "UTC",
                })
              : undefined
          }
        />
      </TableCell>
      <TableCell className="p-0">
        <div className="flex items-center justify-center h-full">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your test history record and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(test.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
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
                <TableHead className="text-center">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTestHistory.map(renderTableRow)}
              <TableRow>
                <TableCell className="text-center font-bold">Total</TableCell>
                <TableCell className="text-center font-bold">
                  {averageScore}%
                </TableCell>
                <TableCell className="text-center font-bold">
                  {totalQuestions}
                </TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
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
  );
};

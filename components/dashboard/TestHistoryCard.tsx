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
import { TestHistoryCardProps } from "@/app/types";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  AwaitedReactNode,
  ReactPortal,
} from "react";

export const deleteTestHistory = async (testHistoryId: number) => {
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

export const TestHistoryCard: React.FC<TestHistoryCardProps> = ({
  testHistory,
  loading,
  deleteTestHistory,
}) => (
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
            {testHistory
              .slice()
              .sort(
                (
                  a: { date: string | number | Date },
                  b: { date: string | number | Date }
                ) => +new Date(b.date) - +new Date(a.date)
              )
              .map(
                (
                  test: {
                    id: number;
                    score: number;
                    questions:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                    timed: any;
                    tutor: any;
                    questionmode:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                    date: string | number | Date | undefined;
                  },
                  index: number,
                  array: string | any[]
                ) => (
                  <TableRow key={`${test.id}-${index}`}>
                    <TableCell className="text-center">
                      {array.length - index}
                    </TableCell>
                    <TableCell className="text-center">
                      {test.questions !== null && Number(test.questions) > 0
                        ? ((test.score / Number(test.questions)) * 100).toFixed(
                            0
                          )
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
                      {test.date
                        ? new Date(test.date).toLocaleString("en-US", {
                            timeZone: "UTC",
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: true,
                          })
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <TestDetailsDialog
                        testId={test.id}
                        testDate={
                          test.date
                            ? new Date(test.date).toUTCString()
                            : undefined
                        }
                      />
                    </TableCell>
                    <TableCell className="p-0">
                      <div className="flex items-center justify-center h-full">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your test history record and
                                remove the data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTestHistory(test.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            {/* New row for questions sum and score average */}
            <TableRow>
              <TableCell className="text-center font-bold">Total</TableCell>
              <TableCell className="text-center font-bold">
                {testHistory.length > 0
                  ? (
                      testHistory.reduce(
                        (
                          acc: number,
                          test: { questions: number; score: number }
                        ) => {
                          if (test.questions > 0) {
                            return acc + (test.score / test.questions) * 100;
                          }
                          return acc;
                        },
                        0
                      ) / testHistory.length
                    ).toFixed(0)
                  : "0"}
                %
              </TableCell>
              <TableCell className="text-center font-bold">
                {testHistory.reduce(
                  (acc: any, test: { questions: any }) => acc + test.questions,
                  0
                )}
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
function fetchTotalAnswers() {
  throw new Error("Function not implemented.");
}

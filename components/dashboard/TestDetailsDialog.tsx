import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TestDetail } from "@/app/types";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

async function fetchTestDetails(testId: number): Promise<TestDetail[]> {
  const response = await fetch(`/api/users-answers?test_history_id=${testId}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch test details");
  }
  return response.json();
}

function TestDetails({ testDetails }: { testDetails: TestDetail[] }) {
  if (!Array.isArray(testDetails)) {
    return <div>No test details available</div>;
  }

  return (
    <div>
      {testDetails.map((detail, index) => (
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
                const isCorrectAnswer = answerNumber === detail.correct_answer;
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
                          isCorrectAnswer ? "text-green-600" : "text-red-600"
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
                <span className="font-medium">Comments:</span> {detail.comments}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function TestDetailsDialog({
  testId,
  testDate,
}: {
  testId: number;
  testDate?: string;
}) {
  const [testDetails, setTestDetails] = useState<TestDetail[]>([]);

  useEffect(() => {
    fetchTestDetails(testId)
      .then(setTestDetails)
      .catch((error) => console.error("Failed to fetch test details:", error));
  }, [testId]);

  return (
    <Dialog>
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
          <Suspense
            fallback={
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            }
          >
            <TestDetails testDetails={testDetails} />
          </Suspense>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

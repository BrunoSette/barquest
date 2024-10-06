import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@react-email/components";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { DialogHeader } from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";

interface TestDetail {
  [x: string]: any;
  subject: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  comment?: string;
}

interface TestHistory {
  subject: number;
  correct_answer: number;
  question_text: string;
  id: number;
  score: number;
  questions: number;
  timed: boolean;
  tutor: boolean;
  questionmode: string;
  new_questions: number;
  date: string;
}

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
        <Button className="bg-white text-primary hover:bg-primary-foreground text-md px-8 py-5 transition-all duration-300 ease-in-out transform hover:scale-105">
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

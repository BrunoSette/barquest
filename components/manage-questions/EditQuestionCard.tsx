import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/question";
import { Badge } from "@/components/ui/badge";

type QuestionCardProps = {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void; // Add this prop
};

export function QuestionCard({
  question,
  onEdit,
  onDelete,
  onApprove,
}: QuestionCardProps) {
  // Helper function to check if a choice is correct
  const isCorrectAnswer = (choice: string) => {
    if (!question.correctAnswer) return false;
    const answers = Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer];
    return answers.some((answer) => answer?.trim() === choice?.trim());
  };

  return (
    <Card className="mb-4 shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{question.subject}</h3>
            <p className="text-gray-700 mb-4">{question.questionText}</p>
          </div>
          <Badge
            variant={question.is_approved ? "default" : "secondary"}
            className="ml-2"
          >
            {question.is_approved ? "Approved" : "Pending"}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {question.choices.map((choice, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                isCorrectAnswer(choice)
                  ? "bg-green-100 border-green-500"
                  : "bg-gray-50 border-gray-200"
              } border`}
            >
              {choice}
            </div>
          ))}
        </div>

        {question.comments && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">{question.comments}</p>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          {!question.is_approved && (
            <Button
              onClick={onApprove}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Approve
            </Button>
          )}
          <Button onClick={onEdit} variant="outline">
            Edit
          </Button>
          <Button onClick={onDelete} variant="destructive">
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

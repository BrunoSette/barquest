import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/question";

type QuestionCardProps = {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
};

export function QuestionCard({ question, onEdit, onDelete }: QuestionCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{question.subject}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold mb-2">{question.questionText}</p>
        <ul className="list-disc pl-5">
          {question.choices.map((choice, index) => (
            <li
              key={index}
              className={
                choice === question.correctAnswer
                  ? "text-green-600 font-semibold"
                  : ""
              }
            >
              {choice}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <strong>Comments:</strong> {question.comments}
        </p>
        <p className="mt-2">
          <strong>Approved:</strong> {question.is_approved ? "Yes" : "No"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button onClick={onEdit} variant="outline">
          Edit
        </Button>
        <Button onClick={onDelete} variant="destructive">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
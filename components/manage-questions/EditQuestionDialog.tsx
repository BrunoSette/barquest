import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/types/question";
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type EditQuestionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  onSave: (question: Question) => void;
  subjects: string[];
};

export function EditQuestionDialog({
  isOpen,
  onClose,
  question,
  onSave,
  subjects,
}: EditQuestionDialogProps) {
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  if (!editedQuestion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] overflow-y-auto max-h-[80vh] p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Question
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Subject Select */}
          <div>
            <Label
              htmlFor="edit-subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </Label>
            <Select
              value={editedQuestion.subject}
              onValueChange={(value) =>
                setEditedQuestion({ ...editedQuestion, subject: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Text */}
          <div>
            <Label
              htmlFor="edit-question"
              className="block text-sm font-medium text-gray-700"
            >
              Question
            </Label>
            <Textarea
              id="edit-question"
              rows={4}
              value={editedQuestion.questionText}
              onChange={(e) =>
                setEditedQuestion({
                  ...editedQuestion,
                  questionText: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Answer Choices */}
          {editedQuestion.choices.map((choice, index) => (
            <div key={index}>
              <Label
                htmlFor={`edit-choice-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Choice {index + 1}
              </Label>
              <Textarea
                id={`edit-choice-${index}`}
                value={choice}
                rows={4}
                onChange={(e) => {
                  const newChoices = [...editedQuestion.choices];
                  newChoices[index] = e.target.value;
                  setEditedQuestion({ ...editedQuestion, choices: newChoices });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}

          {/* Correct Answer - Single selection radio buttons */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Correct Answer
            </Label>
            <RadioGroup
              value={editedQuestion.correctAnswer.toString()}
              onValueChange={(value) =>
                setEditedQuestion({
                  ...editedQuestion,
                  correctAnswer: value,
                })
              }
              className="mt-2 space-y-2"
            >
              {editedQuestion.choices.map((choice, index) => (
                <div className="flex items-center space-x-2" key={index}>
                  <RadioGroupItem
                    value={index.toString()}
                    id={`edit-correct-${index}`}
                  />
                  <Label
                    htmlFor={`edit-correct-${index}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    {choice}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Comments */}
          <div>
            <Label
              htmlFor="edit-comments"
              className="block text-sm font-medium text-gray-700"
            >
              Comments
            </Label>
            <Textarea
              id="edit-comments"
              value={editedQuestion.comments}
              rows={5}
              onChange={(e) =>
                setEditedQuestion({
                  ...editedQuestion,
                  comments: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Approved Switch */}
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="edit-approved"
              className="text-sm font-medium text-gray-700"
            >
              Approved
            </Label>
            <Switch
              id="edit-approved"
              checked={editedQuestion.is_approved}
              onCheckedChange={(checked) =>
                setEditedQuestion({ ...editedQuestion, is_approved: checked })
              }
              className="ml-2 h-6 w-11 rounded-full border-gray-300 bg-gray-200 focus:ring-indigo-500"
            />
          </div>
        </div>
        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button onClick={() => onSave(editedQuestion)} variant="outline">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

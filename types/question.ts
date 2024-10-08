export type Question = {
  id: string;
  subject: string;
  questionText: string;
  choices: string[];
  correctAnswer: string;
  is_approved: boolean;
  comments: string;
};
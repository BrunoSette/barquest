export interface TestDetail {
  [x: string]: any;
  subject: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  comment?: string;
}

export interface TestHistory {
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

export interface ExamResultsProps {
  isTestComplete: boolean;
  score: number;
  testHistoryId: number;
  questions: { id: number; question: string; answer: string }[];
  resultData: { name: string; value: number }[];
}

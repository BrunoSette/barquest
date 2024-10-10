"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type SubjectQuestionCount = {
  name: string;
  questions: number;
};

type QuestionsSummaryProps = {
  subjectCounts: SubjectQuestionCount[];
};

const Counter = ({
  value,
  duration = 5000,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        setCount(Math.min(Math.floor((progress / duration) * value), value));
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span className="text-2xl font-bold">{count}</span>;
};

const SubjectCounters = ({
  title,
  subjects,
}: {
  title: string;
  subjects: SubjectQuestionCount[];
}) => {
  const maxQuestions = useMemo(
    () => Math.max(...subjects.map((s) => s.questions)),
    [subjects]
  );
  const totalQuestions = useMemo(
    () => subjects.reduce((sum, subject) => sum + subject.questions, 0),
    [subjects]
  );

  return (
    <Card className="w-full max-w-xl mb-8">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {subjects.map((subject) => (
            <li key={subject.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{subject.name}</span>
                <Counter value={subject.questions} />
              </div>
              <Progress
                value={(subject.questions / maxQuestions) * 100}
                className="h-2"
              />
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Total Questions</span>
            <Counter value={totalQuestions} duration={2500} />
          </div>
          <Progress value={100} className="h-2 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export const QuestionsSummary = ({ subjectCounts }: QuestionsSummaryProps) => {
  return (
    <div className="flex flex-col items-center p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Questions Summary</h1>
      <SubjectCounters title="Subjects" subjects={subjectCounts} />
    </div>
  );
};

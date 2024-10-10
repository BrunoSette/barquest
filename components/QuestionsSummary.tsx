"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type SubjectQuestionCount = {
  name: string;
  questions: number;
};

type QuestionsSummaryProps = {
  subjectCounts: SubjectQuestionCount[];
};

export function QuestionsSummary({ subjectCounts }: QuestionsSummaryProps) {
  console.log("Subject counts in QuestionsSummary:", subjectCounts);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Number of Questions by Subject</CardTitle>
        <CardDescription>
          Comparison of question counts across different legal subjects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            questions: {
              label: "Number of Questions",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[500px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={subjectCounts}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="questions"
                fill="var(--color-questions)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

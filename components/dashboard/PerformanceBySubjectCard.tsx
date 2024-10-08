import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { PerformanceCardProps } from "@/app/types";
import { COLORS } from "@/lib/utils";

export const PerformanceBySubjectCard: React.FC<PerformanceCardProps> = ({
  performanceData,
  loading,
}) => {
  const processedData = performanceData.map((item) => {
    const total = item.correct + item.incorrect;
    return {
      subject: item.subject,
      percentage: (item.correct / total) * 100,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Subject</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              layout="horizontal"
              margin={{ top: 2, right: 5, left: 5, bottom: 2 }}
            >
              <XAxis dataKey="subject" type="category" />
              <YAxis type="number" domain={[0, 100]} />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(2)}%`,
                  "Correct",
                ]}
                contentStyle={{ fontSize: "12px" }}
              />
              <Bar dataKey="percentage" fill={COLORS[1]} name="Correct">
                <LabelList
                  dataKey="percentage"
                  position="top"
                  formatter={(value: number) => `${value.toFixed(0)}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

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
              margin={{ top: 10, right: 2, left: 2, bottom: 2 }}
            >
              <XAxis
                dataKey="subject"
                type="category"
                style={{ fontSize: "8px" }}
              />

              <YAxis
                type="number"
                domain={[0, 100]}
                style={{ fontSize: "10px" }}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(0)}%`,
                  "Correct",
                ]}
                contentStyle={{ fontSize: "14px" }}
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

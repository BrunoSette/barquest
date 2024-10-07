import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { COLORS } from "@/lib/utils";

interface OverallPerformanceChartProps {
  correctAnswers: number | null;
  totalAnswers: number | null;
  loading: boolean;
}

export function OverallPerformanceChart({ correctAnswers, totalAnswers, loading }: OverallPerformanceChartProps) {
  const overallPerformance = [
    { name: "Correct", value: correctAnswers },
    { name: "Incorrect", value: (totalAnswers || 0) - (correctAnswers || 0) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Performance</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={overallPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {overallPerformance.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { COLORS } from "@/lib/utils";
import { format } from "date-fns";
import { TestHistory } from "@/app/types";

interface PerformanceHistoryChartProps {
  testHistory: TestHistory[];
  loading: boolean;
}

export function PerformanceHistoryChart({
  testHistory,
  loading,
}: PerformanceHistoryChartProps) {
  const performanceHistory = testHistory.map((test) => ({
    date: new Date(test.date).toLocaleString(),
    score: (test.score / test.questions) * 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance History</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceHistory}>
              <XAxis
                dataKey="date"
                style={{ fontSize: "12px" }}
                tickFormatter={(date) => {
                  const parsedDate = new Date(date);
                  return isNaN(parsedDate.getTime())
                    ? "Invalid Date"
                    : format(parsedDate, "dd/MM");
                }}
                reversed={true}
              />
              <YAxis type="number" style={{ fontSize: "12px" }} />
              <Tooltip contentStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke={COLORS[0]}
                name="Score"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PerformanceCardProps } from "@/app/types";
const COLORS = ["#10B981", "#EF4444"];

export const PerformanceBySubjectCard: React.FC<PerformanceCardProps> = ({
  performanceData,
  loading,
}) => (
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
            data={performanceData}
            layout="horizontal"
            margin={{ top: 5, right: 2, left: 2, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="subject"
              type="category"
              style={{ fontSize: "12px" }}
            />
            <YAxis type="number" style={{ fontSize: "12px" }} />
            <Tooltip contentStyle={{ fontSize: "12px" }} />
            <Bar dataKey="correct" fill={COLORS[0]} name="Correct" />
            <Bar dataKey="incorrect" fill={COLORS[1]} name="Incorrect" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </CardContent>
  </Card>
);

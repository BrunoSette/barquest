"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface EmailChartProps {
  data: { date: string; count: number }[];
}

export default function EmailChart({ data }: EmailChartProps) {
  return (
    <ChartContainer
      config={{
        count: {
          label: "Number of Emails",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

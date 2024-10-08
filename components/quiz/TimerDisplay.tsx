"use client";

import { Progress } from "@/components/ui/progress";

type TimerDisplayProps = {
  timeLeft: number;
  totalTime: number;
};

export default function TimerDisplay({
  timeLeft,
  totalTime,
}: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <span className="text-sm font-bold">{formatTime(timeLeft)}</span>
      </div>
      <Progress value={(timeLeft / totalTime) * 100} className="w-full" />
    </div>
  );
}

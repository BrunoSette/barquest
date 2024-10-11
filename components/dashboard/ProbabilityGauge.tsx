import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProbabilityGaugeProps {
  probabilityData: {
    passProbability: number;
    passProbabilityLower: number;
    passProbabilityUpper: number;
    marginOfError: number;
    lower: number;
    upper: number;
  } | null;
  loading: boolean;
}

export function ProbabilityGauge({
  probabilityData,
  loading,
}: ProbabilityGaugeProps) {
  const probabilityRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const marginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !probabilityData) return;

    const probabilityElement = probabilityRef.current;
    const gaugeElement = gaugeRef.current;
    const marginElement = marginRef.current;

    if (probabilityElement && gaugeElement && marginElement) {
      const targetProbability = probabilityData.passProbability * 100;
      let currentProbability = 0;

      const updateProbability = () => {
        if (currentProbability < targetProbability) {
          currentProbability += 1;
          probabilityElement.textContent = `${currentProbability.toFixed(0)}%`;
          requestAnimationFrame(updateProbability);
        } else {
          probabilityElement.textContent = `${targetProbability.toFixed(0)}%`;
        }
      };

      probabilityElement.classList.add("animate-number");
      gaugeElement.classList.add("animate-gauge");
      marginElement.classList.add("animate-margin");
      updateProbability();
    }
  }, [loading, probabilityData]);

  const getColorClass = (probability: number) => {
    if (probability < 0.5) return "red";
    if (probability < 0.7) return "yellow";
    return "green";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Pass Probability</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!probabilityData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Pass Probability</CardTitle>
          <CardDescription>Unable to load data</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-48 flex items-center justify-center">
            <p>Error loading probability data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    passProbability,
    passProbabilityLower,
    passProbabilityUpper,
    marginOfError,
    lower,
    upper,
  } = probabilityData;

  const colorClass = getColorClass(passProbability);

  return (
    <div className="container mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Current Pass Probability</CardTitle>
          <CardDescription>
            Based on your recent performance in preparation tests.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative pt-10 pb-6">
            <div
              ref={probabilityRef}
              className={`text-6xl font-bold text-center mb-4 animate-number ${
                colorClass === "red"
                  ? "text-red-500"
                  : colorClass === "yellow"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {(passProbability * 100).toFixed(0)}%
            </div>
            <div className="relative w-full h-12 bg-gray-200 rounded-full overflow-hidden">
              <div
                ref={marginRef}
                className="absolute h-full bg-opacity-50"
                style={{
                  left: `${passProbabilityLower * 100}%`,
                  width: `${
                    (passProbabilityUpper - passProbabilityLower) * 100
                  }%`,
                  backgroundColor:
                    colorClass === "red"
                      ? "rgba(254, 202, 202, 0.5)"
                      : colorClass === "yellow"
                      ? "rgba(254, 240, 138, 0.5)"
                      : "rgba(187, 247, 208, 0.5)",
                }}
              ></div>
              <div
                ref={gaugeRef}
                className="absolute h-full animate-gauge"
                style={{
                  width: `${passProbability * 100}%`,
                  backgroundColor:
                    colorClass === "red"
                      ? "#ef4444"
                      : colorClass === "yellow"
                      ? "#eab308"
                      : "#22c55e",
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Assuming you need 75% of the test to pass and based on your
              current performance, your observed success rate per question is
              between {(lower * 100).toFixed(2)}% and {(upper * 100).toFixed(2)}
              % (95% confidence interval), with a margin of error of{" "}
              {(marginOfError * 100).toFixed(2)}%. Your probability of passing
              the test is{" "}
              {passProbabilityUpper > 0 && !isNaN(passProbabilityUpper)
                ? `between ${(passProbabilityLower * 100).toFixed(2)}% and ${(
                    passProbabilityUpper * 100
                  ).toFixed(2)}%`
                : "very low"}
              .
            </p>
          </div>
        </CardContent>
      </Card>
      <style jsx>{`
        @keyframes numberCountUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gaugeGrow {
          from {
            width: 0%;
          }
          to {
            width: ${passProbability * 100}%;
          }
        }
        @keyframes marginGrow {
          from {
            width: 0%;
          }
          to {
            width: ${(passProbabilityUpper - passProbabilityLower) * 100}%;
          }
        }
        .animate-number {
          animation: numberCountUp 1s ease-out;
        }
        .animate-gauge {
          animation: gaugeGrow 1.5s ease-out;
        }
        .animate-margin {
          animation: marginGrow 1.5s ease-out;
        }
      `}</style>
    </div>
  );
}

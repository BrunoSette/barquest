"use server";

import { db } from "@/lib/db/drizzle";
import { userAnswers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
// @ts-ignore
import { jStat } from "jstat";

interface ProbabilityResult {
  passProbability: number;
  passProbabilityLower: number;
  passProbabilityUpper: number;
  marginOfError: number;
  lower: number;
  upper: number;
}

export async function calculatePassProbability(
  userId: number
): Promise<ProbabilityResult> {
  const answers = await db
    .select({
      isCorrect: userAnswers.isCorrect,
    })
    .from(userAnswers)
    .where(eq(userAnswers.userId, userId));

  const totalQuestions = answers.length;
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;

  if (totalQuestions === 0) {
    return {
      passProbability: 0,
      passProbabilityLower: 0,
      passProbabilityUpper: 0,
      marginOfError: 0,
      lower: 0,
      upper: 0,
    };
  }

  const sampleProportion = correctAnswers / totalQuestions;

  // Z-score for 95% confidence level
  const zScore = 1.96;

  // Use Wilson Score Interval for Margin of Error
  const { lower, upper, marginOfError } = wilsonScoreInterval(
    totalQuestions,
    sampleProportion,
    zScore
  );

  // Calculate the probability of passing (getting at least 75% correct)
  const requiredProportion = 0.75;
  const requiredCorrectAnswers = Math.ceil(requiredProportion * totalQuestions);

  // Calculate pass probability at sample proportion
  const passProbability = safePassProbability(
    requiredCorrectAnswers - 1,
    totalQuestions,
    sampleProportion
  );

  // Calculate pass probability at lower bound
  const passProbabilityLower = safePassProbability(
    requiredCorrectAnswers - 1,
    totalQuestions,
    lower
  );

  // Calculate pass probability at upper bound
  const passProbabilityUpper = safePassProbability(
    requiredCorrectAnswers - 1,
    totalQuestions,
    upper
  );

  return {
    passProbability,
    passProbabilityLower,
    passProbabilityUpper,
    marginOfError,
    lower,
    upper,
  };
}

function safePassProbability(k: number, n: number, p: number): number {
  if (p <= 0) {
    return 0;
  }
  if (p >= 1) {
    return 1;
  }
  const cdf = jStat.binomial.cdf(k, n, p);
  if (isNaN(cdf) || !isFinite(cdf)) {
    return 0;
  }
  const probability = 1 - cdf;
  if (isNaN(probability) || !isFinite(probability)) {
    return 0;
  }
  return probability;
}

function wilsonScoreInterval(
  n: number,
  pHat: number,
  z: number = 1.96
): { lower: number; upper: number; marginOfError: number } {
  const denominator = 1 + z ** 2 / n;
  const center = (pHat + z ** 2 / (2 * n)) / denominator;
  const margin =
    (z * Math.sqrt((pHat * (1 - pHat)) / n + z ** 2 / (4 * n ** 2))) /
    denominator;

  const lower = center - margin;
  const upper = center + margin;

  return {
    lower: Math.max(0, lower),
    upper: Math.min(1, upper),
    marginOfError: margin,
  };
}

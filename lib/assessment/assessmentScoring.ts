import { questions, type AnswersMap, type Dimension } from "./assessmentConfig";
import type { ActivationContext, ReadinessProfileContent } from "./assessmentProfiles";
import { readinessProfiles } from "./assessmentProfiles";

export type ReadinessProfileKey =
  | "p1_critical"
  | "p2_fragmented"
  | "p3_structured"
  | "p4_integrated";

export type DimensionRating = {
  dimension: Dimension;
  raw: number; // 0–9 (three answers * max 3)
  percent: number; // 0–100, rounded to nearest 5
  stars: 1 | 2 | 3 | 4 | 5; // whole-star rating for UI
};

// Total: 0–45
export function calculateRawTotalScore(answers: AnswersMap): number {
  let rawTotal = 0;
  for (const q of questions) {
    const v = answers[q.id];
    if (v === undefined || v === null) continue;
    rawTotal += v; // 0–3
  }
  return rawTotal;
}

// Overall percent: 0–100, rounded to nearest 5
export function calculatePercentScore(rawTotal: number): number {
  const maxTotal = questions.length * 3; // 45
  if (maxTotal === 0) return 0;
  const pct = (rawTotal / maxTotal) * 100;
  return Math.round(pct / 5) * 5;
}

// Map overall percent to 1–5 stars
export function calculateOverallStars(percent: number): 1 | 2 | 3 | 4 | 5 {
  if (percent < 20) return 1;
  if (percent < 40) return 2;
  if (percent < 60) return 3;
  if (percent < 80) return 4;
  return 5;
}

// Section ratings: 0–9 raw -> 1–5 stars (no decimals)
export function calculateDimensionRatings(
  answers: AnswersMap
): Record<Dimension, DimensionRating> {
  const dims: Dimension[] = [
    "inventory_visibility",
    "order_fulfillment",
    "warehouse_operations",
    "multichannel_integration",
    "automation_scalability"
  ];

  const sums: Record<Dimension, number> = {
    inventory_visibility: 0,
    order_fulfillment: 0,
    warehouse_operations: 0,
    multichannel_integration: 0,
    automation_scalability: 0
  };

  const counts: Record<Dimension, number> = {
    inventory_visibility: 0,
    order_fulfillment: 0,
    warehouse_operations: 0,
    multichannel_integration: 0,
    automation_scalability: 0
  };

  for (const q of questions) {
    const v = answers[q.id];
    if (v === undefined || v === null) continue;
    sums[q.dimension] += v;
    counts[q.dimension] += 1;
  }

  const result: Record<Dimension, DimensionRating> = {} as any;

  dims.forEach((dim) => {
    const raw = sums[dim]; // 0–9
    const max = counts[dim] * 3; // typically 9
    const pct = max > 0 ? (raw / max) * 100 : 0;
    const percent = Math.round(pct / 5) * 5; // round to 5s

    // Map 0–9 -> stars: 0–1 =>1, 2–3 =>2, 4–5 =>3, 6–7 =>4, 8–9 =>5
    let stars: 1 | 2 | 3 | 4 | 5;
    if (raw <= 1) stars = 1;
    else if (raw <= 3) stars = 2;
    else if (raw <= 5) stars = 3;
    else if (raw <= 7) stars = 4;
    else stars = 5;

    result[dim] = { dimension: dim, raw, percent, stars };
  });

  return result;
}

export function mapScoreToProfile(rawTotal: number): ReadinessProfileKey {
  if (rawTotal <= 11) return "p1_critical";
  if (rawTotal <= 22) return "p2_fragmented";
  if (rawTotal <= 33) return "p3_structured";
  return "p4_integrated";
}

export type AssessmentOutcome = {
  rawTotal: number; // 0–45
  percent: number; // 0–100 rounded to 5
  overallStars: 1 | 2 | 3 | 4 | 5;
  profileKey: ReadinessProfileKey;
  profile: ReadinessProfileContent;
  dimensions: Record<Dimension, DimensionRating>;
};

export function calculateAssessmentOutcome(
  answers: AnswersMap,
  ctx: ActivationContext
): AssessmentOutcome {
  const rawTotal = calculateRawTotalScore(answers);
  const percent = calculatePercentScore(rawTotal);
  const overallStars = calculateOverallStars(percent);
  const profileKey = mapScoreToProfile(rawTotal);
  const dimensions = calculateDimensionRatings(answers);

  const baseProfile = readinessProfiles[profileKey];
  const profile: ReadinessProfileContent = {
    ...baseProfile,
    buildSummary: baseProfile.buildSummary
  };

  return {
    rawTotal,
    percent,
    overallStars,
    profileKey,
    profile,
    dimensions
  };
}

export type AssessmentScoreSummary = {
  rawTotal: number; // 0–45
  percent: number; // 0–100 rounded to 5
  overallStars: 1 | 2 | 3 | 4 | 5;
  dimensions: Record<Dimension, DimensionRating>;
};

export function calculateAssessmentScoreSummary(
  answers: AnswersMap
): AssessmentScoreSummary {
  const rawTotal = calculateRawTotalScore(answers);
  const percent = calculatePercentScore(rawTotal);
  const overallStars = calculateOverallStars(percent);
  const dimensions = calculateDimensionRatings(answers);

  return { rawTotal, percent, overallStars, dimensions };
}


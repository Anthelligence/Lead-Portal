"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/brand/TopBar";
import {
  calculateAssessmentOutcome,
  type AssessmentOutcome
} from "@/lib/assessment/assessmentScoring";
import type { AnswersMap } from "@/lib/assessment/assessmentConfig";
import type { ActivationContext } from "@/lib/assessment/assessmentProfiles";

const ANSWERS_STORAGE_KEY = "assessmentAnswers";
const ACTIVATION_STORAGE_KEY = "activationContext"; // optional, fallback used if missing

const defaultActivation: ActivationContext = {
  contactName: "Operations Lead",
  companyName: "Your Company",
  businessType: "Retail / Distribution",
  country: "your market"
};

const dimensionLabels: Record<string, string> = {
  inventory_visibility: "Inventory Visibility",
  order_fulfillment: "Order Fulfillment",
  warehouse_operations: "Warehouse Ops",
  multichannel_integration: "Multi-channel Integration",
  automation_scalability: "Automation & Scalability"
};

export default function AssessmentResultsPage() {
  const [outcome, setOutcome] = useState<AssessmentOutcome | null>(null);
  const [activation, setActivation] = useState<ActivationContext>(defaultActivation);
  const [missingAnswers, setMissingAnswers] = useState(false);

  const toNumericAnswers = (raw: AnswersMap): AnswersMap =>
    Object.entries(raw).reduce<AnswersMap>((acc, [qid, val]) => {
      const num = typeof val === "string" ? Number(val) : val;
      // accept legacy UI 1–4 by converting to 0–3
      if (num === 1 || num === 2 || num === 3 || num === 4) {
        acc[qid] = (num - 1) as AnswersMap[string];
      } else if (num === 0) {
        acc[qid] = 0;
      }
      return acc;
    }, {});

  useEffect(() => {
    localStorage.setItem("assessmentResultReady", "true");

    const storedAnswers = localStorage.getItem(ANSWERS_STORAGE_KEY);
    if (!storedAnswers) {
      setMissingAnswers(true);
      return;
    }

    let parsedAnswers: AnswersMap | null = null;
    try {
      parsedAnswers = JSON.parse(storedAnswers) as AnswersMap;
    } catch {
      setMissingAnswers(true);
      return;
    }

    let ctx = defaultActivation;
    const storedActivation = localStorage.getItem(ACTIVATION_STORAGE_KEY);
    if (storedActivation) {
      try {
        ctx = JSON.parse(storedActivation) as ActivationContext;
      } catch {
        ctx = defaultActivation;
      }
    }

    setActivation(ctx);

    const numericAnswers = toNumericAnswers(parsedAnswers);
    if (!Object.keys(numericAnswers).length) {
      setMissingAnswers(true);
      return;
    }

    const result = calculateAssessmentOutcome(numericAnswers, ctx);
    setOutcome(result);
  }, []);

  const summary = useMemo(() => {
    if (!outcome) return "";
    return outcome.profile.buildSummary(activation);
  }, [activation, outcome]);

  const highlightedSummary = useMemo(() => {
    const terms = [
      activation.contactName,
      activation.companyName,
      activation.businessType,
      activation.country
    ].filter(Boolean) as string[];

    if (!terms.length) return summary;

    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
    const parts = summary.split(pattern);

    return parts.map((part, idx) => {
      const isMatch = pattern.test(part);
      pattern.lastIndex = 0; // reset stateful regex for next test
      if (isMatch) {
        // Bold + underline for personalized inserts
        return (
          <span key={idx} className="font-semibold text-[#FE5E17]">
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  }, [activation, summary]);

  if (missingAnswers || !outcome) {
    return (
      <main className="min-h-screen px-4 py-6 space-y-6">
        <TopBar />
        <div className="card p-5 space-y-3 text-center">
          <p className="text-sm font-semibold text-gray-800">No answers found</p>
          <p className="text-sm text-gray-600">
            Please complete the assessment to view your personalized results.
          </p>
          <Link
            href="/portal/assessment/run"
            className="inline-block rounded-full bg-[#FE5E17] px-4 py-2 text-white text-sm font-semibold"
          >
            Go to assessment
          </Link>
        </div>
      </main>
    );
  }

  const { profile, percent, rawTotal, dimensions, overallStars } = outcome;

  const starArray = Array.from({ length: 5 }, (_, i) => i < overallStars);

  const colorClasses: Record<string, string> = {
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700"
  };

  const toFiveScale = (score: number) => Math.round((score / 20) * 10) / 10; // one decimal 0-5

  return (
    <main className="min-h-screen px-4 py-6 space-y-6 pb-10 bg-gray-50">
      <TopBar />

      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>
                {profile.emoji}
              </span>
              <h1 className="text-sm font-semibold text-gray-800">Profile</h1>
            </div>
            <p className="text-lg font-semibold text-gray-900">{profile.title}</p>
            <p className="text-xs text-gray-600">{profile.scoreBandLabel}</p>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${colorClasses[profile.colorTag] ?? "bg-gray-100 text-gray-700"}`}
            >
              {profile.label}
            </span>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-amber-500">
              {starArray.map((filled, idx) => (
                <span key={idx} aria-hidden className="text-xl leading-none">
                  {filled ? "★" : "☆"}
                </span>
              ))}
            </div>
            <p className="text-sm font-semibold text-gray-900 mt-1">{percent}%</p>
            <p className="text-xs text-gray-500">Raw: {rawTotal} / 45</p>
          </div>
        </div>
      </div>

      {/* 2. Scores by Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Section Scores</h3>
          <p className="text-xs text-gray-500">1–5 stars per dimension</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.entries(dimensions) as [string, any][]).map(([dim, rating]) => (
            <div
              key={dim}
              className="rounded-lg border border-gray-100 p-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-700">{dimensionLabels[dim] ?? dim}</p>
                <span className="text-[11px] text-gray-500">
                  {rating.stars} / 5 · {rating.percent}%
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2 text-amber-500">
                <span className="relative text-lg leading-none font-semibold tracking-wide">
                  <span className="text-gray-300">★★★★★</span>
                  <span
                    className="absolute inset-0 text-[#FE5E17] overflow-hidden"
                    style={{
                      width: `${Math.min(100, Math.max(0, (rating.stars / 5) * 100))}%`
                    }}
                  >
                    ★★★★★
                  </span>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF7A1A] via-[#FE5E17] to-[#FF7A1A] transition-[width] duration-300 ease-out"
                  style={{
                    width: `${Math.min(100, Math.max(0, (rating.stars / 5) * 100))}%`
                  }}
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                {rating.stars >= 5
                  ? "Best-in-class"
                  : rating.stars === 4
                  ? "Strong"
                  : rating.stars === 3
                  ? "Solid base"
                  : rating.stars === 2
                  ? "Emerging"
                  : "At risk"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Personalized Summary Card */}
      <div className="relative bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF7A1A] via-[#FE5E17] to-[#FF7A1A]" />
        <h3 className="text-sm font-semibold text-gray-800 mb-2 mt-1">Personalized Summary</h3>
        <p className="text-[15px] text-gray-700 leading-relaxed">{highlightedSummary}</p>
      </div>

      {/* 4. Upsides */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          What You Already Have (Strengths)
        </h3>
        <ul className="space-y-2.5">
          {profile.upsides.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[15px] text-gray-700 leading-relaxed">
              <span className="text-[#93D753] mt-0.5">✔</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Downsides */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Operational Risks (Downsides)
        </h3>
        <ul className="space-y-2.5">
          {profile.downsides.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[15px] text-gray-700 leading-relaxed">
              <span className="text-[#FE5E17] mt-0.5">⚠️</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 6. Future Outlook */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          If Nothing Changes (12–24 Month Outlook)
        </h3>
        <ul className="space-y-2.5">
          {profile.futureOutlook.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[15px] text-gray-700 leading-relaxed">
              <span className="text-[#4D93D6] mt-0.5">⬆</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 7. Unlocks */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          What You Could Unlock With Optimization
        </h3>
        <ul className="space-y-2.5">
          {profile.unlocks.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[15px] text-gray-700 leading-relaxed">
              <span className="text-[#93D753] mt-0.5">✨</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 8. Operational Priority */}
      <div className="relative bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF7A1A] via-[#FE5E17] to-[#FF7A1A]" />
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Operational Priority</h3>
        <p className="text-[15px] text-gray-700 leading-relaxed">{profile.operationalPriority}</p>
      </div>

      {/* 9. CTAs */}
      <div className="bg-[#FE5E17]/5 rounded-xl shadow-sm p-4 mb-6 border border-[#FE5E17]/20">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Recommended Next Steps</h3>
        <div className="space-y-3">
          <button className="w-full bg-[#FE5E17] text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2">
            <span>⚡</span>
            {profile.primaryCtaLabel}
          </button>
          <p className="text-sm text-gray-700 leading-relaxed text-center">
            {profile.primaryCtaDescription}
          </p>
          <button className="w-full border border-[#FE5E17] text-[#FE5E17] rounded-xl py-3 font-semibold flex items-center justify-center gap-2 bg-white">
            <span>🗓️</span>
            {profile.secondaryCtaLabel}
          </button>
          <p className="text-sm text-gray-700 leading-relaxed text-center">
            {profile.secondaryCtaDescription}
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pb-6">Powered by COTIT</div>
    </main>
  );
}


/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/brand/TopBar";

type TaskKey = "details" | "assessment" | "roi";

const STORAGE_KEYS = {
  details: "portalDetailsComplete",
  assessment: "assessmentResultReady",
  roi: "roiResultReady",
  reward: "portalRewardCode"
};

const cards = [
  {
    title: "Start the Self Assessment",
    description: "Unlock your personalized report + special reward.",
    href: "/portal/assessment",
    badge: "NEW"
  },
  {
    title: "See Your Savings",
    description: "Calculate your operational efficiency gains.",
    href: "/portal/roi"
  },
  {
    title: "Explore Resources",
    description: "E-book, use cases & more.",
    href: "/portal/resources"
  }
];

const checklist: Array<{
  key: TaskKey;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}> = [
  {
    key: "details",
    title: "Fill in your details",
    description: "Complete your business info so we can personalize results.",
    href: "/portal/settings/account",
    actionLabel: "Add details"
  },
  {
    key: "assessment",
    title: "Complete the Assessment",
    description: "Answer the 15 questions to get your tailored report.",
    href: "/portal/assessment/run",
    actionLabel: "Continue assessment"
  },
  {
    key: "roi",
    title: "Run the ROI Calculator",
    description: "Estimate savings to see your ROI summary.",
    href: "/portal/roi",
    actionLabel: "Open calculator"
  }
];

function generateRewardCode() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 7 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(
    ""
  );
}

export default function DashboardPage() {
  const [status, setStatus] = useState<Record<TaskKey, boolean>>({
    details: false,
    assessment: false,
    roi: false
  });
  const [rewardCode, setRewardCode] = useState<string | null>(null);

  const refreshProgress = () => {
    if (typeof window === "undefined") return;
    setStatus({
      details: localStorage.getItem(STORAGE_KEYS.details) === "true",
      assessment: localStorage.getItem(STORAGE_KEYS.assessment) === "true",
      roi: localStorage.getItem(STORAGE_KEYS.roi) === "true"
    });
    const storedCode = localStorage.getItem(STORAGE_KEYS.reward);
    setRewardCode(storedCode || null);
  };

  useEffect(() => {
    refreshProgress();
    const handleStorage = () => refreshProgress();
    const handleFocus = () => refreshProgress();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const completedCount = useMemo(() => Object.values(status).filter(Boolean).length, [status]);
  const allComplete = completedCount === checklist.length;

  const handleClaimReward = () => {
    const code = generateRewardCode();
    setRewardCode(code);
    try {
      localStorage.setItem(STORAGE_KEYS.reward, code);
    } catch (err) {
      console.warn("Could not persist reward code", err);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 space-y-6">
      <TopBar />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold font-heading">Welcome.</h1>
        <p className="text-sm text-gray-600">Your Control 360° Portal is ready.</p>
      </div>

      <div className="space-y-4">
        <div className="card p-5 space-y-4 border border-[#FE5E17]/20 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase font-semibold text-[#FE5E17]">Progress tracker</p>
              <h2 className="text-lg font-semibold font-heading text-gray-900">
                Finish these steps to unlock your reward
              </h2>
              <p className="text-sm text-gray-600">
                We&apos;ll check them off automatically as you complete each task.
              </p>
            </div>
            <span className="rounded-full bg-[#FE5E17]/10 px-3 py-1 text-xs font-semibold text-[#FE5E17]">
              {completedCount}/{checklist.length} done
            </span>
          </div>

          <div className="space-y-3">
            {checklist.map((task) => {
              const done = status[task.key];
              return (
                <Link
                  key={task.key}
                  href={task.href}
                  className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:border-[#FE5E17]/70 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE5E17]/60"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
                        done ? "bg-[#93D753]/20 text-[#3a7b16]" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {done ? "✓" : "•"}
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        {task.title}
                        {done ? <span className="text-xs text-[#3a7b16]">Done</span> : null}
                      </p>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-[#FE5E17] text-sm font-semibold">
                    <span aria-hidden>→</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="rounded-xl border border-dashed border-[#FE5E17]/60 bg-[#FE5E17]/5 p-4 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Claim your reward</p>
                <p className="text-xs text-gray-600">
                  Complete all three tasks to reveal your unique code.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClaimReward}
                disabled={!allComplete}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
                  allComplete
                    ? "bg-[#FE5E17] text-white hover:bg-[#e25414]"
                    : "bg-gray-200 text-gray-600 cursor-not-allowed"
                }`}
              >
                {allComplete ? "Claim reward" : "🔒 Claim reward"}
              </button>
            </div>

            {rewardCode ? (
              <div className="rounded-lg border border-[#FE5E17]/30 bg-white px-4 py-3 space-y-2">
                <p className="text-xs text-gray-600">Find out what your reward will be.</p>
                <p className="text-2xl font-mono tracking-widest text-[#FE5E17]">{rewardCode}</p>
                <Link
                  href="https://cotit.io/redeem-promotion"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#FE5E17]"
                >
                  Redeem promotion →
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}


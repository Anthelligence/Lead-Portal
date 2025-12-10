"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/brand/TopBar";
import {
  questions,
  type AnswersMap,
  type AnswerValue,
  type Question
} from "@/lib/assessment/assessmentConfig";

type SectionMeta = {
  title: string;
  section: 1 | 2 | 3 | 4 | 5;
};

const sectionMeta: SectionMeta[] = [
  { section: 1, title: "SECTION 1 — Inventory Visibility & SKU Management" },
  { section: 2, title: "SECTION 2 — Order Management & Fulfillment" },
  { section: 3, title: "SECTION 3 — Warehouse Operations & Internal Processes" },
  { section: 4, title: "SECTION 4 — Multi-Channel & Systems Integration" },
  { section: 5, title: "SECTION 5 — Automation, Planning & Scalability" }
];

const STORAGE_KEY = "assessmentAnswers";

const sectionStartNumber: Record<SectionMeta["section"], number> = {
  1: 1,
  2: 4,
  3: 7,
  4: 10,
  5: 13
};

export default function AssessmentRunPage() {
  const totalQuestions = questions.length;
  const questionsBySection = useMemo(() => {
    const map: Record<number, Question[]> = {};
    questions.forEach((q) => {
      map[q.section] = map[q.section] ? [...map[q.section], q] : [q];
    });
    return map;
  }, []);

  const [responses, setResponses] = useState<AnswersMap>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AnswersMap;
        setResponses(parsed);
      } catch {
        // ignore parse errors and start fresh
      }
    }
  }, []);

  const answeredCount = Object.keys(responses).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const allAnswered = answeredCount === totalQuestions;

  const handleSelect = (questionId: string, value: AnswerValue) => {
    setResponses((prev) => {
      const next = { ...prev, [questionId]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <main className="min-h-screen px-4 py-4 space-y-4 pb-28">
      <TopBar />

      <div className="space-y-2">
        <h1 className="text-xl font-semibold font-heading text-gray-900">
          Digital Transformation Assessment
        </h1>
      </div>

      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md pt-2 pb-3 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-[#FE5E17] font-semibold">{progress}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-gray-100">
          <div
            className="h-1 rounded-full bg-[#FE5E17] transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {sectionMeta.map((meta) => {
          const qs = questionsBySection[meta.section] || [];
          return (
            <section key={meta.section} className="space-y-4">
              <h2 className="text-sm font-semibold uppercase text-gray-600">{meta.title}</h2>
              <div className="space-y-4">
                {qs.map((question, idx) => {
                  const selected = responses[question.id];
                  const displayNumber = sectionStartNumber[question.section] + idx;
                  return (
                    <div key={question.id} className="card p-5 space-y-3">
                      <p className="text-base font-semibold font-heading">
                        {displayNumber}. {question.text}
                      </p>
                      <div className="space-y-3">
                        {question.options.map((option) => {
                          const isSelected = selected === option.value;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleSelect(question.id, option.value)}
                              className={`w-full text-left rounded-lg border px-4 py-3 transition ${
                                isSelected
                                  ? "border-[#FE5E17] bg-[#FE5E17]/5"
                                  : "border-gray-200 bg-white hover:border-[#FE5E17]/60"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                                    isSelected
                                      ? "border-[#FE5E17] bg-[#FE5E17]"
                                      : "border-gray-300"
                                  }`}
                                />
                                <span className="text-sm font-medium text-gray-800">
                                  {option.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="pb-10">
        <div className="card p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-[#FE5E17]/10 text-[#FE5E17] flex items-center justify-center text-sm font-semibold">
              🚀
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">
                Ready to see your tailored report?
              </p>
              <p className="text-xs text-gray-600">
                Submit your answers to generate your operational readiness insights.
              </p>
            </div>
          </div>
          <Link
            href="/portal/assessment/results"
            className={`block w-full rounded-full py-3 text-center text-white font-semibold transition ${
              allAnswered
                ? "bg-[#FE5E17] hover:bg-[#e65512]"
                : "bg-gray-300 pointer-events-none"
            }`}
          >
            {allAnswered ? "Submit & view results" : "Answer all questions to continue"}
          </Link>
        </div>
      </div>
    </main>
  );
}


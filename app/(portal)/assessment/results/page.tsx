"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const colorClasses: Record<string, string> = {
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700"
  };

  const fileName = useMemo(() => {
    if (!outcome) return "COTIT-Assessment.pdf";
    const safeLabel = outcome.profile.label.replace(/\s+/g, "-");
    return `COTIT-Assessment-${safeLabel}.pdf`;
  }, [outcome]);

  const generatePdf = useCallback(async () => {
    if (typeof window === "undefined" || !reportRef.current) return null;

    setExportError(null);
    setIsExporting(true);

    // clone report content without CTA / action buttons
    const clone = reportRef.current.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-pdf-exclude='true']").forEach((node) => node.remove());

    const styleNodes = (root: HTMLElement) => {
      root.querySelectorAll("div").forEach((node) => {
        const el = node as HTMLElement;
        el.style.breakInside = "avoid";
        el.style.pageBreakInside = "avoid";
        el.style.boxSizing = "border-box";
      });
    };

    styleNodes(clone);

    // helper to build a page wrapper with header + content
    const createPage = () => {
      const page = document.createElement("div");
      page.style.position = "relative";
      page.style.width = "794px"; // ~A4 width at 96dpi
      page.style.padding = "24px";
      page.style.background = "#ffffff";
      page.style.boxSizing = "border-box";
      page.style.display = "flex";
      page.style.flexDirection = "column";
      page.style.gap = "16px";
      return page;
    };

    const createHeader = () => {
      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.justifyContent = "space-between";
      header.style.marginBottom = "4px";
      header.style.borderBottom = "1px solid #e5e7eb";
      header.style.paddingBottom = "10px";

      const logoWrap = document.createElement("div");
      logoWrap.style.display = "flex";
      logoWrap.style.alignItems = "center";
      logoWrap.style.gap = "12px";

      const logo = document.createElement("img");
      logo.src = "/cotit-logo.png";
      logo.alt = "COTIT";
      logo.style.height = "26px";

      const title = document.createElement("div");
      title.style.fontSize = "15px";
      title.style.fontWeight = "700";
      title.style.color = "#0f172a";
      title.textContent = "Assessment Results";

      logoWrap.appendChild(logo);
      logoWrap.appendChild(title);
      header.appendChild(logoWrap);
      return header;
    };

    // capture key sections
    const section = (name: string) =>
      (clone.querySelector(`[data-pdf-section='${name}']`) as HTMLElement | null)?.cloneNode(
        true
      ) as HTMLElement | null;

    const profileSection = section("profile");
    const scoresSection = section("scores");
    const summarySection = section("summary");

    const restSections = Array.from(
      clone.querySelectorAll(
        "[data-pdf-section='upsides'],[data-pdf-section='downsides'],[data-pdf-section='future'],[data-pdf-section='unlocks'],[data-pdf-section='priority']"
      )
    ).map((n) => n.cloneNode(true) as HTMLElement);

    const page1 = createPage();
    page1.appendChild(createHeader());
    if (profileSection) page1.appendChild(profileSection);
    if (scoresSection) page1.appendChild(scoresSection);
    if (summarySection) page1.appendChild(summarySection);

    const page2 = createPage();
    page2.appendChild(createHeader());
    restSections.forEach((n) => page2.appendChild(n));

    const staging = document.createElement("div");
    staging.style.position = "absolute";
    staging.style.left = "-9999px";
    staging.style.top = "0";
    staging.appendChild(page1);
    staging.appendChild(page2);
    document.body.appendChild(staging);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const renderPage = async (el: HTMLElement) =>
        html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });

      const canvas1 = await renderPage(page1);
      const canvas2 = await renderPage(page2);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // mm

      const addCanvasToPdf = (canvas: HTMLCanvasElement, isFirst: boolean) => {
        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = pageWidth - margin * 2;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        let heightLeft = pdfHeight;
        let position = margin;

        if (!isFirst) pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, pdfWidth, pdfHeight, undefined, "FAST");
        heightLeft -= pageHeight - margin * 2;

        while (heightLeft > 0) {
          position = heightLeft - pdfHeight + margin;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", margin, position, pdfWidth, pdfHeight, undefined, "FAST");
          heightLeft -= pageHeight - margin * 2;
        }
      };

      addCanvasToPdf(canvas1, true);
      addCanvasToPdf(canvas2, false);

      const blob = pdf.output("blob");
      return { pdf, blob };
    } catch (error) {
      console.error("PDF generation failed", error);
      setExportError("Could not generate PDF. Please try again.");
      return null;
    } finally {
      setIsExporting(false);
      staging.remove();
    }
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    const result = await generatePdf();
    if (!result) return;
    result.pdf.save(fileName);
  }, [fileName, generatePdf]);

  const handleSharePdf = useCallback(async () => {
    const result = await generatePdf();
    if (!result) return;

    const { blob } = result;
    const file = new File([blob], fileName, { type: "application/pdf" });

    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "COTIT Assessment Report",
          text: "Check out my COTIT assessment results."
        });
        return;
      }

      if (navigator.share) {
        const url = URL.createObjectURL(blob);
        try {
          await navigator.share({
            title: "COTIT Assessment Report",
            text: "Check out my COTIT assessment results.",
            url
          });
        } finally {
          setTimeout(() => URL.revokeObjectURL(url), 2000);
        }
        return;
      }

      // fallback: download if share not supported
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setExportError("Sharing not supported on this device, PDF downloaded instead.");
    } catch (error) {
      console.error("Sharing failed", error);
      setExportError("Sharing failed. Try downloading the PDF instead.");
    }
  }, [fileName, generatePdf]);

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

  return (
    <main className="min-h-screen px-4 py-6 space-y-6 pb-10 bg-gray-50">
      <TopBar />

      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        data-pdf-exclude="true"
      >
        <div>
          <p className="text-xs text-gray-500">Assessment results</p>
          <h2 className="text-base font-semibold text-gray-900">Download or share your report</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl border border-[#FE5E17] px-4 py-2 text-sm font-semibold text-[#FE5E17] bg-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span aria-hidden>⬇️</span>
            {isExporting ? "Preparing..." : "Download PDF"}
          </button>
          <button
            onClick={handleSharePdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FE5E17] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span aria-hidden>📤</span>
            {isExporting ? "Preparing..." : "Share"}
          </button>
        </div>
      </div>

      {exportError && (
        <div
          data-pdf-exclude="true"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {exportError}
        </div>
      )}

      <div ref={reportRef} className="space-y-6">
        {/* 1. Profile Header Card */}
        <div
          className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          data-pdf-section="profile"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {profile.emoji}
                </span>
                <h1 className="text-sm font-semibold text-gray-800">Profile</h1>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.title}</p>
              <div className="flex items-center gap-2 flex-wrap text-xs text-gray-600">
                <span>{profile.scoreBandLabel}</span>
                <span
                  className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-tight ${colorClasses[profile.colorTag] ?? "bg-gray-100 text-gray-700"}`}
                >
                  {profile.label}
                </span>
              </div>
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
        <div
          className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          data-pdf-section="scores"
        >
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
              <div className="flex items-center gap-1 mb-2 text-amber-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className={`text-lg leading-none font-semibold ${
                      i < rating.stars ? "text-[#FE5E17]" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
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
        <div
          className="relative bg-white rounded-xl shadow-sm p-4 border border-gray-100 overflow-hidden"
          data-pdf-section="summary"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF7A1A] via-[#FE5E17] to-[#FF7A1A]" />
          <h3 className="text-sm font-semibold text-gray-800 mb-2 mt-1">Personalized Summary</h3>
          <p className="text-[15px] text-gray-700 leading-relaxed">{highlightedSummary}</p>
        </div>

        {/* 4. Upsides */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100" data-pdf-section="upsides">
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
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100" data-pdf-section="downsides">
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
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100" data-pdf-section="future">
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
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100" data-pdf-section="unlocks">
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
        <div
          className="relative bg-white rounded-xl shadow-sm p-4 border border-gray-100 overflow-hidden"
          data-pdf-section="priority"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF7A1A] via-[#FE5E17] to-[#FF7A1A]" />
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Operational Priority</h3>
          <p className="text-[15px] text-gray-700 leading-relaxed">{profile.operationalPriority}</p>
        </div>

        {/* 9. CTAs (excluded from PDF) */}
        <div
          data-pdf-exclude="true"
          className="bg-[#FE5E17]/5 rounded-xl shadow-sm p-4 border border-[#FE5E17]/20"
        >
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

        <div className="text-center text-xs text-gray-500 pb-2">Powered by COTIT</div>
      </div>
    </main>
  );
}


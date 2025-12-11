"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TopBar } from "@/components/brand/TopBar";
import {
  calculateRoi,
  type RoiInputs,
  type RoiResult,
  type RoiScenario
} from "@/lib/roiCalculator";

export default function RoiResultsPage() {
  const [storedResult, setStoredResult] = useState<RoiResult | null>(null);
  const [inputs, setInputs] = useState<RoiInputs | null>(null);
  const [scenario, setScenario] = useState<RoiScenario>("expected");
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sr = localStorage.getItem("roiResult");
    const si = localStorage.getItem("roiInputs");
    if (sr) {
      const parsed = JSON.parse(sr) as RoiResult;
      setStoredResult(parsed);
      setScenario(parsed.scenario);
    }
    if (si) setInputs(JSON.parse(si));
  }, []);

  const result = useMemo(() => {
    if (inputs) return calculateRoi(inputs, scenario);
    return storedResult;
  }, [inputs, scenario, storedResult]);

  const shareText = useMemo(() => {
    if (!result) return "";
    return `COTIT ROI (${scenario}) — Total savings ${formatCurrency(
      result.totals.totalSavingsYear
    )}, ROI ${formatMultiple(result.totals.roiMultiple)}, Payback ${formatOneDecimal(
      result.totals.paybackMonths
    )}`;
  }, [result, scenario]);

  const handleDownloadPdf = useCallback(async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    setShareMessage(null);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const clone = reportRef.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-pdf-exclude='true']").forEach((node) => node.remove());

      // Build a wrapper to inject logo and control sizing to fit one page
      const wrapper = document.createElement("div");
      wrapper.style.width = "1100px";
      wrapper.style.background = "#f8fafc";
      wrapper.style.padding = "16px";
      wrapper.style.boxSizing = "border-box";

      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.justifyContent = "space-between";
      header.style.marginBottom = "12px";

      const logo = document.createElement("img");
      logo.src = "/cotit-logo.png";
      logo.alt = "COTIT";
      logo.style.height = "26px";
      logo.style.objectFit = "contain";

      const title = document.createElement("div");
      title.style.fontSize = "14px";
      title.style.fontWeight = "700";
      title.style.color = "#111827";
      title.textContent = "ROI Summary";

      header.appendChild(logo);
      header.appendChild(title);
      wrapper.appendChild(header);
      wrapper.appendChild(clone);

      const staging = document.createElement("div");
      staging.style.position = "absolute";
      staging.style.left = "-9999px";
      staging.style.top = "0";
      staging.appendChild(wrapper);
      document.body.appendChild(staging);

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const imgData = canvas.toDataURL("image/png");
      const scale = Math.min(
        (pageWidth - margin * 2) / canvas.width,
        (pageHeight - margin * 2) / canvas.height
      );
      const finalWidth = canvas.width * scale;
      const finalHeight = canvas.height * scale;

      pdf.addImage(
        imgData,
        "PNG",
        (pageWidth - finalWidth) / 2,
        margin,
        finalWidth,
        finalHeight,
        undefined,
        "FAST"
      );

      pdf.save("COTIT-ROI.pdf");
      setShareMessage("PDF downloaded.");
      staging.remove();
    } catch (err) {
      console.error(err);
      setShareMessage("Could not generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleShare = async () => {
    if (!result) return;
    setIsProcessing(true);
    setShareMessage(null);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "COTIT ROI Summary",
          text: shareText
        });
        setShareMessage("Shared successfully.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setShareMessage("Copied summary to clipboard.");
      } else {
        setShareMessage("Sharing not supported in this browser.");
      }
    } catch (err) {
      console.error(err);
      setShareMessage("Sharing failed. Try copy or download instead.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!result) {
    return (
      <main className="min-h-screen px-4 py-6 space-y-6">
        <TopBar />
        <div className="card p-6 space-y-3 text-center">
          <p className="text-sm font-semibold">No ROI calculation yet</p>
          <p className="text-xs text-gray-600">
            Enter your data to see savings, ROI, and payback.
          </p>
          <Link
            href="/portal/roi"
            className="mt-2 inline-block rounded-full bg-[#FE5E17] px-5 py-2 text-white text-sm font-semibold"
          >
            Go to calculator
          </Link>
        </div>
      </main>
    );
  }

  const { buckets, totals } = result;

  const cards = [
    { title: "Total yearly savings", value: totals.totalSavingsYear, tone: "primary" },
    { title: "Net yearly savings", value: totals.netSavingsYear, tone: "neutral" },
    { title: "ROI multiple", value: totals.roiMultiple, formatter: formatMultiple },
    { title: "ROI %", value: totals.roiPercent, formatter: formatPercent },
    { title: "Payback months", value: totals.paybackMonths, formatter: formatOneDecimal },
    { title: "Savings per employee", value: totals.savingsPerEmployee, tone: "neutral" },
    { title: "Savings per order", value: totals.savingsPerOrder, tone: "neutral" }
  ];

  const bucketItems = [
    { title: "Time savings", value: buckets.timeSavingsYear },
    { title: "Error reduction", value: buckets.errorReductionSavingsYear },
    { title: "Inventory optimization", value: buckets.inventoryOptimizationSavingsYear },
    { title: "Capital efficiency", value: buckets.capitalEfficiencySavingsYear }
  ];

  return (
    <main className="min-h-screen px-4 py-6 space-y-6 bg-[#f8fafc]">
      <TopBar />
        <div className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>✅</span>
          <span>Your ROI Results</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
          <span>Scenario:</span>
          <div className="inline-flex gap-2">
            {(["pessimistic", "expected", "optimistic"] as RoiScenario[]).map(
              (option) => {
                const active = scenario === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setScenario(option)}
                    className={`rounded-full border px-3 py-1 capitalize transition ${
                      active
                        ? "border-[#FE5E17] bg-[#FE5E17]/15 text-[#FE5E17] font-semibold shadow-[0_6px_18px_rgba(254,94,23,0.16)]"
                        : "border-gray-200 text-gray-700 hover:border-[#FE5E17]/60"
                    }`}
                  >
                    {option}
                  </button>
                );
              }
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2" data-pdf-exclude="true">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-full border border-[#FE5E17] px-4 py-2 text-sm font-semibold text-[#FE5E17] bg-white hover:bg-[#FE5E17]/5 transition disabled:opacity-60"
          >
            <span aria-hidden>⬇️</span>
            {isExporting ? "Preparing..." : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-full bg-[#FE5E17] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e25414] transition disabled:opacity-60"
          >
            <span aria-hidden>📤</span>
            {isProcessing ? "Sharing..." : "Share"}
          </button>
        </div>
        {shareMessage ? (
          <p className="text-[11px] text-gray-500" data-pdf-exclude="true">
            {shareMessage}
          </p>
        ) : null}
      </div>

      <div ref={reportRef} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`card p-5 space-y-2 ${
                card.tone === "primary"
                  ? "bg-gradient-to-r from-[#FE5E17] to-[#e05a1b] text-white shadow-[0_12px_30px_rgba(254,94,23,0.28)] border border-[#FE5E17]/30"
                  : "border border-[#4D93D6]/15 bg-white shadow-[0_8px_20px_rgba(77,147,214,0.08)]"
              }`}
            >
              <p
                className={`text-xs uppercase font-semibold ${
                  card.tone === "primary" ? "text-white/90" : "text-gray-600"
                }`}
              >
                {card.title}
              </p>
              <div className="text-2xl font-bold">
                {card.formatter
                  ? card.formatter(card.value)
                  : formatCurrency(card.value)}
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5 space-y-3 border border-[#4D93D6]/15 shadow-[0_8px_20px_rgba(77,147,214,0.08)] bg-white">
          <p className="text-sm font-semibold text-[#1d1d1d]">Savings breakdown (yearly)</p>
          <div className="grid md:grid-cols-2 gap-3">
            {bucketItems.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-[#4D93D6]/20 bg-[#4D93D6]/5 p-3 shadow-[0_6px_16px_rgba(77,147,214,0.1)]"
              >
                <p className="text-xs uppercase text-[#1d4c7b] font-semibold">{item.title}</p>
                <p className="text-lg font-semibold text-[#4D93D6]">
                  {formatCurrency(item.value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 space-y-2 text-sm text-gray-600 border border-[#93D753]/20 bg-[#93D753]/5 shadow-[0_8px_20px_rgba(147,215,83,0.12)]">
          <p className="font-semibold text-[#2f5b1a]">Input recap</p>
          {inputs ? (
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <Row label="Employees" value={inputs.employees} />
              <Row label="Time saved per day" value={`${inputs.timeSavedHoursPerDay}h`} />
              <Row label="Workdays per month" value={inputs.workdaysPerMonth} />
              <Row label="Avg gross salary / month" value={formatCurrency(inputs.avgGrossSalaryPerMonth)} />
              <Row label="Employer on-cost" value={`${inputs.employerOnCostPct}%`} />
              <Row label="Orders per year" value={formatNumber(inputs.ordersPerYear)} />
              <Row label="Error rate" value={`${inputs.orderErrorRatePct}%`} />
              <Row label="Avg order value" value={formatCurrency(inputs.avgOrderValue)} />
              <Row label="Inventory value" value={formatCurrency(inputs.inventoryValue)} />
              <Row label="Carrying cost %" value={`${inputs.carryingCostPct}%`} />
              <Row label="SaaS cost / year" value={formatCurrency(inputs.controlCostPerYear)} />
            </div>
          ) : (
            <p className="text-xs text-gray-500">No inputs found.</p>
          )}
        </div>
      </div>

      <div className="space-y-3 pb-8">
        <Link
          href="/portal/roi"
          className="block w-full rounded-full bg-[#FE5E17] py-3 text-center text-white font-semibold"
        >
          Recalculate
        </Link>
        <button className="w-full rounded-full border border-[#FE5E17] py-3 text-[#FE5E17] font-semibold">
          Book a Strategy Call
        </button>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatPercent(value: number) {
  return `${(value || 0).toFixed(0)}%`;
}

function formatMultiple(value: number) {
  return `${(value || 0).toFixed(1)}x`;
}

function formatOneDecimal(value: number) {
  return `${(value || 0).toFixed(1)} mo`;
}


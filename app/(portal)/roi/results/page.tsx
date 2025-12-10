 "use client";

import { useEffect } from "react";
import { TopBar } from "@/components/brand/TopBar";

const impacts = [
  { title: "Labor", value: "-38%", desc: "Reduced hours" },
  { title: "Errors", value: "-67%", desc: "Fewer mistakes" },
  { title: "Fulfilment", value: "-15%", desc: "Faster cycles" },
  { title: "Accuracy", value: "98.8%", desc: "Better accuracy" }
];

export default function RoiResultsPage() {
  useEffect(() => {
    localStorage.setItem("roiResultReady", "true");
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 space-y-6">
      <TopBar />
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>✅</span>
          <span>Your ROI Results</span>
        </div>
        <p className="text-xs text-gray-500">Based on your operational data</p>
      </div>

      <div className="space-y-4">
        <div className="card p-5 space-y-2">
          <p className="text-xs text-gray-500 uppercase font-semibold">Monthly savings</p>
          <div className="text-3xl font-bold text-[#FE5E17]">$12,450</div>
          <p className="text-xs text-green-600">+32% vs current costs</p>
        </div>
        <div className="card p-5 bg-gradient-to-r from-[#FE5E17] to-[#e05a1b] text-white space-y-2">
          <p className="text-xs uppercase font-semibold">Annual savings</p>
          <div className="text-3xl font-bold">$149,400</div>
          <p className="text-xs">Projected first-year savings</p>
        </div>
        <div className="card p-5 space-y-2">
          <p className="text-xs uppercase font-semibold text-gray-600">Payback period</p>
          <div className="text-xl font-semibold text-[#4D93D6]">4.2 Months</div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-[#4D93D6]" style={{ width: "70%" }} />
          </div>
          <p className="text-xs text-gray-500">Break-even in Q2 2025</p>
        </div>

        <div className="card p-5 space-y-3">
          <p className="text-center text-sm font-semibold">Efficiency Gain</p>
          <div className="flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border-8 border-[#93D753] flex items-center justify-center text-xl font-bold text-[#3a7b16]">
              82%
            </div>
          </div>
          <p className="text-xs text-center text-gray-600">
            Overall operational efficiency increase.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {impacts.map((impact) => (
          <div key={impact.title} className="card p-4 space-y-1">
            <p className="text-xs uppercase text-gray-600">{impact.title}</p>
            <div className="text-xl font-semibold">{impact.value}</div>
            <p className="text-xs text-gray-500">{impact.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button className="w-full rounded-full bg-[#FE5E17] py-3 text-white font-semibold">
          Book a Strategy Call
        </button>
        <button className="w-full rounded-full border border-[#FE5E17] py-3 text-[#FE5E17] font-semibold">
          Download ROI Summary
        </button>
        <button className="w-full rounded-full text-[#FE5E17] font-semibold">
          Add to My Profile
        </button>
      </div>
      <div className="text-center text-xs text-gray-500 pb-6">Powered by COTIT 360°</div>
    </main>
  );
}


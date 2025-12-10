"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/brand/TopBar";

export default function RoiCalculatorPage() {
  const [monthlyOrders, setMonthlyOrders] = useState(2500);
  const [manualHours, setManualHours] = useState(25);
  const [errorRate, setErrorRate] = useState(5);

  return (
    <main className="min-h-screen px-4 py-6 space-y-6">
      <TopBar />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold font-heading">Estimate your savings</h1>
        <p className="text-sm text-gray-600">
          Help us understand your operations to calculate potential ROI.
        </p>
      </div>

      <div className="card p-5 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Monthly orders</label>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>500</span>
            <span>{monthlyOrders}</span>
            <span>10,000+</span>
          </div>
          <input
            type="range"
            min={500}
            max={10000}
            value={monthlyOrders}
            onChange={(e) => setMonthlyOrders(Number(e.target.value))}
            className="w-full accent-[#FE5E17]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Manual hours per week</label>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>10h</span>
            <span>{manualHours}h</span>
            <span>80h</span>
          </div>
          <input
            type="range"
            min={10}
            max={80}
            value={manualHours}
            onChange={(e) => setManualHours(Number(e.target.value))}
            className="w-full accent-[#FE5E17]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Current error rate</label>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>1%</span>
            <span className="text-[#4D93D6]">{errorRate}%</span>
            <span>15%</span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            value={errorRate}
            onChange={(e) => setErrorRate(Number(e.target.value))}
            className="w-full accent-[#FE5E17]"
          />
          <p className="text-xs text-green-600">+80% with COTIT</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Number of employees</label>
          <select className="w-full rounded-lg border border-gray-200 bg-white text-[#1d1d1d] placeholder:text-gray-500 px-3 py-3 text-sm focus:border-[#FE5E17] focus:ring-2 focus:ring-[#FE5E17]/30">
            <option>Select range</option>
            <option>10-50</option>
            <option>50-200</option>
            <option>200-500</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Warehouse movements/day</label>
          <select className="w-full rounded-lg border border-gray-200 bg-white text-[#1d1d1d] placeholder:text-gray-500 px-3 py-3 text-sm focus:border-[#FE5E17] focus:ring-2 focus:ring-[#FE5E17]/30">
            <option>Select range</option>
            <option>500-1,000</option>
            <option>1,000-5,000</option>
            <option>5,000+</option>
          </select>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#4D93D6]">
            <span>✔ Potential impact</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-lg bg-white border border-gray-200 p-3">
              <p className="text-[#93D753] font-semibold">80%</p>
              <p className="text-xs text-gray-600">Error reduction</p>
            </div>
            <div className="rounded-lg bg-white border border-gray-200 p-3">
              <p className="text-[#4D93D6] font-semibold">60%</p>
              <p className="text-xs text-gray-600">Time savings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6">
        <Link
          href="/portal/roi/results"
          className="block w-full rounded-full bg-[#FE5E17] py-3 text-center text-white font-semibold"
        >
          Calculate Savings
        </Link>
      </div>
    </main>
  );
}


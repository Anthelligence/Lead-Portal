"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/brand/TopBar";
import {
  calculateRoi,
  type RoiInputs,
  type RoiScenario
} from "@/lib/roiCalculator";

const defaultInputs: RoiInputs = {
  employees: 50,
  timeSavedHoursPerDay: 1.5,
  workdaysPerMonth: 21,
  avgGrossSalaryPerMonth: 3500,
  employerOnCostPct: 25,
  ordersPerYear: 25000,
  orderErrorRatePct: 3,
  avgOrderValue: 120,
  inventoryValue: 500000,
  carryingCostPct: 20,
  controlCostPerYear: 24000
};

const presets: Record<
  "lean" | "balanced" | "scale",
  { label: string; description: string; values: RoiInputs }
> = {
  lean: {
    label: "Lean team",
    description: "Smaller team, tighter ops",
    values: {
      employees: 20,
      timeSavedHoursPerDay: 1,
      workdaysPerMonth: 21,
      avgGrossSalaryPerMonth: 3200,
      employerOnCostPct: 22,
      ordersPerYear: 12000,
      orderErrorRatePct: 4,
      avgOrderValue: 95,
      inventoryValue: 200000,
      carryingCostPct: 18,
      controlCostPerYear: 18000
    }
  },
  balanced: {
    label: "Typical mid-market",
    description: "Baseline assumptions",
    values: defaultInputs
  },
  scale: {
    label: "Scaling operations",
    description: "Higher volume, more upside",
    values: {
      employees: 120,
      timeSavedHoursPerDay: 2,
      workdaysPerMonth: 21,
      avgGrossSalaryPerMonth: 4200,
      employerOnCostPct: 28,
      ordersPerYear: 75000,
      orderErrorRatePct: 2.5,
      avgOrderValue: 135,
      inventoryValue: 1200000,
      carryingCostPct: 22,
      controlCostPerYear: 42000
    }
  }
};

export default function RoiCalculatorPage() {
  const router = useRouter();
  const [scenario, setScenario] = useState<RoiScenario>("expected");
  const [inputs, setInputs] = useState<RoiInputs>(defaultInputs);

  const preview = useMemo(() => calculateRoi(inputs, scenario), [inputs, scenario]);

  const handleNumberChange = (key: keyof RoiInputs) => (value: string) => {
    const next = Number(value);
    setInputs((prev) => ({ ...prev, [key]: Number.isFinite(next) ? next : 0 }));
  };

  const applyPreset = (key: keyof typeof presets) => {
    setInputs(presets[key].values);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateRoi(inputs, scenario);
    localStorage.setItem("roiInputs", JSON.stringify(inputs));
    localStorage.setItem("roiResult", JSON.stringify(result));
    router.push("/portal/roi/results");
  };

  return (
    <main className="min-h-screen px-4 py-6 space-y-6 pb-28">
      <TopBar />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold font-heading">Estimate your savings</h1>
        <p className="text-sm text-gray-600">
          Use your own numbers or start from a preset. Watch the live preview update.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <form
          onSubmit={handleSubmit}
          className="card p-5 space-y-5 lg:col-span-2 border border-gray-100 shadow-sm"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Quick presets</p>
            <div className="grid md:grid-cols-3 gap-2">
              {(Object.keys(presets) as Array<keyof typeof presets>).map((key) => {
                const preset = presets[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPreset(key)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-left hover:border-[#FE5E17] hover:bg-[#FE5E17]/5 transition"
                  >
                    <p className="text-sm font-semibold text-[#1d1d1d]">{preset.label}</p>
                    <p className="text-[11px] text-gray-500">{preset.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Employees using the system"
              helper="People regularly in the platform"
              value={inputs.employees}
              min={1}
              onChange={handleNumberChange("employees")}
            />
            <InputField
              label="Time saved per employee per day"
              helper="Hours saved (0-4)"
              value={inputs.timeSavedHoursPerDay}
              min={0}
              max={4}
              step={0.1}
              onChange={handleNumberChange("timeSavedHoursPerDay")}
              suffix="h"
            />
            <InputField
              label="Workdays per month"
              value={inputs.workdaysPerMonth}
              min={10}
              max={31}
              onChange={handleNumberChange("workdaysPerMonth")}
            />
            <InputField
              label="Avg gross salary per month"
              value={inputs.avgGrossSalaryPerMonth}
              min={0}
              onChange={handleNumberChange("avgGrossSalaryPerMonth")}
              prefix="$"
            />
            <InputField
              label="Employer on-cost %"
              helper="Taxes, insurance, benefits"
              value={inputs.employerOnCostPct}
              min={0}
              onChange={handleNumberChange("employerOnCostPct")}
              suffix="%"
            />
            <InputField
              label="Orders per year"
              value={inputs.ordersPerYear}
              min={0}
              onChange={handleNumberChange("ordersPerYear")}
            />
            <InputField
              label="Current order error rate %"
              helper="e.g. 3 = 3%"
              value={inputs.orderErrorRatePct}
              min={0}
              max={100}
              step={0.1}
              onChange={handleNumberChange("orderErrorRatePct")}
              suffix="%"
            />
            <InputField
              label="Average order value"
              value={inputs.avgOrderValue}
              min={0}
              onChange={handleNumberChange("avgOrderValue")}
              prefix="$"
            />
            <InputField
              label="Inventory value"
              value={inputs.inventoryValue}
              min={0}
              onChange={handleNumberChange("inventoryValue")}
              prefix="$"
            />
            <InputField
              label="Carrying cost % (annual)"
              helper="Storage, insurance, obsolescence"
              value={inputs.carryingCostPct}
              min={0}
              max={100}
              step={0.1}
              onChange={handleNumberChange("carryingCostPct")}
              suffix="%"
            />
            <InputField
              label="SaaS cost per year"
              value={inputs.controlCostPerYear}
              min={0}
              onChange={handleNumberChange("controlCostPerYear")}
              prefix="$"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Scenario</p>
            <div className="grid grid-cols-3 gap-2">
              {(["pessimistic", "expected", "optimistic"] as RoiScenario[]).map(
                (option) => {
                  const active = scenario === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setScenario(option)}
                      className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${
                        active
                          ? "border-[#FE5E17] bg-[#FE5E17]/10 text-[#FE5E17] font-semibold"
                          : "border-gray-200 text-gray-700 hover:border-[#FE5E17]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                }
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Pessimistic uses 60% of estimated impact, optimistic uses 140%.
            </p>
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-white pt-3 pb-1">
            <button
              type="submit"
              className="w-full rounded-full bg-[#FE5E17] py-3 text-white font-semibold hover:bg-[#e25414] transition"
            >
              Calculate savings
            </button>
          </div>
        </form>

        <aside className="card p-5 space-y-4 border border-gray-100 shadow-sm lg:h-fit">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-gray-600">Live preview</p>
              <p className="text-sm text-gray-500">Updates as you change inputs.</p>
            </div>
            <span className="rounded-full bg-[#FE5E17]/10 px-3 py-1 text-xs font-semibold text-[#FE5E17] capitalize">
              {scenario} scenario
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-500">Total yearly savings</p>
            <p className="text-3xl font-bold text-[#FE5E17]">
              {formatCurrency(preview.totals.totalSavingsYear)}
            </p>
            <p className="text-[11px] text-green-600">
              Net after software: {formatCurrency(preview.totals.netSavingsYear)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat title="ROI" value={formatMultiple(preview.totals.roiMultiple)} />
            <Stat title="Payback" value={formatOneDecimal(preview.totals.paybackMonths)} />
            <Stat
              title="Per employee / yr"
              value={formatCurrency(preview.totals.savingsPerEmployee)}
            />
            <Stat
              title="Per order"
              value={formatCurrency(preview.totals.savingsPerOrder)}
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase font-semibold text-gray-600">
              Savings breakdown
            </p>
            <div className="space-y-2 text-sm">
              <BreakdownRow label="Time savings" value={preview.buckets.timeSavingsYear} />
              <BreakdownRow
                label="Error reduction"
                value={preview.buckets.errorReductionSavingsYear}
              />
              <BreakdownRow
                label="Inventory optimization"
                value={preview.buckets.inventoryOptimizationSavingsYear}
              />
              <BreakdownRow
                label="Capital efficiency"
                value={preview.buckets.capitalEfficiencySavingsYear}
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

type InputProps = {
  label: string;
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  helper?: string;
};

function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  helper
}: InputProps) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-[#FE5E17] focus-within:ring-2 focus-within:ring-[#FE5E17]/20 transition">
        {prefix ? <span className="text-xs text-gray-500 mr-1">{prefix}</span> : null}
        <input
          type="number"
          min={min}
          max={max}
          step={step ?? 1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-[#1d1d1d] outline-none"
        />
        {suffix ? <span className="text-xs text-gray-500 ml-1">{suffix}</span> : null}
      </div>
      {helper ? <p className="text-[11px] text-gray-500">{helper}</p> : null}
    </label>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-[11px] uppercase text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-[#1d1d1d]">{value}</p>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-[#4D93D6]">{formatCurrency(value)}</span>
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

function formatMultiple(value: number) {
  return `${(value || 0).toFixed(1)}x`;
}

function formatOneDecimal(value: number) {
  return `${(value || 0).toFixed(1)} mo`;
}


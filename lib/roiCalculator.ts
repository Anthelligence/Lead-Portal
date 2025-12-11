export type RoiScenario = "pessimistic" | "expected" | "optimistic";

export type RoiInputs = {
  employees: number;
  timeSavedHoursPerDay: number;
  workdaysPerMonth: number;
  avgGrossSalaryPerMonth: number;
  employerOnCostPct: number;
  ordersPerYear: number;
  orderErrorRatePct: number;
  avgOrderValue: number;
  inventoryValue: number;
  carryingCostPct: number;
  controlCostPerYear: number;
};

export type RoiBuckets = {
  timeSavingsYear: number;
  errorReductionSavingsYear: number;
  inventoryOptimizationSavingsYear: number;
  capitalEfficiencySavingsYear: number;
};

export type RoiTotals = {
  totalSavingsYear: number;
  netSavingsYear: number;
  roiMultiple: number;
  roiPercent: number;
  paybackMonths: number;
  savingsPerEmployee: number;
  savingsPerOrder: number;
};

export type RoiResult = {
  buckets: RoiBuckets;
  totals: RoiTotals;
  scenario: RoiScenario;
};

// Tweakable assumptions
export const HOURS_PER_DAY = 8;
export const ERROR_LOSS_FACTOR = 0.25;
export const ERROR_REDUCTION_PCT = 0.5;
export const INVENTORY_OPTIMIZATION_PCT = 0.15;
export const INVENTORY_REDUCTION_PCT = 0.1;
export const COST_OF_CAPITAL = 0.08;

export const SCENARIO_MULTIPLIERS: Record<RoiScenario, number> = {
  pessimistic: 0.6,
  expected: 1,
  optimistic: 1.4
};

/**
 * Calculate ROI metrics for the retail/operations SaaS product.
 */
export function calculateRoi(
  inputs: RoiInputs,
  scenario: RoiScenario = "expected"
): RoiResult {
  const multiplier = SCENARIO_MULTIPLIERS[scenario];

  const hourlyCost =
    (inputs.avgGrossSalaryPerMonth * (1 + inputs.employerOnCostPct / 100)) /
    (inputs.workdaysPerMonth * HOURS_PER_DAY);

  const hoursSavedYear =
    inputs.employees *
    inputs.timeSavedHoursPerDay *
    inputs.workdaysPerMonth *
    12;

  const timeSavingsYear = hoursSavedYear * hourlyCost * multiplier;

  const errorRate = inputs.orderErrorRatePct / 100;
  const errorsPerYear = inputs.ordersPerYear * errorRate;
  const costPerError = inputs.avgOrderValue * ERROR_LOSS_FACTOR;
  const errorReductionSavingsYear =
    errorsPerYear * ERROR_REDUCTION_PCT * costPerError * multiplier;

  const carryingRate = inputs.carryingCostPct / 100;
  const inventoryCarryingCostYear = inputs.inventoryValue * carryingRate;
  const inventoryOptimizationSavingsYear =
    inventoryCarryingCostYear * INVENTORY_OPTIMIZATION_PCT * multiplier;

  const freedCapital = inputs.inventoryValue * INVENTORY_REDUCTION_PCT * multiplier;
  const capitalEfficiencySavingsYear = freedCapital * COST_OF_CAPITAL;

  const totalSavingsYear =
    timeSavingsYear +
    errorReductionSavingsYear +
    inventoryOptimizationSavingsYear +
    capitalEfficiencySavingsYear;

  const netSavingsYear = totalSavingsYear - inputs.controlCostPerYear;

  const roiMultiple =
    inputs.controlCostPerYear > 0
      ? totalSavingsYear / inputs.controlCostPerYear
      : 0;

  const roiPercent =
    inputs.controlCostPerYear > 0
      ? (netSavingsYear / inputs.controlCostPerYear) * 100
      : 0;

  const paybackMonths =
    totalSavingsYear > 0
      ? (inputs.controlCostPerYear / totalSavingsYear) * 12
      : 0;

  const savingsPerEmployee =
    inputs.employees > 0 ? totalSavingsYear / inputs.employees : 0;

  const savingsPerOrder =
    inputs.ordersPerYear > 0 ? totalSavingsYear / inputs.ordersPerYear : 0;

  return {
    buckets: {
      timeSavingsYear,
      errorReductionSavingsYear,
      inventoryOptimizationSavingsYear,
      capitalEfficiencySavingsYear
    },
    totals: {
      totalSavingsYear,
      netSavingsYear,
      roiMultiple,
      roiPercent,
      paybackMonths,
      savingsPerEmployee,
      savingsPerOrder
    },
    scenario
  };
}

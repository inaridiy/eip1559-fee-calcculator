export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];
export type Percentile = (typeof PRIORITY_LEVEL_PERCENTILES)[number];

export const PRIORITY_LEVELS = ["low", "medium", "high"] as const;
export const PRIORITY_LEVEL_PERCENTILES = [10, 20, 30] as const;
export const SETTINGS_BY_PRIORITY_LEVEL = {
  low: {
    percentile: 10 as Percentile,
    baseFeePercentageMultiplier: 110n,
    priorityFeePercentageMultiplier: 94n,
    minSuggestedMaxPriorityFeePerGas: 1_000_000_000n,
  },
  medium: {
    percentile: 20 as Percentile,
    baseFeePercentageMultiplier: 120n,
    priorityFeePercentageMultiplier: 97n,
    minSuggestedMaxPriorityFeePerGas: 1_500_000_000n,
  },
  high: {
    percentile: 30 as Percentile,
    baseFeePercentageMultiplier: 125n,
    priorityFeePercentageMultiplier: 98n,
    minSuggestedMaxPriorityFeePerGas: 2_000_000_000n,
  },
};

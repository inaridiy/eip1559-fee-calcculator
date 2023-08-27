import { PriorityLevel, SETTINGS_BY_PRIORITY_LEVEL } from "./constants";
import { FeeHistory } from "./types";

const medianOf = (numbers: bigint[]): bigint => {
  const sortedNumbers = numbers.slice().sort((a, b) => (a > b ? 1 : -1));
  const len = sortedNumbers.length;
  const index = Math.floor((len - 1) / 2);
  return sortedNumbers[index];
};

const max = <T>(a: T, b: T) => (a > b ? a : b);

export const calculateGasViaFeeHistory = (priorityLevel: PriorityLevel, feeHistory: FeeHistory) => {
  const settings = SETTINGS_BY_PRIORITY_LEVEL[priorityLevel];

  const latestBaseFeePerGas = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1];
  const adjustedBaseFee = (latestBaseFeePerGas * settings.baseFeePercentageMultiplier) / 100n;
  const priorityFees =
    feeHistory.reward?.map((reward) => reward[settings.percentile]).filter((fee) => fee !== undefined) ?? [];
  const medianPriorityFee = medianOf(priorityFees);
  const adjustedPriorityFee = (medianPriorityFee * settings.priorityFeePercentageMultiplier) / 100n;

  const suggestedMaxPriorityFeePerGas = max(adjustedPriorityFee, settings.minSuggestedMaxPriorityFeePerGas);
  const suggestedMaxFeePerGas = adjustedBaseFee + suggestedMaxPriorityFeePerGas;

  return {
    ...settings.estimatedWaitTimes,
    suggestedMaxPriorityFeePerGas,
    suggestedMaxFeePerGas,
  };
};

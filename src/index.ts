import { calculateGasViaFeeHistory } from "./calcGasViaFeeHistory";
import { PriorityLevel } from "./constants";
import { PublicClient } from "viem";
import { FeeHistory } from "./types";

export { calculateGasViaFeeHistory, PriorityLevel, FeeHistory };

export interface FetchFeeHistoryParams {
  client: PublicClient;
  blockNumber: bigint | "latest";
  blockCount: number;
  percentiles: number[];
}

export const fetchFeeHistory = async (params: FetchFeeHistoryParams): Promise<FeeHistory> => {
  const block =
    typeof params.blockNumber === "bigint" ? { blockNumber: params.blockNumber } : { blockTag: "latest" as const };

  const feeHistory = await params.client.getFeeHistory({
    ...block,
    blockCount: params.blockCount,
    rewardPercentiles: params.percentiles,
  });

  const adjustedFeeHistory = {
    ...feeHistory,
    reward: feeHistory.reward?.map((reward) =>
      Object.fromEntries(reward.map((value, i) => [params.percentiles[i], value]))
    ),
  } satisfies FeeHistory;

  return adjustedFeeHistory;
};

export const fetchAndCalculateGasViaFeeHistory = async <T extends PriorityLevel>(client: PublicClient) => {
  const feeHistory = await fetchFeeHistory({ client, blockNumber: "latest", blockCount: 5, percentiles: [10, 20, 30] });
  const estimatedBaseFee = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1];

  return {
    estimatedBaseFee,
    high: calculateGasViaFeeHistory("high", feeHistory),
    medium: calculateGasViaFeeHistory("medium", feeHistory),
    low: calculateGasViaFeeHistory("low", feeHistory),
  };
};

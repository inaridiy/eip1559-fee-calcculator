import { calculateGasViaFeeHistory } from "../calcGasViaFeeHistory";
import { PriorityLevel } from "../constants";
import { FeeHistory, Eip1559GasFee } from "../types";
import { RpcFeeHistoryResponse } from "./types";
import { ethers } from "ethers-v6";

export { calculateGasViaFeeHistory, PriorityLevel, FeeHistory };

export interface FetchFeeHistoryParams {
  provider: ethers.JsonRpcProvider;
  blockNumber: string | "latest";
  blockCount: number;
  percentiles: number[];
}

export const fetchFeeHistory = async (params: FetchFeeHistoryParams): Promise<FeeHistory> => {
  const feeHistory: RpcFeeHistoryResponse = await params.provider.send("eth_feeHistory", [
    ethers.toBeHex(10),
    params.blockNumber,
    params.blockCount,
  ]);

  const adjustedFeeHistory = {
    baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
    gasUsedRatio: feeHistory.gasUsedRatio,
    oldestBlock: BigInt(feeHistory.oldestBlock),
    reward: feeHistory.reward?.map((reward) =>
      Object.fromEntries(reward.map((value, i) => [params.percentiles[i], BigInt(value)]))
    ),
  } satisfies FeeHistory;

  return adjustedFeeHistory;
};

export const fetchAndCalculateGasViaFeeHistory = async (provider: ethers.JsonRpcProvider) => {
  const feeHistory = await fetchFeeHistory({
    provider,
    blockNumber: "latest",
    blockCount: 5,
    percentiles: [10, 20, 30],
  });
  const estimatedBaseFee = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1];

  return {
    estimatedBaseFee,
    blockNumber: feeHistory.oldestBlock,
    high: calculateGasViaFeeHistory("high", feeHistory),
    medium: calculateGasViaFeeHistory("medium", feeHistory),
    low: calculateGasViaFeeHistory("low", feeHistory),
  };
};

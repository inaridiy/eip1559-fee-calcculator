import { calculateGasViaFeeHistory } from "../calcGasViaFeeHistory";
import { PriorityLevel } from "../constants";
import { FeeHistory, Eip1559GasFee } from "../types";
import { RpcFeeHistoryResponse } from "./types";
import { BigNumber, ethers, utils } from "ethers-v5";

export { calculateGasViaFeeHistory, PriorityLevel, FeeHistory };

export interface FetchFeeHistoryParams {
  provider: ethers.providers.JsonRpcProvider;
  blockNumber: string | "latest";
  blockCount: number;
  percentiles: number[];
}

export const fetchFeeHistory = async (params: FetchFeeHistoryParams): Promise<FeeHistory> => {
  const feeHistory: RpcFeeHistoryResponse = await params.provider.send("eth_feeHistory", [
    utils.hexStripZeros(utils.hexlify(10)),
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

export interface Ethers5Eip1559GasFee {
  maxPriorityFeePerGas: BigNumber;
  maxFeePerGas: BigNumber;
}

export const adjustEip1559GasFee = (gasFee: Eip1559GasFee): Ethers5Eip1559GasFee => {
  return {
    maxFeePerGas: BigNumber.from(gasFee.maxFeePerGas),
    maxPriorityFeePerGas: BigNumber.from(gasFee.maxPriorityFeePerGas),
  };
};

export const fetchAndCalculateGasViaFeeHistory = async (provider: ethers.providers.JsonRpcProvider) => {
  const feeHistory = await fetchFeeHistory({
    provider,
    blockNumber: "latest",
    blockCount: 5,
    percentiles: [10, 20, 30],
  });
  const estimatedBaseFee = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1];
  const suggestions = {
    high: calculateGasViaFeeHistory("high", feeHistory),
    medium: calculateGasViaFeeHistory("medium", feeHistory),
    low: calculateGasViaFeeHistory("low", feeHistory),
  };

  return {
    estimatedBaseFee,
    blockNumber: feeHistory.oldestBlock,
    high: adjustEip1559GasFee(suggestions.high),
    medium: adjustEip1559GasFee(suggestions.medium),
    low: adjustEip1559GasFee(suggestions.low),
  };
};

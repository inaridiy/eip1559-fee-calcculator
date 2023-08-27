export interface RpcFeeHistoryResponse {
  baseFeePerGas: string[];
  gasUsedRatio: number[];
  oldestBlock: number;
  reward: string[][];
}

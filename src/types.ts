export type Eip1559GasFee = {
  minWaitTimeEstimate: number;
  maxWaitTimeEstimate: number;
  suggestedMaxPriorityFeePerGas: string;
  suggestedMaxFeePerGas: string;
};

export type FeeHistory<TQuantity = bigint> = {
  baseFeePerGas: TQuantity[];
  gasUsedRatio: number[];
  oldestBlock: TQuantity;
  reward?: Record<number, bigint>[];
};

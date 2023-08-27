export interface Eip1559GasFee {
  maxPriorityFeePerGas: bigint;
  maxFeePerGas: bigint;
}

export interface FeeHistory<TQuantity = bigint> {
  baseFeePerGas: TQuantity[];
  gasUsedRatio: number[];
  oldestBlock: TQuantity;
  reward?: Record<number, bigint>[];
}

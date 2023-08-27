# Bullet Proof Gas

To everyone troubled by the gas fees on Polygon

## Overview

I have reimplemented Metamask's gas-fee-controller and provided a thin wrapper so that it can be called from various Web3 libraries.

Simply put, you can use the same gas fee calculation in Viem and Ethers as you do in Metamask.

https://github.com/MetaMask/core/tree/main/packages/gas-fee-controller

## Installation

```bash
npm install bullet-proof-gas
```

## Usage

### Viem

```ts
import { fetchAndCalculateGasViaFeeHistory } from "bullet-proof-gas";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";

const publicClient = createPublicClient({
	transport: http(),
	chain: polygon,
});

const suggestedGas = await fetchAndCalculateGasViaFeeHistory(publicClient);

...

const walletClient = createWalletClient({
    ...
});

const tx = walletClient.sendTransaction({ ...suggestedGas.high });
```

### EthersV5

```ts
import { fetchAndCalculateGasViaFeeHistory } from "bullet-proof-gas/ethers5";
import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(polygon.rpcUrls.default.http[0]);
const suggestedGas = await fetchAndCalculateGasViaFeeHistory(provider);

...
```

### EthersV6

```ts
import { fetchAndCalculateGasViaFeeHistory } from "bullet-proof-gas/ethers6";
import { ethers as ethers6 } from "ethers-v6";

const provider = new ethers6.JsonRpcProvider(polygon.rpcUrls.default.http[0]);
const suggestedGas = await fetchAndCalculateGasViaFeeHistory(provider);
```

## Super Thanks

- [Metamask](https://github.com/MetaMask)

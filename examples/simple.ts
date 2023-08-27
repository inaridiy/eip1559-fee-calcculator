import { fetchAndCalculateGasViaFeeHistory } from "bullet-proof-gas";
import { createPublicClient, createWalletClient, http } from "viem";
import { polygon } from "viem/chains";

const client = createPublicClient({
	transport: http(),
	chain: polygon,
});

const suggestedGas = await fetchAndCalculateGasViaFeeHistory(client);

const walletClient = createWalletClient({
	transport: http(),
	chain: polygon,
});

walletClient.sendTransaction({ ...sug });

import { fetchAndCalculateGasViaFeeHistory as fetchEthers } from "bullet-proof-gas/ethers5";
import { ethers } from "ethers-v5";

const provider = new ethers.providers.JsonRpcProvider(
	polygon.rpcUrls.default.http[0],
);
console.log(await fetchEthers(provider));

import { fetchAndCalculateGasViaFeeHistory as fetchEthers6 } from "bullet-proof-gas/ethers6";
import { ethers as ethers6 } from "ethers-v6";

const provider6 = new ethers6.JsonRpcProvider(polygon.rpcUrls.default.http[0]);
console.log(await fetchEthers6(provider6));

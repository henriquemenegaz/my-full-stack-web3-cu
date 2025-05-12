import { createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther, WalletClient, PublicClient, Chain, Abi } from "viem";
import { contractAddress, abi } from "../constants-ts";
import "viem/window";

interface CustomChainConfig {
  id: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
    };
  };
}

const connectButton: HTMLButtonElement = document.getElementById("connectButton") as HTMLButtonElement;
const balanceButton: HTMLButtonElement = document.getElementById("balanceButton") as HTMLButtonElement;
const fundButton: HTMLButtonElement = document.getElementById("fundButton") as HTMLButtonElement;
const ethAmountInput: HTMLInputElement = document.getElementById("ethAmount") as HTMLInputElement;
const withdrawButton: HTMLButtonElement = document.getElementById("withdrawButton") as HTMLButtonElement;

let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;

connectButton.onclick = async (): Promise<void> => {
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        await walletClient.requestAddresses();
        connectButton.innerHTML = "Connected!";
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
};

fundButton.onclick = async (): Promise<void> => {
    const ethAmount: string = ethAmountInput.value;
    console.log(ethAmount);

    if (typeof window.ethereum !== "undefined") {               
        try {
            walletClient = createWalletClient({
                transport: custom(window.ethereum)
            });
            const [connectedAccount] = await walletClient.requestAddresses();
            const currentChain: Chain = await getCurrentChain(walletClient);
            
            publicClient = createPublicClient({
                transport: custom(window.ethereum)
            });

            console.log("Simulating transaction...");
            
            const { request } = await publicClient.simulateContract({
                address: contractAddress,
                abi: abi as Abi,
                functionName: "fund",
                account: connectedAccount,
                chain: currentChain,
                value: parseEther(ethAmount),
            });
        
            console.log("Simulation successful. Prepared request:", request);
            console.log("Sending transaction...");
            const hash: string = await walletClient.writeContract(request);
            console.log("Transaction processed: ", hash);
        
        } catch (error: unknown) {
            console.error("Transaction simulation failed:", error);
        }                    
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
};

balanceButton.onclick = async (): Promise<void> => {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });

        try {   
            const balance: bigint = await publicClient.getBalance({
                address: contractAddress,
            });
            console.log(`Contract Balance: ${formatEther(balance)} ETH`);
        } catch (error: unknown) {
            console.error("Error getting balance:", error);
        }
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
};

withdrawButton.onclick = async (): Promise<void> => {
    if (typeof window.ethereum !== "undefined") {               
        try {
            walletClient = createWalletClient({
                transport: custom(window.ethereum)
            });
            const [connectedAccount] = await walletClient.requestAddresses();
            const currentChain: Chain = await getCurrentChain(walletClient);
            
            publicClient = createPublicClient({
                transport: custom(window.ethereum)
            });

            console.log("Simulating withdraw transaction...");
            
            const { request } = await publicClient.simulateContract({
                address: contractAddress,
                abi: abi as Abi,
                functionName: "withdraw",
                account: connectedAccount,
                chain: currentChain,
            });
        
            console.log("Simulation successful. Prepared request:", request);
            console.log("Sending withdraw transaction...");
            const hash: string = await walletClient.writeContract(request);
            console.log("Withdraw transaction processed: ", hash);
        
        } catch (error: unknown) {
            console.error("Withdraw transaction simulation failed:", error);
        }                    
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
};

async function getCurrentChain(client: WalletClient): Promise<Chain> {
    const chainId: number = await client.getChainId();
    const currentChain: Chain = defineChain({
      id: chainId,
      name: "Custom Chain",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["http://localhost:8545"],
        },
      },
    }) as CustomChainConfig;
    return currentChain;
}
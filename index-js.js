import { createWalletClient, custom, createPublicClient, parseEther, defineChain } from "https://esm.sh/viem";
import { contractAddress, abi } from "./constatants-js.js";

const connectButton = document.getElementById("connectButton");
// const balanceButton = document.getElementById("balanceButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");

let walletClient;
let publicClient;
connectButton.onclick = async () => {
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)

        })
        await walletClient.requestAddresses();
        connectButton.innerHTML = "Connected!";
        
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

fundButton.onclick = async () => {
    const ethAmount = ethAmountInput.value;
    console.log(ethAmount);

    if (typeof window.ethereum !== "undefined") {               
        try {
            walletClient = createWalletClient({
                transport: custom(window.ethereum)
            })
            const [connectedAccount] = await walletClient.requestAddresses();
            const currentChain = await getCurrentChain(walletClient);
            
            // Test transaction with Public Client
            publicClient = createPublicClient({
                transport: custom(window.ethereum)
            })

            console.log("Simulating transaction...");
            // SimulateContract
            const { request } = await publicClient.simulateContract({
                address: contractAddress,       // Target contract address
                abi: abi,               // Contract's ABI
                functionName: "fund",         // Function to simulate
                account: connectedAccount,    // Account initiating the call
                chain: currentChain,          // Chain information object
                value: parseEther(ethAmount), // Amount of ETH (in Wei) to send
            });
        
            console.log("Simulation successful. Prepared request:", request);
            // Proceed to sending the transaction using this 'request' object...

            console.log("Sending transaction...");
            const hash = await walletClient.writeContract(request)
            console.log("Transaction processed: ", hash)
        
        } catch (error) {
            console.error("Transaction simulation failed:", error);
            // Handle simulation errors (e.g., display message to user)
        }                    
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

async function getCurrentChain(client) {
    const chainId = await client.getChainId()
    const currentChain = defineChain({
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
    })
    return currentChain
  }
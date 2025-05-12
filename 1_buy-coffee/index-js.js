// Import necessary functions from viem library
import { createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther } from "https://esm.sh/viem";
// Import contract address and ABI from constants file
import { contractAddress, abi } from "./1_buycoffee/constants-js.js";

// Get DOM elements by their IDs
const connectButton = document.getElementById("connectButton");
const balanceButton = document.getElementById("balanceButton")
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const withdrawButton = document.getElementById("withdrawButton");
// Declare client variables to be used throughout the application
let walletClient;
let publicClient;

// Define click handler for the connect button
connectButton.onclick = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
        // Create a wallet client using MetaMask as transport
        walletClient = createWalletClient({
            transport: custom(window.ethereum)

        })
        // Request user to connect their wallet
        await walletClient.requestAddresses();
        // Update button text to show connection status
        connectButton.innerHTML = "Connected!";
        
    } else {
        // Update button text if MetaMask is not installed
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

// Define click handler for the fund button
fundButton.onclick = async () => {
    // Get the amount of ETH to send from input field
    const ethAmount = ethAmountInput.value;
    // Log the amount to console
    console.log(ethAmount);

    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {               
        try {
            // Create a wallet client using MetaMask as transport
            walletClient = createWalletClient({
                transport: custom(window.ethereum)
            })
            // Request user to connect their wallet and get the connected account
            const [connectedAccount] = await walletClient.requestAddresses();
            // Get current chain information
            const currentChain = await getCurrentChain(walletClient);
            
            // Create a public client for read operations
            publicClient = createPublicClient({
                transport: custom(window.ethereum)
            })

            // Log simulation start
            console.log("Simulating transaction...");
            
            // Simulate the contract call before sending the actual transaction
            const { request } = await publicClient.simulateContract({
                address: contractAddress,       // Target contract address
                abi: abi,               // Contract's ABI
                functionName: "fund",         // Function to simulate
                account: connectedAccount,    // Account initiating the call
                chain: currentChain,          // Chain information object
                value: parseEther(ethAmount), // Amount of ETH (in Wei) to send
            });
        
            // Log successful simulation
            console.log("Simulation successful. Prepared request:", request);
            // Proceed to sending the transaction using this 'request' object...

            // Log transaction sending
            console.log("Sending transaction...");
            // Execute the actual transaction
            const hash = await walletClient.writeContract(request)
            // Log transaction hash
            console.log("Transaction processed: ", hash)
        
        } catch (error) {
            // Log any errors during simulation or transaction
            console.error("Transaction simulation failed:", error);
            // Handle simulation errors (e.g., display message to user)
        }                    
    } else {
        // Update button text if MetaMask is not installed
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

// Define click handler for the balance button
balanceButton.onclick = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
        // Create a public client for read operations
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        
        try {   
            // Get the balance of the contract
            const balance = await publicClient.getBalance({
                address: contractAddress,
            })
            // Log the formatted balance
            console.log(`Contract Balance: ${formatEther(balance)} ETH`);

        } catch (error) {
            // Log any errors when getting balance
            console.error("Error getting balance:", error);
        }
    } else {
        // Update button text if MetaMask is not installed
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

withdrawButton.onclick = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {               
        try {
            // Create a wallet client using MetaMask as transport
            walletClient = createWalletClient({
                transport: custom(window.ethereum)
            })
            // Request user to connect their wallet and get the connected account
            const [connectedAccount] = await walletClient.requestAddresses();
            // Get current chain information
            const currentChain = await getCurrentChain(walletClient);
            
            // Create a public client for read operations
            publicClient = createPublicClient({
                transport: custom(window.ethereum)
            })

            // Log simulation start
            console.log("Simulating withdraw transaction...");
            
            // Simulate the contract call before sending the actual transaction
            const { request } = await publicClient.simulateContract({
                address: contractAddress,       // Target contract address
                abi: abi,                      // Contract's ABI
                functionName: "withdraw",      // Function to simulate
                account: connectedAccount,     // Account initiating the call
                chain: currentChain,           // Chain information object
            });
        
            // Log successful simulation
            console.log("Simulation successful. Prepared request:", request);
            
            // Log transaction sending
            console.log("Sending withdraw transaction...");
            // Execute the actual transaction
            const hash = await walletClient.writeContract(request)
            // Log transaction hash
            console.log("Withdraw transaction processed: ", hash)
        
        } catch (error) {
            // Log any errors during simulation or transaction
            console.error("Withdraw transaction simulation failed:", error);
            // Handle simulation errors (e.g., display message to user)
        }                    
    } else {
        // Update button text if MetaMask is not installed
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

// Helper function to get current chain information
async function getCurrentChain(client) {
    // Get the chain ID from the client
    const chainId = await client.getChainId()
    // Define a chain object with the retrieved chain ID
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
    // Return the chain object
    return currentChain
  }
import { Abi } from "viem";

// Interface for constructor ABI
interface AbiConstructor {
  inputs: Array<{ internalType: string; name: string; type: string }>;
  stateMutability: "nonpayable";
  type: "constructor";
}

// Interface for error ABI
interface AbiError {
  inputs: never[];
  name: string;
  type: "error";
}

// Interface for function ABI
interface AbiFunction {
  inputs: Array<{ internalType: string; name: string; type: string }>;
  name: string;
  outputs: Array<{ internalType: string; name: string; type: string }>;
  stateMutability: "view" | "nonpayable" | "payable";
  type: "function";
}

// Union type for ABI items
type AbiItem = AbiConstructor | AbiError | AbiFunction;

// Contract address as a hex string
export const contractAddress: `0x${string}` = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// ABI array with explicit typing for each item
export const abi: Abi = [
  {
    inputs: [{ internalType: "address", name: "priceFeed", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  } as AbiConstructor,
  {
    inputs: [],
    name: "FundMe__NotOwner",
    type: "error",
  } as AbiError,
  {
    inputs: [],
    name: "MINIMUM_USD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  } as AbiFunction,
  {
    inputs: [],
    name: "cheaperWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  } as AbiFunction,
  {
    inputs: [],
    name: "fund",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  } as AbiFunction,
  {
    inputs: [
      {
        internalType: "address",
        name: "fundingAddress",
        type: "address",
      },
    ],
    name: "getAddressToAmountFunded",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  } as AbiFunction,
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getFunder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  } as AbiFunction,
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  } as AbiFunction,
  {
    inputs: [],
    name: "getPriceFeed",
    outputs: [
      {
        internalType: "contract AggregatorV3Interface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  } as AbiFunction,
  {
    inputs: [],
    name: "getVersion",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  } as AbiFunction,
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  } as AbiFunction,
];
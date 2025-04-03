export const CODE_ID=270;

export const CHAIN_ID="xion-testnet-2"

export const CONTRACT_ADDRESS=import.meta.env.VITE_CONTRACT_ADDRESS;

export const TREASURY_ADDRESS=import.meta.env.VITE_TREASURY_ADDRESS;

export const NODE="https://rpc.xion-testnet-2.burnt.com:443";

export const TEST_MSG=`MSG={"title":"CollabSpaceX","description":"A space for builders to connect, collab & create","skills_required":"["Rust", "Blockchain", "Smart Contracts"]"}
`
export const treasuryConfig = {
    treasury: TREASURY_ADDRESS,
    gasPrice: "0.001uxion",
    rpcUrl: "https://rpc.xion-testnet-2.burnt.com/",
    restUrl: "https://api.xion-testnet-2.burnt.com/",
  };

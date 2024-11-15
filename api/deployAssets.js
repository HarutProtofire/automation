import { ethers } from "ethers";
import dotenv from 'dotenv';

export default async function handler(req, res) {
  try {
    // Load environment variables
    const RPC_URL = process.env.RPC_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const ABI = [
      "function deployAssets() public",
      "function pendingDepositAssets() public",
    ];

    // Set up ethers.js
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    let pendingAssets = await contract.connect(wallet).functions.pendingDepositAssets();
    let threshold = ethers.parseEther("4");
    
    if (pendingAssets >= threshold) {
        // Call the function
        const tx = await contract.connect(wallet).functions.deployAssets();
        await tx.wait();
        console.log(`Transaction successful: ${tx.hash}`);
        res.status(200).json({ success: true, txHash: tx.hash });
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}

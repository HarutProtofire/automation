import { ethers } from "ethers";

export default async function handler(req, res) {
  try {
    // Load environment variables
    const RPC_URL = process.env.RPC_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const ABI = [
      "function deployAssets() public",
    ];

    // Set up ethers.js
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    // Call the function
    const tx = await contract.deployAssets();
    await tx.wait();

    console.log(`Transaction successful: ${tx.hash}`);
    res.status(200).json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}

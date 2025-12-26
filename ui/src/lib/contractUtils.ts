import { Contract } from 'ethers';
import { FHERaffleABI, FHERaffleLocalABI } from '../abi/FHERaffleABI';

/**
 * Get contract ABI based on network
 * @param chainId - The chain ID
 * @returns The contract ABI
 */
export function getFHERaffleABI(chainId: number) {
  if (chainId === 31337) {
    // Local network: use local contract without FHE
    return FHERaffleLocalABI.abi;
  }
  // Sepolia or other networks: use FHE contract
  return FHERaffleABI.abi;
}

/**
 * Get raffle count
 * @param chainId - The chain ID
 * @returns Total number of raffles
 */
export async function getRaffleCount(chainId: number) {
  const abi = getFHERaffleABI(chainId);
  const address = getContractAddress(chainId);
  
  if (!address) {
    throw new Error(`Contract not deployed on chain ${chainId}`);
  }

  // Create a read-only contract (no signer needed for view functions)
  const contract = new Contract(address, abi);

  try {
    const count = await contract.getRaffleCount();
    return Number(count);
  } catch (error: any) {
    console.error('Error getting raffle count:', error);
    throw error;
  }
}

/**
 * Get raffle metadata
 * @param raffleId - The raffle ID
 * @param chainId - The chain ID
 * @returns Raffle metadata
 */
export async function getRaffleMeta(raffleId: number, chainId: number) {
  const abi = getFHERaffleABI(chainId);
  const address = getContractAddress(chainId);
  
  if (!address) {
    throw new Error(`Contract not deployed on chain ${chainId}`);
  }

  const contract = new Contract(address, abi);

  try {
    const meta = await contract.getRaffleMeta(raffleId);
    return {
      title: meta[0],
      description: meta[1],
      creator: meta[2],
      prizeAmount: meta[3],
      entryFee: meta[4],
      maxEntries: Number(meta[5]),
      currentEntries: Number(meta[6]),
      expireAt: Number(meta[7]),
      isActive: meta[8],
      isDrawn: meta[9],
      winner: meta[10],
      createdAt: Number(meta[11]),
    };
  } catch (error: any) {
    console.error('Error getting raffle metadata:', error);
    throw error;
  }
}

/**
 * Check if address has entered a raffle
 * @param raffleId - The raffle ID
 * @param participant - The participant address
 * @param chainId - The chain ID
 * @returns Whether address has entered
 */
export async function hasEntered(raffleId: number, participant: string, chainId: number) {
  const abi = getFHERaffleABI(chainId);
  const address = getContractAddress(chainId);
  
  if (!address) {
    throw new Error(`Contract not deployed on chain ${chainId}`);
  }

  const contract = new Contract(address, abi);

  try {
    const entered = await contract.hasEntered(raffleId, participant);
    return entered;
  } catch (error: any) {
    console.error('Error checking if entered:', error);
    throw error;
  }
}

/**
 * Get encrypted/plain entry amount for a specific entry
 * @param raffleId - The raffle ID
 * @param entryIndex - The entry index
 * @param chainId - The chain ID
 * @returns Entry amount (bigint)
 */
export async function getUserEntryAmount(raffleId: number, userAddress: string, chainId: number) {
  const abi = getFHERaffleABI(chainId);
  const address = getContractAddress(chainId);
  
  if (!address) {
    throw new Error(`Contract not deployed on chain ${chainId}`);
  }

  const contract = new Contract(address, abi);

  try {
    const result = await contract.getEntry(raffleId, userAddress);
    
    if (chainId === 31337) {
      // Local network: return plain uint256 value
      return result[0]; // uint256 plain amount
    } else {
      // Sepolia: return euint32 encrypted value
      return result[0]; // euint32 encrypted handle
    }
  } catch (error: any) {
    console.error('Error getting user entry amount:', error);
    throw error;
  }
}

/**
 * Get contract address
 * @param chainId - The chain ID
 * @returns Contract address or undefined
 */
export function getContractAddress(chainId: number): string | undefined {
  // Import addresses
  const addresses = {
    31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Will be updated after deployment
    11155111: '0x0000000000000000000000000000000000000000' // Placeholder, update this after deployment
  };

  // Check if environment variable is set for local contract
  if (chainId === 31337 && import.meta.env.VITE_LOCAL_CONTRACT_ADDRESS) {
    return import.meta.env.VITE_LOCAL_CONTRACT_ADDRESS as string;
  }

  const address = addresses[chainId as keyof typeof addresses];
  return address;
}

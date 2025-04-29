import { ethers } from 'ethers';
import { IPFS_GATEWAY } from './constants';

// Convert IPFS URI to HTTP URL
export const ipfsToHttp = (uri: string): string => {
  if (!uri) return '';
  if (uri.startsWith('ipfs://')) {
    return `${IPFS_GATEWAY}${uri.replace('ipfs://', '')}`;
  }
  return uri;
};

// Check if a string is a valid Ethereum address
export const isValidEthAddress = (address: string): boolean => {
  return ethers.utils.isAddress(address);
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.ethereum);
};

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Parse NFT metadata from tokenURI
export const parseNFTMetadata = async (tokenURI: string): Promise<any> => {
  try {
    const url = ipfsToHttp(tokenURI);
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error parsing NFT metadata:', error);
    return null;
  }
};

// Parse error message from ethers errors
export const parseErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  
  // Handle ethers errors
  if (error.reason) return error.reason;
  if (error.data && error.data.message) return error.data.message;
  if (error.message) return error.message;
  
  return 'An unknown error occurred';
};

// Sleep function for delaying operations
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
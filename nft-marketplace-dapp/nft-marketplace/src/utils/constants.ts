// Network configuration
export const SUPPORTED_CHAIN_ID = 11155111; // Sepolia testnet
export const SUPPORTED_CHAIN_NAME = 'Sepolia';
export const SUPPORTED_CHAIN_CURRENCY = {
  name: 'ETH',
  symbol: 'ETH',
  decimals: 18,
};

// Contract addresses
export const NFT_CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // Replace with your actual deployed address
export const MARKETPLACE_CONTRACT_ADDRESS = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'; // Replace with your actual deployed address

// IPFS configuration
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
export const NFT_STORAGE_API_KEY =  "96d43fd1.29d57215eb9a4cd0992d3589d5bf47eb";

// API configuration
export const API_BASE_URL =  'http://localhost:5000/api';

// Pagination
export const ITEMS_PER_PAGE = 12;

// NFT Categories
export const NFT_CATEGORIES = [
  'Art',
  'Collectibles',
  'Music',
  'Photography',
  'Sports',
  'Trading Cards',
  'Utility',
  'Virtual Worlds',
];

// Filter options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'priceHighToLow', label: 'Price: High to Low' },
  { value: 'priceLowToHigh', label: 'Price: Low to High' },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Items' },
  { value: 'forSale', label: 'For Sale' },
  { value: 'notForSale', label: 'Not For Sale' },
];
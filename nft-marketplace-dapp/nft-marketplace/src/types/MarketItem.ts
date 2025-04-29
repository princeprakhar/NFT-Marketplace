// src/types/MarketItem.ts
export interface MarketItem {
  _id: string;
  tokenId: number;
  name: string;
  description: string;
  image: string;
  ipfsHash: string;
  tokenURI: string;
  owner: string;
  creator: string;
  price?: string; // Optional as it may not be for sale
  createdAt: string;
  __v: number;
}

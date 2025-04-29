// src/types/NFT.ts
export interface NFT {
  _id: string;
  tokenId: number;
  name: string;
  description: string;
  image: string;
  creator: string;
  owner: string;
  tokenURI: string;
  ipfsHash: string;
  createdAt: string;
  __v: number;
}
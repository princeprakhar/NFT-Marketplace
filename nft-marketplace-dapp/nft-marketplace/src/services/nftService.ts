// src/services/nftService.ts
import api from './api';
import { NFT } from '../types/NFT';

export const getAllNFTs = async (): Promise<NFT[]> => {
  const response = await api.get('/nft');
  return response.data;
};

export const getNFTById = async (id: string): Promise<NFT> => {
  const response = await api.get(`/nft/${id}`);
  return response.data;
};

export const getNFTsByOwner = async (address: string): Promise<NFT[]> => {
  const response = await api.get(`/nft/owner/${address}`);
  return response.data;
};

export const createNFT = async (nftData: {
  name: string;
  description: string;
  creator: string;
  attributes?: { trait_type: string; value: string }[];
  image: string;
}): Promise<NFT> => {
  const response = await api.post('/nft/create', nftData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
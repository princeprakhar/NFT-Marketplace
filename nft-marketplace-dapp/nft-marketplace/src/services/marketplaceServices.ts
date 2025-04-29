// src/services/marketplaceService.ts
import api from './api';
import { MarketItem } from '../types/MarketItem';

export const getAllMarketItems = async (): Promise<MarketItem[]> => {
  const response = await api.get('/marketplace/items');
  console.log('Market items:', response.data); // Debugging line to check the response
  return response.data;
};

export const getMarketItemById = async (id: string): Promise<MarketItem> => {
  const response = await api.get(`/marketplace/items/${id}`);
  return response.data;
};

export const getMarketItemsBySeller = async (address: string): Promise<MarketItem[]> => {
  const response = await api.get(`/marketplace/seller/${address}`);
  return response.data;
};

export const getMarketItemsByOwner = async (address: string): Promise<MarketItem[]> => {
  const response = await api.get(`/marketplace/owner/${address}`);
  return response.data;
};

export const createMarketItem = async (marketItemData: {
  itemId: number;
  tokenId: number;
  seller: string;
  price: string;
  nftId: string;
}): Promise<MarketItem> => {
  const response = await api.post('/marketplace/list', marketItemData);
  return response.data;
};

export const updateMarketItemSold = async (
  itemId: number,
  buyer: string
): Promise<MarketItem> => {
  const response = await api.put(`/marketplace/sold/${itemId}`, { buyer });
  return response.data;
};
// // src/hooks/useMarketplace.ts
// import { useState } from 'react';
// import { ethers } from 'ethers';
// import { useWeb3Context } from '../context/Web3Context';
// import * as marketplaceService from '../services/marketplaceServices';
// import { MarketItem } from '../types/MarketItem';

// export const useMarketplace = () => {
//   const { marketplaceContract, account } = useWeb3Context();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const listNFT = async (
//     nftContractAddress: string,
//     tokenId: number,
//     price: string,
//     nftId: string
//   ): Promise<MarketItem | null> => {
//     if (!marketplaceContract || !account) {
//       setError("Wallet not connected");
//       return null;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       // Convert price to wei
//       const priceInWei = ethers.utils.parseUnits(price, 'ether');

//       // Get listing fee
//       const listingFee = await marketplaceContract.getListingFee();

//       // Create market item on blockchain
//       const transaction = await marketplaceContract.createMarketItem(
//         nftContractAddress,
//         tokenId,
//         priceInWei,
//         { value: listingFee }
//       );
//       const tx = await transaction.wait();

//       // Get the itemId from the event logs
//       const event = tx.events.find((e: any) => e.event === 'MarketItemCreated');
//       const itemId = event.args.itemId.toNumber();

//       // Create market item in database
//       const marketItem = await marketplaceService.createMarketItem({
//         itemId,
//         tokenId,
//         seller: account,
//         price: priceInWei.toString(),
//         nftId,
//       });

//       return marketItem;
//     } catch (err) {
//       console.error("Error listing NFT:", err);
//       setError(err instanceof Error ? err.message : "Failed to list NFT");
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const buyNFT = async (
//     nftContractAddress: string,
//     itemId: number,
//     price: string
//   ): Promise<boolean> => {
//     if (!marketplaceContract || !account) {
//       setError("Wallet not connected");
//       return false;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       // Convert price to wei
//       const priceInWei = ethers.utils.parseUnits(price, 'ether');

//       // Buy the NFT on blockchain
//       const transaction = await marketplaceContract.createMarketSale(
//         nftContractAddress,
//         itemId,
//         { value: priceInWei }
//       );
//       await transaction.wait();

//       // Update the market item in database
//       await marketplaceService.updateMarketItemSold(itemId, account);

//       return true;
//     } catch (err) {
//       console.error("Error buying NFT:", err);
//       setError(err instanceof Error ? err.message : "Failed to buy NFT");
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchMarketItems = async (): Promise<MarketItem[]> => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       return await marketplaceService.getAllMarketItems();
//     } catch (err) {
//       console.error("Error fetching market items:", err);
//       setError(err instanceof Error ? err.message : "Failed to fetch market items");
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchMyListedItems = async (): Promise<MarketItem[]> => {
//     if (!account) {
//       setError("Wallet not connected");
//       return [];
//     }

//     try {
//       setIsLoading(true);
//       setError(null);
//       return await marketplaceService.getMarketItemsBySeller(account);
//     } catch (err) {
//       console.error("Error fetching listed items:", err);
//       setError(err instanceof Error ? err.message : "Failed to fetch listed items");
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchMyPurchasedItems = async (): Promise<MarketItem[]> => {
//     if (!account) {
//       setError("Wallet not connected");
//       return [];
//     }

//     try {
//       setIsLoading(true);
//       setError(null);
//       return await marketplaceService.getMarketItemsByOwner(account);
//     } catch (err) {
//       console.error("Error fetching purchased items:", err);
//       setError(err instanceof Error ? err.message : "Failed to fetch purchased items");
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     listNFT,
//     buyNFT,
//     fetchMarketItems,
//     fetchMyListedItems,
//     fetchMyPurchasedItems,
//     isLoading,
//     error,
//   };
// };




// src/hooks/useMarketplace.ts
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3Context } from '../context/Web3Context';
import * as marketplaceService from '../services/marketplaceServices';
import { MarketItem } from '../types/MarketItem';

export const useMarketplace = () => {
  const { marketplaceContract, account } = useWeb3Context();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listNFT = useCallback(async (
    nftContractAddress: string,
    tokenId: number,
    price: string,
    nftId: string
  ): Promise<MarketItem | null> => {
    if (!marketplaceContract || !account) {
      setError("Wallet not connected");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Convert price to wei
      const priceInWei = ethers.utils.parseUnits(price, 'ether');

      // Get listing fee
      const listingFee = await marketplaceContract.getListingFee();

      // Create market item on blockchain
      const transaction = await marketplaceContract.createMarketItem(
        nftContractAddress,
        tokenId,
        priceInWei,
        { value: listingFee }
      );
      const tx = await transaction.wait();

      // Get the itemId from the event logs
      const event = tx.events.find((e: any) => e.event === 'MarketItemCreated');
      const itemId = event.args.itemId.toNumber();

      // Create market item in database
      const marketItem = await marketplaceService.createMarketItem({
        itemId,
        tokenId,
        seller: account,
        price: priceInWei.toString(),
        nftId,
      });

      return marketItem;
    } catch (err) {
      console.error("Error listing NFT:", err);
      setError(err instanceof Error ? err.message : "Failed to list NFT");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract, account]);

  const buyNFT = useCallback(async (
    nftContractAddress: string,
    itemId: number,
    price: string
  ): Promise<boolean> => {
    if (!marketplaceContract || !account) {
      setError("Wallet not connected");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Convert price to wei
      const priceInWei = ethers.utils.parseUnits(price, 'ether');

      // Buy the NFT on blockchain
      const transaction = await marketplaceContract.createMarketSale(
        nftContractAddress,
        itemId,
        { value: priceInWei }
      );
      await transaction.wait();

      // Update the market item in database
      await marketplaceService.updateMarketItemSold(itemId, account);

      return true;
    } catch (err) {
      console.error("Error buying NFT:", err);
      setError(err instanceof Error ? err.message : "Failed to buy NFT");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract, account]);

  const fetchMarketItems = useCallback(async (): Promise<MarketItem[]> => {
    try {
      setIsLoading(true);
      setError(null);
      return await marketplaceService.getAllMarketItems();
    } catch (err) {
      console.error("Error fetching market items:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch market items");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array since this doesn't depend on props or state

  const fetchMyListedItems = useCallback(async (): Promise<MarketItem[]> => {
    if (!account) {
      setError("Wallet not connected");
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);
      return await marketplaceService.getMarketItemsBySeller(account);
    } catch (err) {
      console.error("Error fetching listed items:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch listed items");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const fetchMyPurchasedItems = useCallback(async (): Promise<MarketItem[]> => {
    if (!account) {
      setError("Wallet not connected");
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);
      return await marketplaceService.getMarketItemsByOwner(account);
    } catch (err) {
      console.error("Error fetching purchased items:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch purchased items");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  return {
    listNFT,
    buyNFT,
    fetchMarketItems,
    fetchMyListedItems,
    fetchMyPurchasedItems,
    isLoading,
    error,
  };
};
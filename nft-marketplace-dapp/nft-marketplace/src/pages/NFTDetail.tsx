// src/pages/NFTDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NFTDetails from '../components/marketplace/NFTDetails';
import { useMarketplace } from '../hooks/useMarketplace';
import * as nftService from '../services/nftService';
import * as marketplaceService from '../services/marketplaceServices';
import { NFT } from '../types/NFT';
import { MarketItem } from '../types/MarketItem';
import { toast } from 'react-toastify';
import { NFT_CONTRACT_ADDRESS } from '../utils/constants';

const NFTDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nft, setNft] = useState<NFT | null>(null);
  const [marketItem, setMarketItem] = useState<MarketItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { buyNFT } = useMarketplace();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNFTDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const marketItemData = await marketplaceService.getMarketItemById(id);
        const nftData = await nftService.getNFTById(
          (marketItemData.nftId as any)._id || marketItemData.nftId as string
        );
        
        setNft(nftData);
        setMarketItem(marketItemData);
      } catch (err) {
        console.error('Error fetching NFT details:', err);
        toast.error('Failed to load NFT details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTDetails();
  }, [id]);

  const handleBuyNFT = async () => {
    if (!marketItem || !nft) return;
    
    try {
      const success = await buyNFT(
        NFT_CONTRACT_ADDRESS,
        marketItem.itemId,
        marketItem.price
      );
      
      if (success) {
        toast.success('NFT purchased successfully!');
        navigate('/profile');
      }
    } catch (err) {
      console.error('Error buying NFT:', err);
      toast.error('Failed to purchase NFT');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">NFT not found</h2>
        <p className="text-gray-500 mt-2">The NFT you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div>
      <NFTDetails 
        nft={nft}
        marketItem={marketItem || undefined}
        onBuy={handleBuyNFT}
      />
    </div>
  );
};

export default NFTDetail;
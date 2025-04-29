// src/components/marketplace/NFTGrid.tsx
import React from 'react';
import NFTCard from './NFTCard';
import { MarketItem } from '../../types/MarketItem';
import { useAuth } from '../../context/AuthContext';

interface NFTGridProps {
  items: MarketItem[];
  onBuy?: (itemId: string) => void;
}

const NFTGrid: React.FC<NFTGridProps> = ({ items, onBuy }) => {
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No NFTs found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <NFTCard 
          key={item._id} 
          item={item} 
          onBuy={onBuy ? () => onBuy(item._id) : undefined}
          isOwner={user?.address?.toLowerCase() === item.owner?.toLowerCase()}
        />
      ))}
    </div>
  );
};

export default NFTGrid;
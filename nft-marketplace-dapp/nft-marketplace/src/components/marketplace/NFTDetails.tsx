// src/components/marketplace/NFTDetails.tsx
import React from 'react';
import { ethers } from 'ethers';
import Button from '../common/Button';
import { NFT } from '../../types/NFT';
import { MarketItem } from '../../types/MarketItem';
import { useWeb3Context } from '../../context/Web3Context';

interface NFTDetailsProps {
  nft: NFT;
  marketItem?: MarketItem;
  onBuy?: () => void;
  isLoading?: boolean;
}

const NFTDetails: React.FC<NFTDetailsProps> = ({
  nft,
  marketItem,
  onBuy,
  isLoading = false,
}) => {
  const { account } = useWeb3Context();
  
  const isOwner = account?.toLowerCase() === nft.owner.toLowerCase();
  const isSeller = marketItem && account?.toLowerCase() === marketItem.seller.toLowerCase();
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-auto md:h-full object-cover"
          />
        </div>
        <div className="p-6 md:w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{nft.name}</h1>
            <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              Token ID: {nft.tokenId}
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">{nft.description}</p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Creator</span>
              <span className="font-medium text-gray-700">{formatAddress(nft.creator)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Owner</span>
              <span className="font-medium text-gray-700">
                {nft.owner === '0x0000000000000000000000000000000000000000' 
                  ? 'No owner yet' 
                  : formatAddress(nft.owner)}
              </span>
            </div>
            {marketItem && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Seller</span>
                <span className="font-medium text-gray-700">{formatAddress(marketItem.seller)}</span>
              </div>
            )}
          </div>
          
          {marketItem && !marketItem.sold && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Current price</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {ethers.utils.formatEther(marketItem.price)} ETH
                  </p>
                </div>
                {!isOwner && !isSeller && (
                  <Button
                    onClick={onBuy}
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Buy Now
                  </Button>
                )}
                {isSeller && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    You are selling this NFT
                  </span>
                )}
                {isOwner && !marketItem && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    You own this NFT
                  </span>
                )}
              </div>
            </div>
          )}
          
          {(!marketItem || marketItem.sold) && isOwner && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {}}
            >
              List for Sale
            </Button>
          )}
          
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2 flex justify-between">
                <span className="text-gray-500">Token Standard</span>
                <span>ERC-721</span>
              </p>
              <p className="mb-2 flex justify-between">
                <span className="text-gray-500">Blockchain</span>
                <span>Ethereum</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">IPFS Hash</span>
                <a 
                  href={`https://ipfs.io/ipfs/${nft.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {nft.ipfsHash.substring(0, 8)}...
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;
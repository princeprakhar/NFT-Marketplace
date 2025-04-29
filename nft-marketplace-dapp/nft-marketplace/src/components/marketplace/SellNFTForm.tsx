import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { useMarketplace } from '../../hooks/useMarketplace';
import { ethers } from 'ethers';

interface SellNFTFormProps {
  tokenId: string;
  nftContractAddress: string;
  onSuccess?: () => void;
}

const SellNFTForm: React.FC<SellNFTFormProps> = ({ 
  tokenId, 
  nftContractAddress, 
  onSuccess 
}) => {
  const [price, setPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { listNFT } = useMarketplace();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!price || parseFloat(price) <= 0) {
        throw new Error('Please enter a valid price greater than 0');
      }

      const priceInWei = ethers.utils.parseEther(price);
      await listNFT(nftContractAddress, Number(tokenId), priceInWei.toString(), tokenId);
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/marketplace');
      }
    } catch (err: any) {
      console.error('Error listing NFT for sale:', err);
      setError(err.message || 'Failed to list NFT for sale');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">List NFT for Sale</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="price">
            Price (ETH)
          </label>
          <input
            id="price"
            type="number"
            step="0.0001"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.1"
            required
          />
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'List for Sale'}
        </Button>
      </form>
    </div>
  );
};
export default SellNFTForm;
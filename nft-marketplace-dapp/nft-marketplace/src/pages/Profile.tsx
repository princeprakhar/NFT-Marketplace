// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/profile/ProfileForm';
import NFTGrid from '../components/marketplace/NFTGrid';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import  api  from '../services/api';
import { utils } from 'ethers'
import { MarketItem } from '../types/MarketItem';

const Profile: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'created' | 'owned' | 'sold' | 'profile'>('owned');
  const [createdNFTs, setCreatedNFTs] = useState<MarketItem[]>([]);
  const [ownedNFTs, setOwnedNFTs] = useState<MarketItem[]>([]);
  const [soldNFTs, setSoldNFTs] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    const fetchUserNFTs = async () => {
      if (!user?.address) return;
      
      setIsLoading(true);
      try {
        const exactAddress = utils.getAddress(user.address)
        console.log('Using checksummed address:', exactAddress)

        
        
        // Get created NFTs
        const createdResponse = await api.get(`/nft/owner/${exactAddress}`);
        console.log('Created NFTs:', createdResponse.data);
        setCreatedNFTs(createdResponse.data);
        
        // Get owned NFTs
        const ownedResponse = await api.get(`/nft/owner/${exactAddress}`);
        setOwnedNFTs(ownedResponse.data);
        
        // Get sold NFTs
        const soldResponse = await api.get(`/marketplace/seller/${exactAddress}`);
        const soldItems = soldResponse.data.filter((item: any) => item.sold);
        setSoldNFTs(soldItems);
      } catch (error) {
        console.error('Error fetching user NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserNFTs();
  }, [isAuthenticated, user, navigate]);
  
  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    switch (activeTab) {
      case 'created':
        return createdNFTs.length > 0 ? (
          <NFTGrid items={createdNFTs} />
        ) : (
          <EmptyState 
            title="No Created NFTs" 
            message="You haven't created any NFTs yet." 
            actionLink="/create" 
            actionText="Create NFT" 
          />
        );
      case 'owned':
        return ownedNFTs.length > 0 ? (
          <NFTGrid items={ownedNFTs} />
        ) : (
          <EmptyState 
            title="No Owned NFTs" 
            message="You don't own any NFTs yet." 
            actionLink="/marketplace" 
            actionText="Browse Marketplace" 
          />
        );
      case 'sold':
        return soldNFTs.length > 0 ? (
          <NFTGrid items={soldNFTs} />
        ) : (
          <EmptyState 
            title="No Sold NFTs" 
            message="You haven't sold any NFTs yet." 
          />
        );
      case 'profile':
        return <ProfileForm />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'owned' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('owned')}
          >
            Owned
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'created' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('created')}
          >
            Created
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'sold' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('sold')}
          >
            Sold
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'profile' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            Edit Profile
          </button>
        </div>
      </div>
      
      {renderTabContent()}
    </div>
  );
};

export default Profile;
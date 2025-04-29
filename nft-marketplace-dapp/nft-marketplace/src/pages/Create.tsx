// src/pages/Create.tsx
import React from 'react';
import NFTForm from '../components/marketplace/NFTForm';
import { useWeb3Context } from '../context/Web3Context';
import Button from '../components/common/Button';

const Create: React.FC = () => {
  const { isConnected, connectWallet, isLoading } = useWeb3Context();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create NFT</h1>
      
      {isConnected ? (
        <NFTForm />
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to create an NFT.
          </p>
          <Button 
            onClick={connectWallet} 
            isLoading={isLoading}
            className="px-8"
          >
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
};

export default Create;
// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import heroImage from '../assets/hero-image.png'; // You'll need to add this image
import { useAuth } from '../context/AuthContext'; // Adjust the import path as necessary

const Home: React.FC = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between py-8">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Discover, Collect, and Sell Extraordinary NFTs
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Our NFT marketplace is the premier destination for NFT enthusiasts to explore, buy, and sell unique digital assets on the blockchain.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/marketplace">
              <Button variant="primary" className="px-8 py-3">
                Explore Marketplace
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="outline" className="px-8 py-3">
                Create NFT
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img 
            src={heroImage} 
            alt="NFT Marketplace Hero" 
            className="rounded-xl shadow-xl w-full"
          />
        </div>
      </div>

      {/* Authentication Section */}
      {!isAuthenticated ? (
        <div className="mb-12 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Connect your wallet to get started
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            To create, buy, or sell NFTs, you'll need to connect your MetaMask wallet.
          </p>
          <Button onClick={login} disabled={isLoading} className="text-lg py-3 px-6">
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
          <Link to="/marketplace">
            <Button className="text-lg py-3 px-6">Browse Marketplace</Button>
          </Link>
          <Link to="/create">
            <Button variant="outline" className="text-lg py-3 px-6">Create NFT</Button>
          </Link>
        </div>
      )}

      {/* Features Section */}
      <div className="py-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Marketplace</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
            <p className="text-gray-600">All transactions are secured by the Ethereum blockchain, ensuring authenticity and ownership.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Decentralized Storage</h3>
            <p className="text-gray-600">All NFT metadata and assets are stored on IPFS, ensuring permanence and censorship resistance.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Low Transaction Fees</h3>
            <p className="text-gray-600">Our efficient smart contracts minimize gas costs, making transactions more affordable.</p>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Home;
// src/context/Web3Context.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import NFTCollection from '../artifacts/contracts/NFTCollection.sol/NFTCollection.json';
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { NFT_CONTRACT_ADDRESS, MARKETPLACE_CONTRACT_ADDRESS } from '../utils/constants';

// const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
// const MARKETPLACE_CONTRACT_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  provider: ethers.providers.Web3Provider | null;
  nftContract: ethers.Contract | null;
  marketplaceContract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  provider: null,
  nftContract: null,
  marketplaceContract: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isLoading: false,
});

export const useWeb3Context = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
  const [marketplaceContract, setMarketplaceContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        network: "hardhat",
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      console.log("Connected to wallet:", address);
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFTCollection.abi,
        signer
      );

      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        NFTMarketplace.abi,
        signer
      );

      setAccount(address);
      setProvider(provider);
      setNftContract(nftContract);
      setMarketplaceContract(marketplaceContract);

      // Listen for account changes
      instance.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0]);
      });

      // Listen for chain changes
      instance.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setNftContract(null);
    setMarketplaceContract(null);
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  };

  useEffect(() => {
    const connectOnLoad = async () => {
      if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
        await connectWallet();
      }
    };
    connectOnLoad();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected: !!account,
        provider,
        nftContract,
        marketplaceContract,
        connectWallet,
        disconnectWallet,
        isLoading,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
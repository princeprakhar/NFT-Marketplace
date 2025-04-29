import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

interface UseWeb3Return {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  isConnecting: boolean;
  error: Error | null;
}

export const useWeb3 = (): UseWeb3Return => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const setupProvider = useCallback(async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        
        const web3Signer = web3Provider.getSigner();
        setSigner(web3Signer);
        
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        
        const { chainId } = await web3Provider.getNetwork();
        setChainId(chainId);
        
        return true;
      } catch (err: any) {
        console.error('Error setting up web3 provider:', err);
        setError(err);
        return false;
      }
    } else {
      setError(new Error('MetaMask is not installed'));
      return false;
    }
  }, []);

  const connect = async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const success = await setupProvider();
      
      if (!success) {
        throw new Error('Failed to connect to wallet');
      }
    } catch (err: any) {
      console.error('Error connecting to wallet:', err);
      setError(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    // Note: MetaMask doesn't support programmatic disconnection,
    // so we just clear our local state
  };

  const switchNetwork = async (targetChainId: number): Promise<void> => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (err: any) {
      // This error code indicates the chain hasn't been added to MetaMask
      if (err.code === 4902) {
        // Add network logic here if needed
        throw new Error('Network not available, please add it to your wallet first');
      }
      throw err;
    }
  };

  useEffect(() => {
    setupProvider();
    
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
        } else {
          setAccount(accounts[0]);
        }
      };
      
      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      };
      
      const handleDisconnect = () => {
        setAccount(null);
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
      
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [setupProvider]);

  return {
    provider,
    signer,
    account,
    chainId,
    connect,
    disconnect,
    switchNetwork,
    isConnecting,
    error
  };
};
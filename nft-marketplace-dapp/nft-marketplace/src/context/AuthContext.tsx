// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import  api  from '../services/api';
import { ethers } from 'ethers';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: {
    address: string;
    username?: string;
    profileImage?: string;
    bio?: string;
  } | null;
  login: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: {username?: string, profileImage?: string, bio?: string}) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { account, connect, disconnect, signer } = useWeb3();
  const [user, setUser] = useState<AuthContextProps['user']>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (account) {
        setIsLoading(true);
        try {
          // Check if user exists
          try {
            const response = await api.get(`/users/${account}`);
            if (response.data) {
              setUser(response.data);
              setIsAuthenticated(true);
            }
          } catch (error) {
            // If user doesn't exist, register them
            const registerResponse = await api.post('/users/register', { address: account });
            setUser(registerResponse.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          setUser(null);
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [account]);
  
  const login = async () => {
    setIsLoading(true);
    try {
      // First connect wallet
      await connect();
      
      if (!account || !signer) {
        throw new Error('No wallet connected');
      }
      
      // Initialize authentication
      const authResponse = await api.post('/users/auth/init', { address: account });
      const { message } = authResponse.data;
      
      // Request signature
      const signature = await signer.signMessage(message);
      
      // Verify signature
      const verifyResponse = await api.post('/users/auth/verify', {
        address: account,
        signature
      });
      
      if (verifyResponse.data.authenticated) {
        setUser(verifyResponse.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    disconnect();
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const updateProfile = async (data: {username?: string, profileImage?: string, bio?: string}) => {
    if (!account) return;
    
    setIsLoading(true);
    try {
      const response = await api.put(`/users/${account}`, data);
      setUser(prev => prev ? { ...prev, ...data } : null);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// // src/hooks/useNFT.ts
// import { useState } from 'react';
// import { useWeb3Context } from '../context/Web3Context';
// import * as nftService from '../services/nftService';
// import { NFT } from '../types/NFT';
// import { create } from 'ipfs-http-client'; // Install this package
// import { Buffer } from 'buffer'; // Install this package if not already available

// export const useNFT = () => {
//     const { nftContract, account } = useWeb3Context();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     // Create an IPFS client using Infura credentials
//     const projectId = "a2dd8ea24b9a426eb5301280a028298c";
//     const projectSecret = "4VXdHSRwFCsFAY676Y0ruASbND/l0S4AMV5kmRuP37NdniO1H8aiEQ";
//     const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

//     const ipfs = create({
//         host: 'ipfs.infura.io',
//         port: 5001,
//         protocol: 'https',
//         headers: {
//             authorization: auth,
//         },
//     });

//     const createNFT = async (
//         name: string,
//         description: string,
//         image: File,
//         attributes: { trait_type: string; value: string }[]
//     ): Promise<NFT | null> => {
//         if (!nftContract || !account) {
//             setError("Wallet not connected");
//             return null;
//         }

//         try {
//             setIsLoading(true);
//             setError(null);

//             // Upload image to IPFS
//             const imageUploadResult = await ipfs.add(image);
//             const imageCid = imageUploadResult.cid.toString();
//             const imageUrl = `https://ipfs.io/ipfs/${imageCid}`;

//             // Create metadata object
//             const metadata = {
//                 name,
//                 description,
//                 image: imageUrl,
//                 attributes
//             };

//             // Upload metadata to IPFS
//             const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
//             const metadataUploadResult = await ipfs.add(metadataBlob);
//             const metadataCid = metadataUploadResult.cid.toString();
//             const metadataUrl = `ipfs://${metadataCid}`;

//             // Create NFT data object
//             const nftData = {
//                 name,
//                 description,
//                 image: imageUrl,
//                 creator: account,
//                 attributes,
//                 tokenURI: metadataUrl,
//                 ipfsHash: metadataCid
//             };

//             // Save NFT metadata to backend
//             const createdNFT = await nftService.createNFT(nftData);

//             // Mint NFT on blockchain
//             const transaction = await nftContract.mintNFT(
//                 account,
//                 createdNFT.tokenURI
//             );
//             await transaction.wait();

//             return createdNFT;
//         } catch (err) {
//             console.error("Error creating NFT:", err);
//             setError(err instanceof Error ? err.message : "Failed to create NFT");
//             return null;
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchMyNFTs = async (): Promise<NFT[]> => {
//         if (!account) {
//             setError("Wallet not connected");
//             return [];
//         }

//         try {
//             setIsLoading(true);
//             setError(null);
//             return await nftService.getNFTsByOwner(account);
//         } catch (err) {
//             console.error("Error fetching NFTs:", err);
//             setError(err instanceof Error ? err.message : "Failed to fetch NFTs");
//             return [];
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return {
//         createNFT,
//         fetchMyNFTs,
//         isLoading,
//         error,
//     };
// };

// src/hooks/useNFT.ts
import { useState } from 'react';
import { useWeb3Context } from '../context/Web3Context';
import * as nftService from '../services/nftService';
import { NFT } from '../types/NFT';

export const useNFT = () => {
  const { nftContract, account } = useWeb3Context();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const createNFT = async (
    name: string,
    description: string,
    image: File,
    attributes: { trait_type: string; value: string }[]
  ): Promise<NFT | null> => {
    if (!nftContract || !account) {
      setError("Wallet not connected");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Convert image File to base64 string
      const imageBase64 = await fileToBase64(image);
      console.log(`Converting image (${image.name}, ${image.size} bytes) to base64`);

      // Create NFT data object
      const nftData = {
        name,
        description,
        image: imageBase64,
        creator: account,
        attributes
      };
      
      console.log("Creating NFT with data:", {
        name, 
        description,
        image: `${imageBase64.substring(0, 30)}... (truncated)`,
        creator: account,
        attributes
      });

      // Save NFT metadata to backend/IPFS
      const createdNFT = await nftService.createNFT(nftData);
      console.log("Created NFT:", createdNFT);

      // Mint NFT on blockchain
      console.log("Minting NFT on blockchain with URI:", createdNFT.tokenURI);
      const transaction = await nftContract.mintNFT(
        account,
        createdNFT.tokenURI
      );
      
      console.log("Transaction submitted:", transaction.hash);
      const receipt = await transaction.wait();
      console.log("Transaction confirmed:", receipt);

      return createdNFT;
    } catch (err: any) {
      console.error("Error creating NFT:", err);
      // Better error handling with more details
      const errorMessage = err.response?.data?.message || err.message || "Failed to create NFT";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyNFTs = async (): Promise<NFT[]> => {
    if (!account) {
      setError("Wallet not connected");
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);
      return await nftService.getNFTsByOwner(account);
    } catch (err: any) {
      console.error("Error fetching NFTs:", err);
      setError(err.message || "Failed to fetch NFTs");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createNFT,
    fetchMyNFTs,
    isLoading,
    error,
  };
};
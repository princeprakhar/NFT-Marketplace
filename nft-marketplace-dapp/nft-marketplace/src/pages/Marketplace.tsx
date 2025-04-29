// // src/pages/Marketplace.tsx
// import React, { useEffect, useState } from 'react';
// import NFTGrid from '../components/marketplace/NFTGrid';
// import { useMarketplace } from '../hooks/useMarketplace';
// import { MarketItem } from '../types/MarketItem';
// import { toast } from 'react-toastify';
// import { NFT_CONTRACT_ADDRESS } from '../utils/constants';
// import { useNavigate } from 'react-router-dom';

// const Marketplace: React.FC = () => {
//   const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
//   const { fetchMarketItems, buyNFT, isLoading, error } = useMarketplace();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadMarketItems = async () => {
//       const items = await fetchMarketItems();
//       setMarketItems(items);
//     };

//     loadMarketItems();
//   }, [fetchMarketItems]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   const handleBuyNFT = async (item: MarketItem) => {
//     try {
//       const success = await buyNFT(
//         NFT_CONTRACT_ADDRESS,
//         item.itemId,
//         item.price
//       );
      
//       if (success) {
//         toast.success('NFT purchased successfully!');
//         navigate('/profile');
//       }
//     } catch (err) {
//       console.error('Error buying NFT:', err);
//       toast.error('Failed to purchase NFT');
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">NFT Marketplace</h1>
//         <div className="flex items-center gap-4">
//           {/* Filter options could go here */}
//         </div>
//       </div>

//       <NFTGrid 
//         items={marketItems} 
//         onBuyNFT={handleBuyNFT} 
//         isLoading={isLoading} 
//       />
//     </div>
//   );
// };

// export default Marketplace;




// src/pages/Marketplace.tsx
import React, { useEffect, useState } from 'react';
import NFTGrid from '../components/marketplace/NFTGrid';
import { useMarketplace } from '../hooks/useMarketplace';
import { MarketItem } from '../types/MarketItem';
import { toast } from 'react-toastify';
import { NFT_CONTRACT_ADDRESS } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const Marketplace: React.FC = () => {
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { fetchMarketItems, buyNFT, isLoading, error } = useMarketplace();
  const navigate = useNavigate();

  // Load market items only once when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadMarketItems = async () => {
      try {
        const items = await fetchMarketItems();
        if (isMounted) {
          setMarketItems(items);
          setDataLoaded(true);
        }
      } catch (err) {
        console.error('Error loading market items:', err);
        if (isMounted) {
          setDataLoaded(true);
        }
      }
    };

    loadMarketItems();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run on mount

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleBuyNFT = async (item: MarketItem) => {
    try {
      const success = await buyNFT(
        NFT_CONTRACT_ADDRESS,
        item.itemId,
        item.price
      );
      
      if (success) {
        toast.success('NFT purchased successfully!');
        
        // Refresh market items after successful purchase
        const updatedItems = await fetchMarketItems();
        setMarketItems(updatedItems);
        
        navigate('/profile');
      }
    } catch (err) {
      console.error('Error buying NFT:', err);
      toast.error('Failed to purchase NFT');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">NFT Marketplace</h1>
        <div className="flex items-center gap-4">
          {/* Filter options could go here */}
        </div>
      </div>

      {dataLoaded && marketItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No NFTs available in the marketplace
        </div>
      ) : (
        <NFTGrid 
          items={marketItems} 
          onBuyNFT={handleBuyNFT} 
          isLoading={isLoading || !dataLoaded} 
        />
      )}
    </div>
  );
};

export default Marketplace;
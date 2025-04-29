// // src/components/marketplace/NFTCard.tsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ethers } from 'ethers';
// import Button from '../common/Button';
// import { NFT } from '../../types/NFT';
// import { MarketItem } from '../../types/MarketItem';

// interface NFTCardProps {
//   item: MarketItem;
//   onBuy?: () => void;
//   isOwner?: boolean;
// }

// const NFTCard: React.FC<NFTCardProps> = ({ item, onBuy, isOwner = false }) => {
//   const nft = item.nftId as NFT;
  
//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//       <div className="relative pb-2/3">
//         <img 
//           src={item.image} 
//           alt={item.name} 
//           className="h-48 w-full object-cover"
//         />
//       </div>
//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
//         <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
        
//         <div className="flex justify-between items-center mt-3">
//           <div>
//             <p className="text-sm text-gray-500">Price</p>
//             <p className="text-lg font-bold text-blue-600">
//               {item.price ? ethers.utils.formatEther(item.price) : 'Not for sale'} ETH
//             </p>
//           </div>
//           <div>
//             {isOwner ? (
//               <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">You own this</span>
//             ) : (
//               <Link to={`/nft/${item._id}`}>
//                 <Button variant="primary" onClick={onBuy}>
//                   {onBuy ? 'Buy Now' : 'View Details'}
//                 </Button>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NFTCard;



import React from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import Button from '../common/Button';
import { MarketItem } from '../../types/MarketItem';

interface NFTCardProps {
  item: MarketItem;
  onBuy?: () => void;
  isOwner?: boolean;
}

const NFTCard: React.FC<NFTCardProps> = ({ item, onBuy, isOwner = false }) => {
  // No need for the nftId line since we're accessing properties directly from item
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative pb-2/3">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-48 w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
        
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-lg font-bold text-blue-600">
              {item.price ? ethers.utils.formatEther(item.price) : 'Not for sale'} ETH
            </p>
          </div>
          <div>
            {isOwner ? (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">You own this</span>
            ) : (
              <Link to={`/nft/${item._id}`}>
                <Button variant="primary" onClick={onBuy}>
                  {onBuy ? 'Buy Now' : 'View Details'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;

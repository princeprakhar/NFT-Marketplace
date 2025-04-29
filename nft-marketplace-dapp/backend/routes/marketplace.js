// backend/routes/marketplace.js
const express = require('express');
const router = express.Router();
const MarketItem = require('../models/MarketItem');
const NFT = require('../models/NFT');
const ethers = require('ethers');

// Load contract ABIs
const MarketplaceABI = require('../../src/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;
const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC_URL);
const marketplaceContract = new ethers.Contract(
  process.env.MARKETPLACE_CONTRACT_ADDRESS,
  MarketplaceABI,
  provider
);

// Get all market items
router.get('/items', async (req, res) => {
  try {
    const marketItems = await MarketItem.find({ sold: false })
      .populate('nftId')
      .sort({ createdAt: -1 });
    
    res.json(marketItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market items', error: error.message });
  }
});

// Get market item by ID
router.get('/items/:id', async (req, res) => {
  try {
    const marketItem = await MarketItem.findById(req.params.id)
      .populate('nftId');
    
    if (!marketItem) {
      return res.status(404).json({ message: 'Market item not found' });
    }
    
    res.json(marketItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market item', error: error.message });
  }
});

// Get market items by seller
router.get('/seller/:address', async (req, res) => {
  try {
    const marketItems = await MarketItem.find({ seller: req.params.address })
      .populate('nftId')
      .sort({ createdAt: -1 });
    
    res.json(marketItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market items', error: error.message });
  }
});

// Get market items by owner (purchased items)
router.get('/owner/:address', async (req, res) => {
  try {
    const marketItems = await MarketItem.find({ 
      owner: req.params.address,
      sold: true 
    })
    .populate('nftId')
    .sort({ soldAt: -1 });
    
    res.json(marketItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market items', error: error.message });
  }
});

// Create a new market item (for tracking purposes, actual listing happens on blockchain)
router.post('/list', async (req, res) => {
  try {
    const { itemId, tokenId, seller, price, nftId } = req.body;
    
    const newMarketItem = new MarketItem({
      itemId,
      nftId,
      tokenId,
      seller,
      owner: ethers.constants.AddressZero,
      price,
      sold: false
    });
    
    await newMarketItem.save();
    
    // Update NFT owner to marketplace contract
    await NFT.findByIdAndUpdate(nftId, {
      owner: process.env.MARKETPLACE_CONTRACT_ADDRESS
    });
    
    res.status(201).json(newMarketItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating market item', error: error.message });
  }
});

// Update market item when sold
router.put('/sold/:itemId', async (req, res) => {
  try {
    const { buyer } = req.body;
    
    const marketItem = await MarketItem.findOne({ itemId: req.params.itemId });
    
    if (!marketItem) {
      return res.status(404).json({ message: 'Market item not found' });
    }
    
    marketItem.sold = true;
    marketItem.owner = buyer;
    marketItem.soldAt = new Date();
    
    await marketItem.save();
    
    // Update NFT owner
    await NFT.findByIdAndUpdate(marketItem.nftId, {
      owner: buyer
    });
    
    res.json(marketItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating market item', error: error.message });
  }
});

module.exports = router;
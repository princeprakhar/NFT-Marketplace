const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const NFT = require('../models/NFT');
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

// Load contract ABIs
const NFTCollectionABI = require('../../src/artifacts/contracts/NFTCollection.sol/NFTCollection.json').abi;
const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC_URL);
const nftContract = new ethers.Contract(
  process.env.NFT_CONTRACT_ADDRESS,
  NFTCollectionABI,
  provider
);

// Upload to local IPFS node
async function uploadToIPFS(imageBuffer, metadata) {
  try {
    console.log("Uploading image to IPFS");
    
    // Upload image to IPFS
    const imageFormData = new FormData();
    imageFormData.append('file', imageBuffer);
    
    const imageResponse = await axios.post('http://localhost:5001/api/v0/add', imageFormData, {
      headers: imageFormData.getHeaders()
    });
    
    const imageHash = imageResponse.data.Hash;
    console.log("Image uploaded to IPFS with hash:", imageHash);
    
    // Create and upload metadata
    const metadataJSON = JSON.stringify({
      name: metadata.name,
      description: metadata.description,
      image: `ipfs://${imageHash}`,
      attributes: metadata.attributes || []
    });
    
    const metadataFormData = new FormData();
    metadataFormData.append('file', Buffer.from(metadataJSON));
    
    const metadataResponse = await axios.post('http://localhost:5001/api/v0/add', metadataFormData, {
      headers: metadataFormData.getHeaders()
    });
    
    const metadataHash = metadataResponse.data.Hash;
    console.log("Metadata uploaded to IPFS with hash:", metadataHash);
    
    return `ipfs://${metadataHash}`;
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
}

// Create a new NFT
router.post('/create', async (req, res) => {
  try {
    console.log("Received NFT create request");
    
    if (!req.body) {
      return res.status(400).json({ message: 'Missing request body' });
    }
    
    const { name, description, creator, attributes, image } = req.body;
    
    if (!name || !description || !creator || !image) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        received: { 
          name: !!name, 
          description: !!description, 
          creator: !!creator, 
          image: !!image 
        } 
      });
    }

    let tokenURI;
    let ipfsHash;
    const tokenCount = await NFT.countDocuments();
    const tokenId = tokenCount + 1;

    if (image.startsWith('data:image/')) {
      console.log("Processing base64 image");
      const imageBuffer = Buffer.from(image.split(';base64,').pop(), 'base64');
      
      // Upload to local IPFS node
      tokenURI = await uploadToIPFS(imageBuffer, { name, description, attributes });
    } else if (image.startsWith('https://ipfs.io/ipfs/') || image.startsWith('ipfs://')) {
      console.log("Using existing IPFS URL");
      tokenURI = image.startsWith('ipfs://') ? image : image.replace('https://ipfs.io/ipfs/', 'ipfs://');
    } else {
      console.error("Invalid image format:", image.substring(0, 30) + "...");
      return res.status(400).json({ 
        message: "Unsupported image format. Must be base64 with MIME type or IPFS URL."
      });
    }

    ipfsHash = tokenURI.split('ipfs://')[1];
    console.log("IPFS hash:", ipfsHash);

    const newNFT = new NFT({
      tokenId,
      name,
      description,
      image: `https://ipfs.io/ipfs/${ipfsHash}`, // For public gateway access
      creator,
      owner: creator,
      tokenURI,
      ipfsHash
    });

    await newNFT.save();
    console.log("NFT saved to database");
    res.status(201).json(newNFT);

  } catch (error) {
    console.error('Error creating NFT:', error);
    res.status(500).json({ message: 'Error creating NFT', error: error.message });
  }
});



// Get all NFTs
router.get('/', async (req, res) => {
  try {
    const nfts = await NFT.find().sort({ createdAt: -1 });
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NFTs', error: error.message });
  }
});

// Get NFT by ID
router.get('/:id', async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }
    res.json(nft);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NFT', error: error.message });
  }
});

// Get NFTs by owner address
router.get('/owner/:address', async (req, res) => {
  try {
    const nfts = await NFT.find({ owner: req.params.address });
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NFTs', error: error.message });
  }
});

module.exports = router;
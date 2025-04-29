// backend/models/NFT.js
const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  tokenURI: {
    type: String,
    required: true
  },
  ipfsHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NFT', NFTSchema);
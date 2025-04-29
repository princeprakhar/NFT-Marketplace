// backend/models/MarketItem.js
const mongoose = require('mongoose');

const MarketItemSchema = new mongoose.Schema({
  itemId: {
    type: Number,
    required: true,
    unique: true
  },
  nftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT',
    required: true
  },
  tokenId: {
    type: Number,
    required: true
  },
  seller: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  sold: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  soldAt: {
    type: Date
  }
});

module.exports = mongoose.model('MarketItem', MarketItemSchema);
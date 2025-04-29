// backend/routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ethers = require('ethers');
const { isAddress } = require('ethers');
const crypto = require('crypto');

// Generate a random nonce
function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

// Register or get user
router.post('/register', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!isAddress(String(address))) {
      return res.status(400).json({ message: 'Invalid Ethereum address' });
    }
    
    // Check if user exists
    let user = await User.findOne({ address: address.toLowerCase() });
    
    if (!user) {
      // Create new user
      user = new User({
        address: address.toLowerCase(),
        nonce: generateNonce()
      });
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Get user by address
router.get('/:address', async (req, res) => {
  try {
    const address = req.params.address.toLowerCase();
    
    if (!isAddress(String(address))) {
      return res.status(400).json({ message: 'Invalid Ethereum address' });
    }
    
    const user = await User.findOne({ address });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user profile
router.put('/:address', async (req, res) => {
  try {
    const address = req.params.address.toLowerCase();
    const { username, profileImage, bio } = req.body;
    
    if (!isAddress(address)) {
      return res.status(400).json({ message: 'Invalid Ethereum address' });
    }
    
    const user = await User.findOne({ address });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (username) user.username = username;
    if (profileImage) user.profileImage = profileImage;
    if (bio) user.bio = bio;
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
});

// Initialize authentication with a signature request
router.post('/auth/init', async (req, res) => {
  try {
    const { address } = req.body;
    console.log('Initializing authentication for address:', address);
    if (!isAddress(String(address))) {
      return res.status(400).json({ message: 'Invalid Ethereum address' });
    }
    
    // Find or create user
    let user = await User.findOne({ address: address.toLowerCase() });
    
    if (!user) {
      user = new User({
        address: address.toLowerCase(),
        nonce: generateNonce()
      });
      await user.save();
    } else {
      // Update nonce for existing user
      user.nonce = generateNonce();
      await user.save();
    }
    
    // Generate message for signing
    const message = `Welcome to NFT Marketplace! Sign this message to authenticate. Nonce: ${user.nonce}`;
    
    res.json({ message, nonce: user.nonce });
  } catch (error) {
    console.error('Error initializing authentication:', error);
    res.status(500).json({ message: 'Error initializing authentication', error: error.message });
  }
});

// Verify signature for authentication
router.post('/auth/verify', async (req, res) => {
  try {
    const { address, signature } = req.body;
    
    if (!address || !signature) {
      return res.status(400).json({ message: 'Address and signature required' });
    }
    
    // Get user and their nonce
    const user = await User.findOne({ address: address.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate the message that was signed
    const message = `Welcome to NFT Marketplace! Sign this message to authenticate. Nonce: ${user.nonce}`;
    
    // Verify the signature
    const msgHash = ethers.utils.hashMessage(message);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, signature);
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // Update nonce to prevent replay attacks
    user.nonce = generateNonce();
    await user.save();
    
    res.json({ authenticated: true, user });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ message: 'Error verifying signature', error: error.message });
  }
});

module.exports = router;
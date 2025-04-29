#!/bin/bash

# Navigate to your project directory
cd C:\Users\prakh\OneDrive\Desktop\Web-3\nft-marketplace-dapp\backend

# Run Hardhat node in background with nohup
nohup npx hardhat node > hardhat-node.log 2>&1 &

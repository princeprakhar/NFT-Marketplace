// // scripts/deploy.js
// const hre = require("hardhat");

// async function main() {
//   // Deploy NFT Collection Contract
//   const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
//   const nftCollection = await NFTCollection.deploy(
//     "My NFT Collection",
//     "MNFT",
//     "ipfs://"
//   );
//   await nftCollection.deployed();
//   console.log("NFTCollection deployed to:", nftCollection.address);

//   // Deploy NFT Marketplace Contract
//   const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
//   const nftMarketplace = await NFTMarketplace.deploy();
//   await nftMarketplace.deployed();
//   console.log("NFTMarketplace deployed to:", nftMarketplace.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });



// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // Deploy NFT Collection Contract
  const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
  const nftCollection = await NFTCollection.deploy(
    "My NFT Collection",
    "MNFT",
    "ipfs://"
  );
  
  // Wait for deployment to complete
  await nftCollection.waitForDeployment();
  console.log("NFTCollection deployed to:", await nftCollection.getAddress());

  // Deploy NFT Marketplace Contract
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  
  // Wait for deployment to complete
  await nftMarketplace.waitForDeployment();
  console.log("NFTMarketplace deployed to:", await nftMarketplace.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Blog = await hre.ethers.getContractFactory("Blog");
  const blog = await Blog.deploy("My first blog on web3 <3");

  await blog.deployed();
  console.log("Address of deployed contract:", blog.address);

  fs.writeFileSync(
    "./config.js",
    `
    export const CONTRACT_ADDRESS = '${blog.address}';
    export const OWNER_ADDRESS = '${blog.signer.address}';
  `
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

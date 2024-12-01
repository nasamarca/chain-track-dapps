const { ethers } = require("hardhat");

async function main() {
  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Get contract factories
  const ChainTrack = await ethers.getContractFactory("ChainTrack");

  // Estimate gas
  const deploymentGas = await ethers.provider.estimateGas(
    ChainTrack.getDeployTransaction("Nads", "pbacohort2@gmail.com")
  );
  const gasPrice = await ethers.provider.getGasPrice();
  const estimatedCost = deploymentGas.mul(gasPrice);

  console.log("Estimated gas needed:", deploymentGas.toString());
  console.log("Current gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
  console.log("Estimated deployment cost:", ethers.utils.formatEther(estimatedCost), "ETH");

  // Deploy contract
  const pharmaChainTrack = await ChainTrack.deploy("Nads", "pbacohort2@gmail.com");
  await pharmaChainTrack.deployed();

  console.log("ChainTrack deployed to:", pharmaChainTrack.address);
  console.log("Actual gas used:", (await pharmaChainTrack.deployTransaction.wait()).gasUsed.toString());
  console.log("Sleeping.....");

  await sleep(10000);

  // Verify contract
  await hre.run("verify:verify", {
    contract: "contracts/ChainTrack.sol:ChainTrack",
    address: pharmaChainTrack.address,
    constructorArguments: ["Nads", "pbacohort2@gmail.com"],
  });
  console.log("Verified ChainTrack");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const developmentChains = ["localhost", "hardhat"];
const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.chainId;
  const contract = await deploy("TicketMaster", {
    from: deployer,
    log: true,
    args: ["Ticketmaster", "TM"],
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  let address = contract.address;
  if (!developmentChains.includes(network.name)) {
    await verify(address, ["TicketMaster","TM"]);
  }
};
module.exports.tags = [];

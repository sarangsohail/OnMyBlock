const EscrowFactory = artifacts.require("EscrowFactory");

module.exports = function(deployer) {
  // Deploy EscrowFactory contract
  deployer.deploy(EscrowFactory, myAddress, feeWalletAddress);
};

var SolidityContract = artifacts.require("Escrow");

module.exports = function(deployer) {
  // Deploy the SolidityContract contract as our only task
  deployer.deploy(Escrow);
};

const Escrow = artifacts.require("Escrow");

module.exports = function(deployer) {
  deployer.deploy(
    Escrow,
    feeWalletAddress,
    duration,
    amount,
    title,
    buyerAddress,
    sellerAddress,
    feePercent,
    handlers
  );
};

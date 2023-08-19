// EscrowFactory.test.js

let factory;
let escrow;

const MAX_ESCROWS = 10;

beforeEach(async () => {

  factory = await Factory.deploy();

  escrow = await factory.createEscrow(
    buyer.address,
    seller.address, 
    feeWallet, 
    ethers.utils.parseEther('1.0'),
    5, // 5%
    60 * 60 * 24 // 1 day
  );

})


it('increments escrow count', async () => {

  const initialCount = await factory.escrowCount(); // 0

  await factory.createEscrow(
    buyer.address, 
    seller.address,
    feeWallet,
    ethers.utils.parseEther('1.0'),
    5, 
    60 * 60 * 24
  );

  const newCount = await factory.escrowCount(); // 1

  expect(newCount).to.equal(initialCount + 1);

});


it('cannot create escrow over limit', async () => {

  // Create 10 escrows
  for(let i = 0; i < MAX_ESCROWS; i++) {
    await factory.createEscrow(
      buyer.address,
      seller.address,  
      feeWallet,
      ethers.utils.parseEther('1.0'),
      5,
      60 * 60 * 24
    );
  }

  await expect(
    factory.createEscrow(
      buyer.address,
      seller.address,  
      feeWallet,
      ethers.utils.parseEther('1.0'), 
      5,
      60 * 60 * 24
    )
  ).to.be.revertedWith('Escrow limit reached');

});

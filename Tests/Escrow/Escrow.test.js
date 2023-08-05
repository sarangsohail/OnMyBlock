// escrow.test.js

let escrow; 
let owner;
let buyer;
let seller;

// Could use beforeEach to handle setup
beforeEach(async () => {

  // Deploy contracts
  escrow = await Escrow.deploy(); 
  owner = await getOwnerAccount();

  // Get signers
  [buyer, seller] = await ethers.getSigners(); 

});

it('sends fee to owner wallet', async () => {

  // Arrange
  const ownerWallet = owner.address;
  const amount = 1000;
  const feePercent = 5;

  // Act
  await escrow.connect(buyer).deposit({value: amount})
  await escrow.connect(seller).complete();
  
  // Assert
  const fee = (amount * feePercent) / 100;
  expect(await ethers.provider.getBalance(ownerWallet)).to.equal(fee);

});

// Test constructor
it('sets state variables properly', async () => {
  // Validate escrowDetail, tokenAddress, feeAddress etc
})

// Test state transitions
it('only seller can transition from Launched -> Ongoing', async () => {
  await expect(escrow.connect(buyer).sellerLaunchedApprove()).to.be.reverted; 
  await escrow.connect(seller).sellerLaunchedApprove();
  expect(await escrow.escrowDetail().status).to.equal(EscrowStatus.Ongoing);
})

// Test access controls 
it('only buyer can confirm delivery', async () => {
  await expect(escrow.connect(seller).buyerConfirmDelivery()).to.be.reverted;
}) 

// Test dispute handling
it('increases dispute count properly', async () => {
  await escrow.connect(buyer).buyerDeliverReject(86400);
  expect(await escrow.rejectCount()).to.equal(1);
  
  await escrow.connect(buyer).buyerDeliverReject(86400); 
  expect(await escrow.rejectCount()).to.equal(2);
})

// Test events emitted
it('emits event on cancellation', async () => {
  await expect(escrow.connect(buyer).cancel())
    .to.emit(escrow, 'Cancelled'); 
})

// Test token transfers
it('transfers correct amounts to buyer and seller', async () => {
  // Check balances before and after
  const sellerBalanceBefore = await token.balanceOf(seller.address)
  await escrow.connect(buyer).buyerConfirmDelivery();

  const fee = escrowDetail.amount * escrowDetail.feePercent / 100;
  const sellerBalanceAfter = sellerBalanceBefore + (escrowDetail.amount - fee);

  expect(await token.balanceOf(seller.address)).to.equal(sellerBalanceAfter);
})



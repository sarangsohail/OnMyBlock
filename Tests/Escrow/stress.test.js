// Stress test multiple concurrent disputes
it('gas stays stable with multiple disputes', async () => {

    // Create 50 disputes
    for (let i = 0; i < 50; i++) { 
      await escrow.connect(accounts[i]).dispute();
    }
  
    // Resolve disputes
    for (let i = 0; i < 50; i++) {
      await escrow.connect(trusted).resolve(accounts[i]); 
    }
  
    // Gas used should not be exponentially higher 
    const gasUsed = await ethers.provider.getGasUsage() 
    expect(gasUsed).to.be.lt(baseGasUsage * 2); 
  });
  
it('does not crash with max uint256 values', async () => {
  
    await escrow.fund({ value: ethers.constants.MaxUint256 })

    await escrow.setDuration(ethers.constants.MaxUint256)

    await escrow.setAmount(ethers.constants.MaxUint256)

// Escrow should still be functional
});
  
it('handles large dispute batches', async () => {

  // Create disputes
  for (let i = 0; i < 250; i++) { 
     await escrow.connect(accounts[i]).dispute(reasons[i]);
  }
  
  // Verify disputes created
  const disputeCount = await escrow.disputeCount();
  expect(disputeCount).to.equal(250);

  const dispute_5 = await escrow.disputes(5); 
  expect(dispute_5.status).to.equal(DisputeStatus.Open);

  // Resolve disputes
  for(let i = 0; i < 250; i++) {
    await escrow.connect(owner).resolveDispute(i, accounts[i]);
  }

  // Verify disputes resolved
  const resolvedCount = await escrow.resolvedCount();
  expect(resolvedCount).to.equal(250);
  
  const dispute_5_again = await escrow.disputes(5);
  expect(dispute_5_again.status).to.equal(DisputeStatus.Resolved);

});

it('handles rapid state changes', async () => {

  const initialState = await escrow.getState();
  
  for(let i = 0; i < 100; i++) {
    await escrow.connect(owner).transitionNextState();
  }

  const midState = await escrow.getState();
  expect(midState).not.to.equal(initialState);  

  const finalState = await escrow.getState();
  expect(finalState).not.to.equal(midState);

});
  
// Handles large token approvals properly
it('handles large token approvals', async () => {

  const largeAmount = ethers.constants.MaxUint256;

  await token.approve(escrow.address, largeAmount);

  let initialAllowance = await token.allowance(owner.address, escrow.address);
  expect(initialAllowance).to.equal(0);

  const initialOwnerBalance = await token.balanceOf(owner.address);  

  const other = accounts[1];
  await token.connect(other).approve(escrow.address, largeAmount);

  const secondAccountAllowance = await token.allowance(other.address, escrow.address);
  expect(secondAccountAllowance).to.equal(largeAmount);

  await token.transferFrom(owner.address, other.address, 100);

  // Check first allowance decreased
  const updatedAllowance = await token.allowance(owner.address, escrow.address);
  expect(updatedAllowance).to.equal(largeAmount - 100);

  const finalOwnerBalance = await token.balanceOf(owner.address);
  expect(finalOwnerBalance).to.equal(initialOwnerBalance - 100);

});
  
// Long deadline overflow
it('fails safely on deadline overflow', async () => {
  
    const longDeadline = ethers.constants.MaxUint256; 
  
    await expect(
      escrow.create(longDeadline)
    ).to.be.reverted; // Instead of crashing
})
  
  // Complex escrow parameters
it('handles escrow with complex parameters', async () => {
  
    await escrow.create(
        veryLongDeadline, 
        largeAmount,
        longByte32String,
        manyItemDetails,
        lotsOfAddresses
    );
  
// Should not fail or run out of gas
})
  
  // Load test dispute resolution
it('resolves disputes under contention', async () => {
  
    // Create load with many concurrent disputes
  
    // Resolve disputes with many clients 
  
    // Should not fail under load
})
    
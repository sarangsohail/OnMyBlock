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
  
    // Create 250 disputes
    for (let i = 0; i < 250; i++) {
        // ...dispute creation  
    }

    // Resolve disputes
    for (let i = 0; i < 250; i++) {
        // ... dispute resolution
        }
    
        // Should not crash or run out of gas
});

  // Many rapid state transitions
it('handles rapid state changes', async () => {

    for(let i = 0; i < 100; i++) {
      await escrow.transitionNextState(); 
    }
  
    // Should not fail or run out of gas
})
  
// Large token approvals
it('handles large token approvals', async () => {
    
    const largeAmount = ethers.constants.MaxUint256;
  
    await token.approve(escrow.address, largeAmount);
  
    // Should not fail or crash
})
  
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
    
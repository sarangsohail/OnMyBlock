  
  it('does not allow reentrancy', async () => {
    
    const maliciousContract = await MaliciousContract.deploy(factory.address);
  
    await expect(
      maliciousContract.attack()
    ).to.be.revertedWith('No reentrancy');
  
  });

  it('owner cannot withdraw all funds', async () => {
    await expect(
      factory.connect(owner).drainFunds()
    ).to.be.reverted;
  });

  it('reverts with invalid duration', async () => {

    await expect(
      factory.createEscrow(0)
    ).to.be.revertedWith('Invalid duration');
    
    await expect(  
      factory.createEscrow(-1)
    ).to.be.revertedWith('Invalid duration');
  
    await expect(
      factory.createEscrow(3600) // 1 hour
    ).to.be.revertedWith('Invalid duration');
  
  });
  
  it('reverts with long names', async () => {
    await expect(
      factory.createEscrow(veryLongString)
    ).to.be.reverted; 
  });

  it('non-trusted cannot create escrow', async () => {

    const randomUser = accounts[9];
  
    await expect(
      factory.connect(randomUser).createEscrow(
        buyer,
        seller,
        feeWallet,
        amount,
        feePercent, 
        duration
      )
    ).to.be.reverted;
  
  });
  
  it('non-trusted cannot withdraw', async () => {
    await expect( 
      factory.connect(randomUser).withdraw(...)
    ).to.be.reverted;
  });
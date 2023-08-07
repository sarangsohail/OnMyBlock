it('completes end-to-end escrow workflow', async () => {

    // Deploy factory & escrow
    const escrow = await factory.createEscrow(
        buyer,
        seller,
        feeWallet, // wallet address 
        amount,
        feePercent,
        duration  
      );
        
    // Buyer funds escrow
    await escrow.connect(buyer).fund({value: amount});
  
    // Seller approves  
    await escrow.connect(seller).approve();
  
    // Seller delivers
    await escrow.connect(seller).deliver();
  
    // Buyer completes  
    await escrow.connect(buyer).complete();
  
    // Escrow should be completed
    expect(await escrow.status()).to.equal(COMPLETE);
  
  });
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


    // escrowFactory.test.js

    let factory;
    let escrow;
    let buyer, seller; 

    beforeEach(async () => {

    [buyer, seller] = await ethers.getSigners();
    
    factory = await Factory.deploy();

    escrow = await factory.createEscrow(
        buyer.address, 
        seller.address,
        feeWallet,
        amount,
        feePercent,
        duration
    );

    });


    it('handles buyer cancellation properly', async () => {

    await escrow.connect(buyer).fund({value: amount});

    await expect(escrow.connect(buyer).cancel())
        .to.emit(escrow, 'Cancelled');

    expect(await escrow.status()).to.equal(CANCELLED);

    });


    it('completes after seller re-delivery', async () => {

    await expect(escrow.connect(seller).deliver())
        .to.emit(escrow, 'Delivered');

      // Assert delivered


    await expect(escrow.connect(buyer).complete())
        .to.emit(escrow, 'Completed');

      // Assert redelivered


    expect(await escrow.status()).to.equal(COMPLETE);

    // Assert completed


    });
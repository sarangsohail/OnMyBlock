// Seller re-delivery after rejection
it('allows seller re-delivery after rejection', async () => {
    await escrow.connect(seller).sellerDeliver();
    await escrow.connect(buyer).buyerDeliverReject(86400); 
    await escrow.connect(seller).sellerApproveDeliverReject();
    await escrow.connect(seller).sellerDeliver();
    await escrow.connect(buyer).buyerConfirmDelivery();
  
    expect(await escrow.getStatus()).to.equal(EscrowStatus.Complete);
  });
  
  // Dispute resolution by trusted party 
  it('allows trusted party to resolve dispute', async () => {
    await escrow.connect(buyer).buyerDeliverReject(86400);
    await escrow.connect(seller).sellerRejectDeliverReject();
  
    await escrow.connect(trustedParty).fund(seller.address);
    
    expect(await escrow.getStatus()).to.equal(EscrowStatus.Complete);
  });
  
  // Cannot transition from lower -> higher state
  it('cannot transition from lower to higher state', async () => {
    await expect(
      escrow.connect(seller).buyerConfirmDelivery()
    ).to.be.revertedWith('Not in delivered status');
  });
  
  // Emits events properly
  it('emits Cancelled event on cancellation', async () => {
    await expect(escrow.connect(buyer).cancel())
      .to.emit(escrow, 'Cancelled');
  }); 

  
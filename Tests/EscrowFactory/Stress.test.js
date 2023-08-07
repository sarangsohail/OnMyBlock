it('creates escrows under contention', async () => {

  // Create escrows in parallel from different accounts
  for(let i = 0; i < 10; i++) {
    const task = factory.connect(accounts[i]).createEscrow({...}); 
    tasks.push(task);
  }

  await Promise.all(tasks);

  // All escrows should have been created  
});


it('creates escrows under contention', async () => {

    // Increase iterations
    for(let i = 0; i < 50; i++) { 
    
      const task = factory.connect(accounts[i]).createEscrow({
        // params  
      });
      
      tasks.push(task);
  
    }
  
    await Promise.all(tasks);
  
    // Validate escrows
    for(let i = 0; i < tasks.length; i++) {
      expect(tasks[i]).to.not.equal(ZERO_ADDRESS);
    }
  
    const total = await factory.escrowCount();
    expect(total).to.equal(tasks.length);
  
  });
  

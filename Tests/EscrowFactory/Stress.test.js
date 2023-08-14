// Creates multiple escrows in parallel 
it('creates multiple escrows in parallel', async () => {

  const tasks = [];

  for(let i = 0; i < 10; i++) {

    const task = factory.connect(accounts[i]).createEscrow({
      // params 
    });
    
    tasks.push(task);
  }

  const results = await Promise.all(tasks);

  for(let i = 0; i < results.length; i++) {
    // Check for Created event
    await expect(results[i])
      .to.emit(factory, 'Created')
      .withArgs(accounts[i], i); 
  }

  // Spot check escrow state
  const escrow5 = await Escrow.attach(results[5]); 
  expect(await escrow5.seller()).to.equal(accounts[5]);

});

// Deploys escrows concurrently from different accounts
it('deploys escrows concurrently', async () => {

  const tasks = [];

  // Increase iterations
  for(let i = 0; i < 50; i++) {

    const task = factory.connect(accounts[i]).createEscrow({
       // params
    });
    
    tasks.push(task);

  }

  const results = await Promise.all(tasks);

  // Check total escrow count
  const total = await factory.escrowCount();
  expect(total).to.equal(tasks.length);

  // Check escrow ids are sequential
  const escrowId = await factory.getEscrowId(results[10]);
  expect(escrowId).to.equal(10);

});
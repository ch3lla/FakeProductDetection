const FakeProductDetectionSystem = artifacts.require("../contracts/FakeProductDetection.sol");

contract('FakeProductDetectionSystem', (accounts) => {
    let fakeProductInstance;
    let serialNumber

    // Before the test, deploy a new instance of the FakeProductDetectionSystem contract
    before(async () => {
        fakeProductInstance = await FakeProductDetectionSystem.deployed();
    });

    // Test case for register function
    it('should register a product', async () => {
        serialNumber = web3.utils.padRight(web3.utils.asciiToHex("12345"), 64);
        const prodDate = Math.floor(Date.now() / 1000);
        const prodName = "Test Product";

        const receipt = await fakeProductInstance.registerProduct(serialNumber, prodDate, prodName, { from: accounts[0] });

        assert.equal(receipt.logs[0].event, "ProductRegistered", "ProductRegistered event should be emitted");

        const numberOfProducts = await fakeProductInstance.numberOfProducts();
        assert.equal(numberOfProducts.toNumber(), 1, "Product list should have one product");

        const product = await fakeProductInstance.productsList(0);
        assert.equal(product.serialNumber, serialNumber, "Serial number should match");
        assert.equal(product.name, prodName, "Product name should match");
        assert.equal(product.manufacturer, accounts[0], "Manufacturer should match");
        assert.equal(product.isGenuine, true, "Product should be genuine");
    });

    // Test case for fake products
    it('should correctly mark a product as counterfeit and verify its status', async () => {
        let initialVerification = await fakeProductInstance.verifyProduct(serialNumber, { from: accounts[0] });
        assert.equal(initialVerification, true, "Product should initially be genuine");
    
        await fakeProductInstance.markProductAsCounterfeit(serialNumber, { from: accounts[0] });
    
        let finalVerification = await fakeProductInstance.verifyProduct(serialNumber, { from: accounts[0] });
        assert.equal(finalVerification, false, "Product should be marked as counterfeit");
    });
    

    // Test case for product expiry date 
    it('should create an expiry date for a product and verify the exipry status', async () => {
        let initialVerification = await fakeProductInstance.isProductExpired(serialNumber, { from: accounts[0] });
        assert.equal(initialVerification, false, "Product should not be expired initially");

        const date = new Date("2024-08-14T00:00:00Z");
        const timestamp = Math.floor(date.getTime() / 1000);
    
        await fakeProductInstance.setProductExpiry(serialNumber, timestamp, { from: accounts[0] });
    
        let finalVerification = await fakeProductInstance.isProductExpired(serialNumber, { from: accounts[0] });
        assert.equal(finalVerification, true, "Product should be expired");
    });


    // Test case for locked products
    it('should check if a product is locked, lock it and check its status then unlock it again', async () => {
        let initialVerification = await fakeProductInstance.checkIfProductIsLocked(serialNumber, { from: accounts[0] });
        assert.equal(initialVerification, false, "Product should not be locked initially");
    
        await fakeProductInstance.lockProduct(serialNumber, { from: accounts[0] });
    
        let secondVerification = await fakeProductInstance.checkIfProductIsLocked(serialNumber, { from: accounts[0] });
        assert.equal(secondVerification, true, "Product should be locked");

        await fakeProductInstance.unlockProduct(serialNumber, { from: accounts[0] });
    
        let finalVerification = await fakeProductInstance.checkIfProductIsLocked(serialNumber, { from: accounts[0] });
        assert.equal(finalVerification, false, "Product should be unlocked");
    })
});

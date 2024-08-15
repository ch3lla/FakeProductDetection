// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.18;

contract FakeProductDetection {
    address public owner;
    bool public paused = false; // pause and resume contracts

    struct Product {
        bytes32 id;
        bytes32 serialNumber;
        string name;
        address manufacturer;
        uint256 productionDate;
        bool isGenuine;
    }

    mapping(bytes32 => uint256) private productIndices; // Maps serial number to index in productsList
    mapping(bytes32 => uint256) public productExpiryDates;
    mapping(bytes32 => bool) public lockedProducts; // for emergency product lockdown
    Product[] public productsList;
    

    event ProductRegistered(bytes32 serialNumber, address manufacturer);
    event ProductVerified(bytes32 serialNumber, bool isGenuine);
    event ProductUpdated(bytes32 serialNumber, string name);
    event ProductDeleted(bytes32 serialNumber);
    event OwnershipTransfered(address oldOwner, address newOwner);

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can asscess this function");
        _;
    }

    modifier isProductLocked(bytes32 _serialNumber){
        require(!lockedProducts[_serialNumber], "This product is currently unavailable.");
        _;
    }

    modifier productExists(bytes32 _serialNumber){
        uint256 index = productIndices[_serialNumber];
        require(index > 0, "Product not found");
        _;
    }

    function registerProduct(bytes32 _serialNumber, uint256 _prodDate, string memory _prodName) external {
        require(productIndices[_serialNumber] == 0, "Product has been registered.");

        // Generate a unique ID using keccak256 hash
        bytes32 productId = keccak256(abi.encodePacked(_serialNumber, _prodName, msg.sender, _prodDate));
        
        Product memory newProduct = Product({
            id: productId,
            serialNumber: _serialNumber,
            name: _prodName,
            manufacturer: msg.sender,
            productionDate: _prodDate,
            isGenuine: true
        });

        productsList.push(newProduct);
        productIndices[_serialNumber] = productsList.length;


        emit ProductRegistered(_serialNumber, msg.sender);
    }

    function viewProducts () public view returns (Product[] memory) {
        return productsList;
    }

    function viewProduct (bytes32 _serialNumber) public view productExists(_serialNumber) returns (Product memory)  {
        return productsList[productIndices[_serialNumber] - 1];
    }
    
    function verifyProduct(bytes32 _serialNumber) external productExists(_serialNumber) view returns(bool) {
        return productsList[productIndices[_serialNumber] - 1].isGenuine;
    }

    function updateProduct(bytes32 _serialNumber, string memory _prodName) external onlyOwner productExists(_serialNumber) {
        require(bytes(_prodName).length > 0, "Product Title must not be empty");

        productsList[productIndices[_serialNumber] - 1].name = _prodName;
        emit ProductUpdated(_serialNumber, _prodName);
    }

    function markProductAsCounterfeit(bytes32 _serialNumber) external productExists(_serialNumber){
        productsList[productIndices[_serialNumber] - 1].isGenuine = false;
    }

    function removeProduct(bytes32 _serialNumber) external onlyOwner productExists(_serialNumber) {

        // move last element to index of product to be removed
        Product memory lastProduct = productsList[productsList.length - 1];
        productsList[productIndices[_serialNumber] - 1] = lastProduct;
        productIndices[lastProduct.serialNumber] = productIndices[_serialNumber];

        // remove last element
        productsList.pop();
        delete productIndices[_serialNumber];

        emit ProductDeleted(_serialNumber);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "This is the zero address.");
        owner = _newOwner;
        emit OwnershipTransfered(msg.sender, _newOwner);
    }

    function setProductExpiry(bytes32 _serialNumber, uint256 _expiryDate) external onlyOwner productExists(_serialNumber) {
        productExpiryDates[_serialNumber] = _expiryDate;
    }

    function isProductExpired(bytes32 _serialNumber) public view returns (bool) {
        uint256 expiryDate = productExpiryDates[_serialNumber];
        return expiryDate != 0 && block.timestamp > expiryDate;
    }

    function lockProduct(bytes32 _serialNumber) external onlyOwner productExists(_serialNumber) {
        lockedProducts[_serialNumber] = true;
    }

    function unlockProduct(bytes32 _serialNumber) external onlyOwner{
        require(lockedProducts[_serialNumber], "This product is not locked.");
        lockedProducts[_serialNumber] = false;
    }

    function checkIfProductIsLocked(bytes32 _serialNumber) public view returns (bool) {
        return lockedProducts[_serialNumber];
    }

    function numberOfProducts() public view returns (uint256) {
        return productsList.length;
    }
}
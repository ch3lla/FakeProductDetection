import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';
import QRCode from 'qrcode';
import { Web3Context } from '../contexts/Web3Context';
import { getContractInstance } from '../utils/contractInstance';

const AddProduct = ({ onAddProduct }) => {
  const { signer } = useContext(Web3Context);
  const [serialNumber, setSerialNumber] = useState('');
  const [prodDate, setProdDate] = useState('');
  const [prodName, setProdName] = useState('');
  const [qrCodeHash, setQrCodeHash] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [isConfirmed, setConfirmed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signer) {
      alert('Please connect to MetaMask');
      return;
    }

    try {
      const qrCodeData = `${serialNumber}-${prodName}-${prodDate}`;
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
      const qrCodeHash = ethers.keccak256(ethers.toUtf8Bytes(qrCodeData));

      setQrCodeImage(qrCodeUrl); // Store QR code image for display
      setQrCodeHash(qrCodeHash); // Store QR code hash for smart contract

      const contract = getContractInstance(signer);

      console.log("con - ", contract);
      const serialNumberBytes = ethers.formatBytes32String(serialNumber);
      const prodDateTimestamp = Math.floor(new Date(prodDate).getTime() / 1000);

      const tx = await contract.registerProduct(
        serialNumberBytes,
        prodDateTimestamp,
        prodName,
        qrCodeHash
      );

      await tx.wait();
      alert('Product added successfully!');
      setConfirmed(true);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Check console for details.');
    }
  };

  return (
    <div className="add-product-container">
      <form onSubmit={handleSubmit} className="add-product-form">
        <h2>Add Product</h2>
        
        <label htmlFor="serialNumber">Serial Number:</label>
        <input
          type="text"
          id="serialNumber"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          required
        />

        <label htmlFor="prodDate">Production Date:</label>
        <input
          type="date"
          id="prodDate"
          value={prodDate}
          onChange={(e) => setProdDate(e.target.value)}
          required
        />

        <label htmlFor="prodName">Product Name:</label>
        <input
          type="text"
          id="prodName"
          value={prodName}
          onChange={(e) => setProdName(e.target.value)}
          required
        />

        {isConfirmed && (
          <>
            <label htmlFor="qrCodeHash">QR Code Hash (Auto-Generated):</label>
            <input
              type="text"
              id="qrCodeHash"
              value={qrCodeHash}
              readOnly
              required
            />
          </>
        )}

        <button type="submit" className="submit-btn">Add Product</button>
      </form>

      {qrCodeImage && (
        <div className="qr-code-container">
          <h3>QR Code:</h3>
          <img src={qrCodeImage} alt="Product QR Code" />
        </div>
      )}
    </div>
  );
};

export default AddProduct;
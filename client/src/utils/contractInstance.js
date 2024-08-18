import { ethers } from 'ethers';
import ProductContract from '../contracts/FakeProductDetection.json';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export const getContractInstance = (signer) => {
  return new ethers.Contract(contractAddress, ProductContract.abi, signer);
};
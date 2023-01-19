import axios from 'axios';
import { pki } from 'node-forge';
const url = 'http://localhost:5001/';

export const genKeys = () => {
  const keys = pki.rsa.generateKeyPair(256);
  const publicKey = pki.publicKeyToPem(keys.publicKey);
  const privateKey = pki.privateKeyToPem(keys.privateKey);
  return { publicKey, privateKey };
};

export const getPublicKey = userEmail => {
  return axios.post(`${url}pubkey`, {
    user: userEmail,
  });
};

export const encrypt = (message, publicKey) => {
  return pki.publicKeyFromPem(publicKey.trim()).encrypt(message);
};

export const decrypt = message => {
  return pki
    .privateKeyFromPem(localStorage.getItem('privateKey'))
    .decrypt(message);
};

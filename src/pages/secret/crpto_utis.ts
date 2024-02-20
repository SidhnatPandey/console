
import crypto from "crypto";
const nacl = require("tweetnacl");
nacl.util = require("tweetnacl-util");


/**
 * Encrypts data using AES-256-GCM symmetric encryption.
 * @param {Buffer} data - Data to encrypt.
 * @param {Buffer} key - Encryption key.
 * @param {Buffer} iv - Initialization vector.
 * @returns {Promise<{ encryptedData: Buffer, authTag: Buffer }>} - Encrypted data and authentication tag.
 */
export function encryptAESGCM(
  data: Buffer,
  key: Buffer,
  iv: Buffer
): Promise<{ encryptedData: Buffer; authTag: Buffer }> {
  return new Promise((resolve, reject) => {
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    let encrypted: Buffer;
    try {
      encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
      const authTag = cipher.getAuthTag();
      resolve({ encryptedData: encrypted, authTag: authTag });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Decrypts data using AES-256-GCM symmetric encryption.
 * @param {Buffer} encryptedData - Encrypted data to decrypt.
 * @param {Buffer} key - Decryption key.
 * @param {Buffer} iv - Initialization vector.
 * @param {Buffer} authTag - Authentication tag.
 * @returns {Promise<Buffer>} - Decrypted data.
 */
export function decryptAESGCM(
  encryptedData: Buffer,
  key: Buffer,
  iv: Buffer,
  authTag: Buffer
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    resolve(decrypted);
  });
}



/**
 * Generate a random public-private key pair.
 * @returns {Promise<{ publicKey: string, privateKey: string }>} - Promise resolving to an object containing the base64-encoded public and private keys.
 */
export function generateKeyPair() {
  return new Promise((resolve, reject) => {
    try {
      const keyPair = nacl.box.keyPair();
      const publicKey =  nacl.util.encodeBase64(keyPair.publicKey);
      const privateKey = nacl.util.encodeBase64(keyPair.secretKey);
      
      resolve({ publicKey, privateKey });
    } catch (error) {
      reject(error);
    }
  });
}


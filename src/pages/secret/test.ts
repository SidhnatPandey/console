import crypto from "crypto";
import { deriveKeyFromOrganisation } from "./encryption_decryption";
import { encryptAESGCM } from "./crpto_utis";
const nacl = require("tweetnacl");
nacl.util = require("tweetnacl-util");

/**
 * Generate a random public-private key pair.
 * @returns {Promise<{ publicKey: string, privateKey: string }>} - Promise resolving to an object containing the base64-encoded public and private keys.
 */
function generateKeyPair() {
  return new Promise((resolve, reject) => {
    try {
      const keyPair = nacl.box.keyPair();
      const publicKey = nacl.util.encodeBase64(keyPair.publicKey);
      const privateKey = nacl.util.encodeBase64(keyPair.secretKey);
      resolve({ publicKey, privateKey });
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Generate a random key pair and encrypt the private key with the derived organization key.
 * @param {string} orgid - Organization ID used for key derivation.
 * @returns {Promise<{
 *   encryptedpublicKey: string;
 *   encryptedPrivateKey: string;
 *   encryptedTag: string;
 *   encryptediv: string;
 *   encrptedsalt: string;
 *   orgid: string;
 * }>} - Promise resolving to an object containing the encrypted public and private keys, along with other encryption parameters.
 */
export function generateEncryptedKeys(orgid: string): Promise<{
  encryptedpublicKey: string;
  encryptedPrivateKey: string;
  encryptedTag: string;
  encryptediv: string;
  encrptedsalt: string;
  orgid: string;
}> {
  return new Promise((resolve, reject) => {
    const iv = crypto.randomBytes(12); // Generate IV
    let publicKey: string, privateKey: string, orgKey: string, salt: Buffer;

    salt = crypto.randomBytes(16); // Generate salt for key derivation

    deriveKeyFromOrganisation(orgid, salt)
      .then((derivedKey) => {
        orgKey = derivedKey.key.toString("hex");
        // Generate NaCl key pair
        return generateKeyPair() as Promise<{ publicKey: string; privateKey: string }>; // Specify the return type
      })
      .then((keyPair) => {
        publicKey = keyPair.publicKey;
        privateKey = keyPair.privateKey;
        // Encrypt private key using the derived key and IV
        return encryptAESGCM(
          Buffer.from(privateKey, "base64"), // Assuming the private key is base64 encoded
          Buffer.from(orgKey, "hex"),
          iv
        );
      })
      .then(({ encryptedData, authTag }) => {
        resolve({
          encryptedpublicKey: btoa(publicKey),
          encryptediv: iv.toString("hex"),
          encrptedsalt: salt.toString("hex"),
          encryptedPrivateKey: encryptedData.toString("hex"),
          encryptedTag: authTag.toString("hex"),
          orgid,
        });
      })
      .catch((err) => {
        console.error("Error generating encrypted keys:", err);
        reject(err); // Reject the promise if there's an error
      });
  });
}
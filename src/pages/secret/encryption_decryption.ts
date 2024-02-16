import crypto from "crypto";
import {
  decryptAESGCM,
  encryptAESGCM,
  generateKeyPair,
} from "./crpto_utis";

const nacl = require("tweetnacl");
nacl.util = require("tweetnacl-util");

//--------------------------------------Derived Key from Organisation----------------------------------------------//

/**
 * Derive a cryptographic key from an organization using PBKDF2.
 * @param {string} organizationid - Organization to derive the key from.
 * @param {Buffer} salt - Salt value for key derivation.
 * @param {number} keyLength - Length of the derived key in bytes.
 * @param {number} iterations - Number of iterations for key derivation.
 * @param {string} digest - Digest algorithm for key derivation.
 * @returns {Promise<{ key: Buffer, salt: Buffer }>} - Derived cryptographic key and salt.
 */
export function deriveKeyFromOrganisation(
  organizationid: string,
  salt: Buffer,
  keyLength: number = 32,
  iterations: number = 169696,
  digest: string = "sha512"
): Promise<{ key: Buffer }> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      organizationid,
      salt,
      iterations,
      keyLength,
      digest,
      (err, key) => {
        if (err) {
          reject(err);
        } else {
          resolve({ key });
        }
      }
    );
  });
}

//---------------------------------------------------------Generate Encrypted Keys--------------------------------------------------------//
//-------------------------------------------------------on Organisation Creation--------------------------------------------------------//

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
        return generateKeyPair() as Promise<{
          publicKey: string;
          privateKey: string;
        }>; // Specify the return type
      })
      .then((keyPair) => {
        publicKey = keyPair.publicKey;
        privateKey = keyPair.privateKey;
        // Encrypt private key using the derived key and IV
        return encryptAESGCM(
          Buffer.from(privateKey, "utf8"),
          Buffer.from(orgKey, "hex"),
          iv
        );
      })
      .then(({ encryptedData, authTag }) => {
        resolve({
          encryptedpublicKey: publicKey,
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

//------------------------------------------------------Decrypt Private Key-------------------------------------------------------------//
//-------------------------------------------------------on User Login admin only --------------------------------------------------------//
/**
 * Decrypts the private key using the derived key, IV, and authTag. This function is called when the user (a) logs in.
 * @param {string} orgid - Organisation ID.
 * @param {Buffer} salt - Salt value for key derivation.
 * @param {Buffer} encryptedData - Encrypted private key.
 * @param {Buffer} iv - Initialization vector.
 * @param {Buffer} authTag - Authentication tag.
 * @returns {Promise<{ privateKey: string; orgKey: string; }>} - Decrypted private key and organization key.
 */
export function decryptPrivateKey(
  orgid: string,
  salt: string,
  encryptedData: string,
  iv: string,
  authTag: string
): Promise<{ privateKey: string; orgKey: string }> {
  return new Promise((resolve, reject) => {
    // Derive key from organization
    const Salt = Buffer.from(salt, "hex");

    deriveKeyFromOrganisation(orgid, Salt)
      .then((derivedKey) => {
        const orgKey = derivedKey.key;
        // Now decrypt the private key using the derived key, iv, and authTag
        const IV = Buffer.from(iv, "hex");
        const AuthTag = Buffer.from(authTag, "hex");
        const EncryptedData = Buffer.from(encryptedData, "hex");
        decryptAESGCM(EncryptedData, orgKey, IV, AuthTag)
          .then((decryptedData) => {
            const decryptedPrivateKey = decryptedData.toString("utf8");
            resolve({
              privateKey: decryptedPrivateKey,
              orgKey: orgKey.toString("hex"),
            }); // Resolve with decrypted private key and orgKey
          })
          .catch((err) => {
            console.error("Error decrypting data:", err);
            reject(err); // Reject with error if decryption fails
          });
      })
      .catch((err) => {
        console.error("Error deriving key:", err);
        reject(err); // Reject with error if key derivation fails
      });
  });
}

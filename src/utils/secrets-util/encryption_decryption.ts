import crypto from "crypto";
import { decryptAESGCM, encryptAESGCM, generateKeyPair } from "./crpto_utis";


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
  keyLength   = 32,
  iterations = 169696,
  digest = "sha512"
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
    let publicKey: string, privateKey: string, orgKey: string;
    

   const  salt = crypto.randomBytes(16); // Generate salt for key derivation

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
          Buffer.from(privateKey, "base64"),
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
            const decryptedPrivateKey = decryptedData.toString("base64");
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

//*
// * Encrypts a key-value pair using AES 256 GCM.
// * @param {string} privateKey - Private key for encryption.
// * @param {string} key - Key to encrypt.
// * @param {string} value - Value to encrypt.
// * @returns {Promise<{
// *   encrypted_key_iv: string;
// *   encrypted_value_iv: string;
// *   encrypted_key_tag: string;
// *   encrypted_value_tag: string;
// *   encrypted_key_ciphertext: string;
// *   encrypted_value_ciphertext: string;
// * }>} - Promise resolving to an object containing the encrypted key and value.
export function encryptKey(
  privateKey: string,
  key: string,
  value: string,
  environment: string
): Promise<{
  encrypted_key_iv: string;
  encrypted_value_iv: string;
  encrypted_key_tag: string;
  encrypted_value_tag: string;
  encrypted_key_ciphertext: string;
  encrypted_value_ciphertext: string;
  environment: string;
}> {
  return new Promise((resolve, reject) => {
    const keyIV = crypto.randomBytes(12); // Generate IV for key
    const valueIV = crypto.randomBytes(12); // Generate IV for value
 
 
    // Encrypt key
    encryptAESGCM(
      Buffer.from(key, "utf8"),
      Buffer.from(privateKey, "base64"),
      keyIV
    )
      .then(({ encryptedData: keyEncryptedData, authTag: keyAuthTag }) => {
        const encrypted_key_ciphertext = keyEncryptedData.toString("hex");
        const encrypted_key_tag = keyAuthTag.toString("hex");
 
        // Encrypt value
        encryptAESGCM(
          Buffer.from(value, "utf8"),
          Buffer.from(privateKey, "base64"),
          valueIV
        )
          .then(
            ({ encryptedData: valueEncryptedData, authTag: valueAuthTag }) => {
              const encrypted_value_ciphertext =
                valueEncryptedData.toString("hex");
              const encrypted_value_tag = valueAuthTag.toString("hex");
 
              resolve({
                encrypted_key_iv: keyIV.toString("hex"),
                encrypted_value_iv: valueIV.toString("hex"),
                encrypted_key_tag,
                encrypted_value_tag,
                encrypted_key_ciphertext,
                encrypted_value_ciphertext,
                environment,
              });
            }
          )
          .catch((err) => {
            console.error("Error encrypting value:", err);
            reject(err);
          });
      })
      .catch((err) => {
        console.error("Error encrypting key:", err);
        reject(err);
      });
  });
}

/**
 * Decrypts a key-value pair using AES 256 GCM.
 * @param {string} privateKey - Private key for decryption.
 * @param {string} encrypted_key_iv - IV used to encrypt the key.
 * @param {string} encrypted_key_tag - Authentication tag for the encrypted key.
 * @param {string} encrypted_key_ciphertext - Encrypted key.
 * @param {string} encrypted_value_iv - IV used to encrypt the value.
 * @param {string} encrypted_value_tag - Authentication tag for the encrypted value.
 * @param {string} encrypted_value_ciphertext - Encrypted value.
 * @returns {Promise<{ key: string, value: string }>} - Promise resolving to an object containing the decrypted key and value.
 */
export  function decryptKey(
  privateKey: string,
  id: string,
  encrypted_key_iv: string,
  encrypted_key_tag: string,
  encrypted_key_ciphertext: string,
  encrypted_value_iv: string,
  encrypted_value_tag: string,
  encrypted_value_ciphertext: string
): Promise<{ key: string; value: string; id: string;}> {
  return new Promise((resolve, reject) => {
    try {
      // Convert IV and tag strings to Buffer
      const keyIV = Buffer.from(encrypted_key_iv, "hex");
      const valueIV = Buffer.from(encrypted_value_iv, "hex");
      const keyTag = Buffer.from(encrypted_key_tag, "hex");
      const valueTag = Buffer.from(encrypted_value_tag, "hex");

      // Decrypt key
      decryptAESGCM(
        Buffer.from(encrypted_key_ciphertext, "hex"),
        Buffer.from(privateKey, "base64"),
        keyIV,
        keyTag
      )
        .then((decryptedKey) => {
          // Decrypt value
          decryptAESGCM(
            Buffer.from(encrypted_value_ciphertext, "hex"),
            Buffer.from(privateKey, "base64"),
            valueIV,
            valueTag
          )
            .then((decryptedValue) => {
              resolve({
                key: decryptedKey.toString("utf8"),
                value: decryptedValue.toString("utf8"),
                id: id
              });
            })
            .catch((err) => {
              console.error("Error decrypting value:", err);
              reject(err);
            });
        })
        .catch((err) => {
          console.error("Error decrypting key:", err);
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
}


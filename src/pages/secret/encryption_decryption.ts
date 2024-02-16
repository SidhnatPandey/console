import crypto from "crypto";
import {
  decryptAESGCM,
  decryptRSA,
  encryptAESGCM,
  encryptRSA,
  generateKeyPair,
} from "./crpto_utis";

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

//------------------------------------------------------Encrypted key value pair-------------------------------------------------------------//

//*
// * Encrypts a key using RSA asymmetric encryption and a provided public key.
// * @param {string} orgKey - Organization key for encryption.
// * @param {string} publicKey - Public key for encryption.
// * @param {string} key - Key to encrypt.
// * @param {string} value - Value to encrypt.
// * @returns {Promise<{ encrypted_key_iv: string, encrypted_value_iv: string, encrypted_key_tag: string, encrypted_value_tag: string, encrypted_key_ciphertext: string, encrypted_value_ciphertext: string }>} - Encrypted key and value.
// */
export function encryptKey(
  orgKey: string,
  publicKey: string,
  key: string,
  value: string
): Promise<{
  encrypted_key_iv: string;
  encrypted_value_iv: string;
  encrypted_key_tag: string;
  encrypted_value_tag: string;
  encrypted_key_ciphertext: string;
  encrypted_value_ciphertext: string;
}> {
  return new Promise((resolve, reject) => {
    const OrgKey = Buffer.from(orgKey, "hex");
    const encrypted_key_iv = crypto.randomBytes(12); // Generate IV for key1
    const encrypted_value_iv = crypto.randomBytes(12); // Generate IV for key2
    const Key = Buffer.from(key, "utf8");
    const Value = Buffer.from(value, "utf8");

    // Encrypt both keys
    const encrypted1 = encryptRSA(Key, publicKey);
    const encrypted2 = encryptRSA(Value, publicKey);

    // Encrypt key1 using provided organization key and IV1
    encryptAESGCM(encrypted1, OrgKey, encrypted_key_iv)
      .then(
        ({
          encryptedData: encrypted_key_ciphertext,
          authTag: encrypted_key_tag,
        }) => {
          // Encrypt key2 using provided organization key and IV2
          encryptAESGCM(encrypted2, OrgKey, encrypted_value_iv).then(
            ({
              encryptedData: encrypted_value_ciphertext,
              authTag: encrypted_value_tag,
            }) => {
              resolve({
                encrypted_key_iv: encrypted_key_iv.toString("hex"),
                encrypted_value_iv: encrypted_value_iv.toString("hex"),
                encrypted_key_tag: encrypted_key_tag.toString("hex"),
                encrypted_value_tag: encrypted_value_tag.toString("hex"),
                encrypted_key_ciphertext:
                  encrypted_key_ciphertext.toString("hex"),
                encrypted_value_ciphertext:
                  encrypted_value_ciphertext.toString("hex"),
              });
            }
          );
        }
      )
      .catch((err) => {
        reject(err);
      });
  });
}

//------------------------------------------------------Decrypt Key value pair-------------------------------------------------------------//

/** Decrypts a key using RSA asymmetric decryption and a provided private key.
 * @param {string} encrypted_key_iv - Encrypted key IV.
 * @param {string} encrypted_value_iv - Encrypted value IV.
 * @param {string} encrypted_key_tag - Encrypted key auth tag.
 * @param {string} encrypted_value_tag - Encrypted value auth tag.
 * @param {string} encrypted_key_ciphertext - Encrypted key ciphertext.
 * @param {string} encrypted_value_ciphertext - Encrypted value ciphertext.
 * @param {string} privateKey - Private key for decryption.
 * @param {string} orgKey - Organization key for decryption.
 * @returns {Promise<{ key: Buffer, value: Buffer }>} - Decrypted key and value.
 */
export function decryptKey(
  encrypted_key_iv: string,
  encrypted_value_iv: string,
  encrypted_key_tag: string,
  encrypted_value_tag: string,
  encrypted_key_ciphertext: string,
  encrypted_value_ciphertext: string,
  privateKey: string,
  orgKey: string
): Promise<{ key: Buffer; value: Buffer }> {
  return new Promise((resolve, reject) => {
    const keyiv = Buffer.from(encrypted_key_iv, "hex");
    const valueiv = Buffer.from(encrypted_value_iv, "hex");
    const keyauthtag = Buffer.from(encrypted_key_tag, "hex");
    const keyvaluetag = Buffer.from(encrypted_value_tag, "hex");
    const encryptedKey = Buffer.from(encrypted_key_ciphertext, "hex");
    const encryptedValue = Buffer.from(encrypted_value_ciphertext, "hex");
    const OrgKey = Buffer.from(orgKey, "hex");

    // Decrypt the encrypted key using AES-GCM then RSA
    const decryptedKeyPromise = decryptAESGCM(
      encryptedKey,
      OrgKey,
      keyiv,
      keyauthtag
    ).then((decryptedkey) => decryptRSA(decryptedkey, privateKey));

    // Decrypt the encrypted value using AES-GCM then RSA
    const decryptedValuePromise = decryptAESGCM(
      encryptedValue,
      OrgKey,
      valueiv,
      keyvaluetag
    ).then((decryptedValue) => decryptRSA(decryptedValue, privateKey));

    // Wait for both decryption operations to complete
    Promise.all([decryptedKeyPromise, decryptedValuePromise])
      .then(([key, value]) => {
        resolve({ key, value });
      })
      .catch((err) => reject(err));
  });
}

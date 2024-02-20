import {
  decryptKey,
  decryptPrivateKey,
  encryptKey,
  generateEncryptedKeys,
} from "./encryption_decryption";
const nacl = require("tweetnacl");
nacl.util = require("tweetnacl-util");

const orgid = "65cf5f4d19c3d7072ca6213e";

// generateEncryptedKeys(orgid).then((result) => {
//     console.log(result);
//     }
// );

/**
 {
  encryptedpublicKey: '5Da6rATfaIg9dP/2dOMkL9HXB/O3oxJyPpsLrpxGAxA=',
  encryptediv: '075d082ef99d0a762b0a1076',
  encrptedsalt: '9f978e7df4d0a0bc8a084157b656d65e',
  encryptedPrivateKey: 'a83d20b45ed53e249b2efb7e4d87695b322d896db1e05f60ff4f901ca8f2aeed',
  encryptedTag: 'ef391c77f95be2abbeaf14b707c5e28d',
  orgid: '65cf5f4d19c3d7072ca6213e'
}
 */

// const encryptedpublicKey = "d+0asA3jvzYSv7QxMCV7w9NhvXQRTzjROjW0EDPOzXM=";
// const encryptediv = "f835f9fa19433346b1e634af";
// const encrptedsalt = "f8e2d69388ab5fc785eae5c244e42605";
// const encryptedPrivateKey = "b77d852095e9aeae23625c9f7e8e63ee8004b74f8b8f8af8bcf524a86da66dab";
// const encryptedTag = "bd3f7cc585e5772a39cde5ecf579d812";

//   decryptPrivateKey( orgid,  encrptedsalt, encryptedPrivateKey,encryptediv ,encryptedTag).then((result) => {
//     console.log(result);
//     }
//   );

/**
 {
  privateKey: 'vsY66mWM3sQn+Se3pYBOfP1bhF+2OC6lGwbBczKX04Q=',
  orgKey: 'e714a1d9ad9a82cc3705a6309b6cb351d06d8e0f2873983eec793ee59dfe402c'
}
 */

//----------------------------------------------------
const privateKey = "vsY66mWM3sQn+Se3pYBOfP1bhF+2OC6lGwbBczKX04Q=";
// orgKey: "aNzH0w6S5FT4YWL+ah8XelqcH7crA4nOTEMAl6rQ7b4=";

// Define the key-value pair to encrypt
const key = "MONGO_URI";
const value =
  "mongodb+srv://arvi:arvi@cluster0.ezswte5.mongodb.net/interior_Design";

// // Call the encryptKey function
// encryptKey(privateKey, key, value)
//   .then((encryptedData) => {
//     // Log the encrypted data
//     console.log("Encrypted key and value:", encryptedData);
//   })
//   .catch((error) => {
//     console.error("Encryption error:", error);
//   });

/**
   *Encrypted key and value: {
  encrypted_key_iv: '70e2e462e6c54cd04804b4d2',
  encrypted_value_iv: 'fe212343cce20506bcb15fe3',
  encrypted_key_tag: 'f827905db53d9bcf4ba37e6ed29c42dd',
  encrypted_value_tag: '0f4e29f52814b8e3d0e5d63118a86da5',
  encrypted_key_ciphertext: '9ffc2d23c8268d853e',
  encrypted_value_ciphertext: '02b6c213baae927375990cbf0a4686e4fb0503dcce9f5aeb0f855b46df44038f3245bd15a93134bf1b712d7fce51e40c06de4be72cfd09b8382931d29eb8d57c800d6d63'
}
   */

const encrypted_key_iv = "8be370c7dc4adcd142e14398";
const encrypted_value_iv = "507ec6313c11769d15fee600";
const encrypted_key_tag = "d360dc5c50a3c18ff87d85c7efb2effb";
const encrypted_value_tag = "391b0f2d37b7fb5e61ca8133e7617176";
const encrypted_key_ciphertext = "0f678915d1b694815b";
const encrypted_value_ciphertext =
  "90e2bf4838d636efc5d08554a49350f8249e2baf517f0a632186732691b1680bc3e0730cfc51f677d3dc7d66cd2c29f325a42ff8de3da2fa13c159b1664f4fc5ef0bbb9f";

decryptKey(
  privateKey,
  encrypted_key_iv,
  encrypted_key_tag,
  encrypted_key_ciphertext,
  encrypted_value_iv,
  encrypted_value_tag,
  encrypted_value_ciphertext
)
  .then(({ key, value }) => {
    console.log("Decrypted Key:", key);
    console.log("Decrypted Value:", value);
  })
  .catch((error) => {
    console.error("Decryption Error:", error);
  });

/**
     Decrypted Key: MONGO_URI
Decrypted Value: mongodb+srv://arvi:arvi@cluster0.ezswte5.mongodb.net/interior_Design
     */

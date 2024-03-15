# Initializ Secret Overview

This Documentation explain the working of the Initializ Secret

# SignUp

When user signs up for an account using email/passsword/SSO then the account is created and the orgainsation id is generated for the user.

- Then the organisation id is used to generate the 256-bit symmetric key, called as the derived organisation key.

- Then the public-private key pair is generated for the organisation.(And this is only done once for the organisation)

- The private key is then encrypted using the derived orgainsation key called as the encrypted private key.

- The public key is also encrypted and send to the database too.

Finally, the encrypted private key, encrypted public key , salt, and iv are sent to the Initializ API to be stored in the storage backend. Note that the top-level secret used to secure the user’s account and private key is Derived Organisation key . Therefore, it must not known by the Initializ as it is stored on the client side only.

# SignIn

When user signs in to the account using email/passsword/SSO .If successful, the user’s encrypted private key, encrypted public key, salt, and iv are fetched from the Initializ API.

Then the organisation key is used to reverse the sequence of encryption to get the private key.

- The orgainsation id is then transformed back to the derived organisation key.

- The derived organisation key is then used to decrypt the encrypted private key to get the private key.

Then the private key and publickey is stored on client side and kept handy for further use.


# Secrets 

- When user creates a secret key-value pair  the the secret is encrypted using the key which is being stored on the client side and then the encrypted secret is sent to the Initializ API to be stored in the storage backend.

- When user fetches the secret key-value pair then the encrypted secret is fetched from the Initializ API and then the key is used to decrypt the secret and then the secret is displayed to the user.

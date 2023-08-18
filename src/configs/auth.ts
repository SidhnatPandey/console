export default {
  meEndpoint: '/auth/me',
  loginEndpoint: 'http://localhost:8089/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

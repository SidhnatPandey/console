export default {
  meEndpoint: 'http://localhost:8089/initializ/v1/userInfo',
  loginEndpoint: 'http://localhost:8089/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

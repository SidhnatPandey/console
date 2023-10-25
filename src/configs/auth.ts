export default {
  meEndpoint: '/initializ/v1/userInfo',
  loginEndpoint: '/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

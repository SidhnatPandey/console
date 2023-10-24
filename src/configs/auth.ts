export default {
  meEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/initializ/v1/userInfo`,
  loginEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

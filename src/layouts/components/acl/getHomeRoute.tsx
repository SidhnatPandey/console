/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'client') return '/apps'
  else return '/apps'
}

export default getHomeRoute

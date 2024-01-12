import { LOCALSTORAGE_CONSTANTS } from "src/@core/static/app.constant";

/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  const path = localStorage.getItem(LOCALSTORAGE_CONSTANTS.homeRoute) || '/';
  if (role === 'client') return path
  else return path
}

export default getHomeRoute

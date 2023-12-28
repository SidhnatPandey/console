// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import { env } from 'next-runtime-env';

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import { APP_API } from 'src/@core/static/api.constant';
import { LOCALSTORAGE_CONSTANTS } from 'src/@core/static/app.constant';

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(LOCALSTORAGE_CONSTANTS.token)!
      //setLoading(false)
      if (storedToken) {
        const user = JSON.parse(window.localStorage.getItem('userData')!);
        if (user) {
          setLoading(false)
          setUser({ ...user })
        } else {
          setLoading(true)
          await axios
            .get(APP_API.userInfo, {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            })
            .then(async response => {
              setLoading(false)
              setUser({ ...response.data.userData })
            })
            .catch(() => {
              localStorage.removeItem('userData')
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('accessToken')
              setUser(null)
              setLoading(false)
              if (LOCALSTORAGE_CONSTANTS.refreshToken === 'logout' && !router.pathname.includes('login')) {
                router.replace('/login')
              }
            })
        }
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(env('NEXT_PUBLIC_BASE_URL') + APP_API.login, params)
      .then(async response => {
        if (response) {
          window.localStorage.setItem(LOCALSTORAGE_CONSTANTS.token, response.data.data.access_token)
          params.rememberMe
            ? window.localStorage.setItem('isRemember', 'true')
            : null
          const returnUrl = router.query.returnUrl
          const user: UserDataType = {
            id: 0,
            role: response.data.data.user_data?.role,
            email: response.data.data.user_data?.email,
            fullName: response.data.data.user_data?.user_name,
            username: response.data.data.user_data?.user_name,
            org: response.data.data.user_data?.org,
            default_org: response.data.data.user_data?.default_org
          }
          setUser({ ...user })
          params.rememberMe ? localStorage.setItem('userData', JSON.stringify(user)) : null

          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/apps'

          router.replace(redirectURL as string)
        }
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(LOCALSTORAGE_CONSTANTS.token);
    window.localStorage.removeItem(LOCALSTORAGE_CONSTANTS.refreshToken);
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios
import axios from "axios";

// ** Config
import { env } from "next-runtime-env";

// ** Types
import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  Workspace,
  Organisation,
  Org,
} from "./types";
import { APP_API } from "src/@core/static/api.constant";
import { LOCALSTORAGE_CONSTANTS } from "src/@core/static/app.constant";
import {
  getOrganisations,
  getUserInfo,
  getUserOrg,
  getWorkspaces,
} from "src/services/userService";

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  workspaces: [],
  organisations: [],
  setWorkspaces: () => null,
  setOrganisations: () => null,
  fetchWorkspaces: () => null,
  org: null,
  setOrg: () => null,
  fetchOrg: () => null,
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(
    defaultProvider.workspaces
  );
  const [organisations, setOrganisations] = useState<Organisation[]>(
    defaultProvider.organisations
  );
  const [org, setOrg] = useState<Org | null>(defaultProvider.org);

  // ** Hooks
  const router = useRouter();

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(
        LOCALSTORAGE_CONSTANTS.token
      )!;
      //setLoading(false)
      if (storedToken) {
        //const user = JSON.parse(window.localStorage.getItem('userData')!);
        getUser();
        fetchOrg();
        const isNavigate = !localStorage.getItem(
          LOCALSTORAGE_CONSTANTS.workspace
        );
        fetchWorkspaces(null, isNavigate);
        fetchOrganisation();
        /* if (user) {
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
        } */
      } else {
        setLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType
  ) => {
    axios
      .post(env("NEXT_PUBLIC_BASE_URL") + APP_API.login, params)
      .then(async (response) => {
        if (response) {
          window.localStorage.setItem(
            LOCALSTORAGE_CONSTANTS.token,
            response.data.data.access_token
          );
          params.rememberMe
            ? window.localStorage.setItem("isRemember", "true")
            : null;
          const user: UserDataType = {
            id: "",
            role: response.data.data.user_data?.role,
            email: response.data.data.user_data?.email,
            username: response.data.data.user_data?.user_name,
            org: response.data.data.user_data?.org,
            type: "",
            user_id: "",
            org_id: "",
            password: "",
            created_at: "",
            updated_at: "",
            nickname: "",
            user_info: {
              first_name: "",
              last_name: "",
              phone_number: "",
              profile_picture: "",
              address: {
                country: "",
                state: "",
                zip_code: 0,
                city: "",
                street_address: "",
              },
            },
            status: "",
          };
          setUser({ ...user });
          localStorage.setItem(
            LOCALSTORAGE_CONSTANTS.userName,
            JSON.stringify(user.username)
          );
          localStorage.setItem(
            LOCALSTORAGE_CONSTANTS.ogrId,
            JSON.stringify(response.data.data.user_data?.default_org)
          );
          params.rememberMe
            ? localStorage.setItem(
              LOCALSTORAGE_CONSTANTS.userInfo,
              JSON.stringify(user)
            )
            : null;
          fetchOrg();
          fetchOrganisation();
          await fetchWorkspaces(null, true, true);
          getUser();
        }
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem(LOCALSTORAGE_CONSTANTS.token);
    window.localStorage.removeItem(LOCALSTORAGE_CONSTANTS.refreshToken);
    window.localStorage.removeItem(LOCALSTORAGE_CONSTANTS.workspace);
    window.localStorage.removeItem(LOCALSTORAGE_CONSTANTS.homeRoute);
    window.localStorage.removeItem(LOCALSTORAGE_CONSTANTS.userName);
    window.localStorage.removeItem(LOCALSTORAGE_CONSTANTS.ogrId);
    router.push("/login");
  };

  const getUser = () => {
    setLoading(true);
    getUserInfo().then((response) => {
      setLoading(false);
      setUser({ ...response?.data });
    });
  };

  const fetchWorkspaces = (
    name: string | null,
    navigate = false,
    setHomeRoute = false
  ) => {
    getWorkspaces().then((response) => {
      setLoading(false);

      setWorkspaces(response?.data.workspaces);
      if (!response?.data.workspaces && organisations.length > 0) {
        router.push("/workspaceError");
      } else {
        const newWorkspace = response?.data.workspaces?.find(
          (workspace: { name: string | null }) => workspace.name === name
        );
        if (setHomeRoute) {
          localStorage.setItem(
            LOCALSTORAGE_CONSTANTS.homeRoute,
            `/workspace/${response?.data.workspaces[0].id}`
          );
        }
        if (navigate || name) {
          const returnUrl = router.query.returnUrl;
          const id = name ? newWorkspace?.id : response?.data?.workspaces[0].id;
          const redirectURL =
            returnUrl && returnUrl !== "/" ? returnUrl : `/workspace/${id}`;
          router.replace(redirectURL as string);
        }
      }
    });
  };

  const fetchOrganisation = () => {
    getOrganisations().then((response) => {
      setLoading(false);
      if (response?.data === null) {
        router.push("/orgError");
      } else {
        setOrganisations(response?.data);
      }
    });
  };

  const fetchOrg = () => {
    getUserOrg().then((res) => {
      setOrg(res?.data);
    });
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    workspaces,
    setWorkspaces,
    organisations,
    setOrganisations,
    fetchWorkspaces,
    fetchOrg,
    org,
    setOrg,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

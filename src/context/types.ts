export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: string;
  type: string;
  user_id: string;
  role: string;
  org: string;
  org_id: string;
  email: string;
  username: string;
  password: string;
  created_at: string;
  updated_at: string;
  nickname: string;
  default_org?: string;
  user_info: {
    first_name: string;
    last_name: string;
    phone_number: string;
    profile_picture: string;
    address: {
      country: string;
      state: string;
      zip_code: number;
      city: string;
      street_address: string;
    };
  };
  status: string;
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void,
  workspaces: Workspace[],
  organisations: Organisation[],
  setWorkspaces: (value: Workspace[]) => void,
  setOrganisations: (value: Organisation[]) => void,
  fetchWorkspaces: (value: string | null) => void,
  org: any,
  setOrg: (value: any) => void,
  fetchOrg: () => void,
}

export type Workspace = {
  id: string,
  role: string,
  name: string
}

export type Organisation = {
  org_id: string,
  org_name: string
}

export type Org = {
  created_by: string,
  customer_id: string,
  id: string,
  name: string,
  plan_id: string,
  role: string
}


import React from "react";
import UserProfileHeader from "./UserProfileHeader";
import ProfileTabs from "./ProfileTabs";
import Profile from "./Profile";
import { APP_API } from "src/@core/static/api.constant";
import useSWR from "swr";
import { getFetcher } from "src/services/fetcherService";

export interface UserProfile {
  id: "string";
  type: "string";
  user_id: "string";
  role: "string";
  org: "string";
  org_id: "string";
  email: "string";
  username: "string";
  password: "string";
  created_at: "string";
  updated_at: "string";
  nickname: "string";
  user_info: {
    first_name: "string";
    last_name: "string";
    phone_number: "number";
    profile_picture: "string";
    address: {
      country: "string";
      state: "string";
      zip_code: "number";
      city: "string";
      street_address: "string";
    };
  };
  status: "string";
}

const Index = () => {
  // making api call with SWR
  const { data } = useSWR(APP_API.userProfile, getFetcher);

  return (
    <>
      <UserProfileHeader profileData={data?.data} />
      <ProfileTabs />
      <Profile profileData={data?.data} />
    </>
  );
}

export default Index;

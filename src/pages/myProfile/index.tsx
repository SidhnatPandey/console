import React, { useContext } from "react";
import UserProfileHeader from "./UserProfileHeader";
import ProfileTabs from "./ProfileTabs";
import Profile from "./Profile";
import { AuthContext } from "src/context/AuthContext";

const Index = () => {
  const authContext = useContext(AuthContext);

  return (
    <>
      <UserProfileHeader profileData={authContext.user} />
      <ProfileTabs />
      <Profile profileData={authContext.user} />
    </>
  );
}

export default Index;

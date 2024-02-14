import React, { useContext } from "react";
import UserProfileHeader from "./UserProfileHeader";
import ProfileTabs from "./ProfileTabs";
import Profile from "./Profile";
import { AuthContext } from "src/context/AuthContext";
import { PERMISSION_CONSTANTS } from "src/@core/static/app.constant";

const MyProfile = () => {
  const authContext = useContext(AuthContext);

  return (
    <>
      <UserProfileHeader profileData={authContext.user} />
      <ProfileTabs />
      <Profile profileData={authContext.user} />
    </>
  );
}

MyProfile.acl = {
  action: 'read',
  subject: PERMISSION_CONSTANTS.profile
}

export default MyProfile;

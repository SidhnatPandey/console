import React from "react";
import UserProfileHeader from "./UserProfileHeader";
import ProfileTabs from "./ProfileTabs";
import Profile from "./Profile";

function index() {
  return (
    <div>
      <UserProfileHeader />
      <ProfileTabs />
      <Profile />
    </div>
  );
}

export default index;

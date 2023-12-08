import React, { useState } from "react";
import UserProfileHeader from "./UserProfileHeader";
import ProfileTabs from "./ProfileTabs";
import Profile from "./Profile";

function index() {
  const [allUserData, setAllUserData] = useState({
  });
  
  return (
    <>
      <UserProfileHeader setAllUserData={setAllUserData}/>
      <ProfileTabs />
      <Profile user_info={allUserData} />
    </>
  );
}

export default index;

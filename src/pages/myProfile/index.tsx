import React, { useState } from "react";
import UserProfileHeader from "./UserProfileHeader";
import ProfileTabs from "./ProfileTabs";
import Profile from "./Profile";

function index() {
  const [allUserData, setAllUserData] = useState({
  });
  
  return (
    <div>
      <UserProfileHeader setAllUserData={setAllUserData}/>
      <ProfileTabs />
      <Profile user_info={allUserData} />
    </div>
  );
}

export default index;

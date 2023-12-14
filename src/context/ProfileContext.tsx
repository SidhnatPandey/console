import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ProfileContextProps {
  profileData: any; // Replace 'any' with your actual profile data type
  setProfile: (data: any) => void; // Replace 'any' with your actual profile data type
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profileData, setProfileData] = useState<any | null>(null);

  const setProfile = (data: any) => {
    setProfileData(data);
  };

  return (
    <ProfileContext.Provider value={{ profileData, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextProps => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

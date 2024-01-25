import React, { ReactNode, createContext, useEffect, useState } from "react";
import { SecurityValueTypes, Workspace } from "./types";

const defaultProvider: SecurityValueTypes = {
  workspace: "all",
  setWorkspace: () => null,
  runType: "non-prod",
  setRunType: () => null,
  appId:"",
  setAppId: () => null,
};
export const SecurityContext = createContext(defaultProvider);
type Props = {
  children: ReactNode;
};
export const SecurityProvider = ({ children }: Props) => {
  const [appId, setAppId] = useState<string>( defaultProvider.appId);
  const [workspace, setWorkspace] = useState<string>( defaultProvider.workspace);
  const [runType, setRunType] = useState<string>(defaultProvider.runType);
  
  useEffect(() => { 
    console.log(appId);
  }, [appId])

  const values = {
    workspace,
    setWorkspace,
    runType,
    setRunType,
    appId,
    setAppId,
  };
  return (
    <SecurityContext.Provider value={values}>
      {children}
    </SecurityContext.Provider>
  );
};

import React, { ReactNode, createContext, useState } from "react";
import { SecurityValueTypes } from "./types";

const defaultProvider: SecurityValueTypes = {
  workspace: "all",
  setWorkspace: () => null,
  runType: "non-prod",
  setRunType: () => null,
};
export const SecurityContext = createContext(defaultProvider);
type Props = {
  children: ReactNode;
};
export const SecurityProvider = ({ children }: Props) => {
  const [workspace, setWorkspace] = useState<string>(defaultProvider.workspace);
  const [runType, setRunType] = useState<string>(defaultProvider.runType);

  const values = {
    workspace,
    setWorkspace,
    runType,
    setRunType,
  };
  return (
    <SecurityContext.Provider value={values}>
      {children}
    </SecurityContext.Provider>
  );
};

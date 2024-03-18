import React, { ReactNode, createContext, useState } from "react";
import { SecretKeysValueTypes } from "./types";

const defaultProvider: SecretKeysValueTypes = {
  workspace: "global",
  setWorkspace: () => null,
  environment: "test",
  setEnvironment: () => null,
};
export const SecretContext = createContext(defaultProvider);
type Props = {
  children: ReactNode;
};
export const SecretProvider = ({ children }: Props) => {
  const [workspace, setWorkspace] = useState<string>(defaultProvider.workspace);
  const [environment, setEnvironment] = useState<string>(defaultProvider.environment);

  const values = {
    workspace,
    setWorkspace,
    environment,
    setEnvironment,
  };
  return (
    <SecretContext.Provider value={values}>
      {children}
    </SecretContext.Provider>
  );
};

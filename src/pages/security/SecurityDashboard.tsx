import { Box, Card } from "@mui/material";
import React, { useContext } from "react";
import SwitcherButton from "src/component/switcherButton";
import WorkspaceDropdown from "src/component/workspaceDropdown";
import { SecurityContext } from "src/context/SecurityContext";

interface SecurityDashboardProps {
  title: string; 
}
const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ title }) => {
  const securityContext = useContext(SecurityContext);

  const triggerSecurityData = (selectedValue: string) => {
    securityContext.setRunType(selectedValue);
  };
  return (
    <>
      <Box>
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: '16px', 
            paddingRight: '16px', 
          }}
        >
          <h2>{title}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
            <WorkspaceDropdown />
            <SwitcherButton
              handleBtnClick={triggerSecurityData}
              btnNames={["prod", "non-prod"]}
              defaultValue={"non-prod"}
            />
          </div>
        </Card>
      </Box>
    </>
  );
};

export default SecurityDashboard;

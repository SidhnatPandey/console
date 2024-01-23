import { Box, Card } from "@mui/material";
import React, { useContext, useState } from "react";
import SwitcherButton from "src/component/switcherButton";
import WorkspaceDropdown from "src/component/workspaceDropdown";
import { SecurityContext } from "src/context/SecurityContext";


const SecurityDashboard = () => {
const securityContext = useContext(SecurityContext)

const triggerSecurityData = (selectedValue: string) => {
  securityContext.setRunType(selectedValue);
}
  return (
    <>
      <Box>
        <Card
          sx={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          
            <h2>Security Dashboard</h2>
         
          <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
            <WorkspaceDropdown />
            <SwitcherButton handleBtnClick={triggerSecurityData} btnNames={['prod', 'non-prod']} defaultValue={'non-prod'} />
          </div>
        </Card>
      </Box>
    </>
  );
};

export default SecurityDashboard;

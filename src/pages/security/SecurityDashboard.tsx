import { Box, Card } from "@mui/material";
import React from "react";
import SwitcherButton from "src/component/switcherButton";
import WorkspaceDropdown from "src/component/workspaceDropdown";

const SecurityDashboard = () => {
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
          <div style={{ marginBottom: "20px" }}>
            <h3>Security Dashboard</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '100px' }}>
            <WorkspaceDropdown />
            <SwitcherButton handleBtnClick={undefined} btnNames={['prod', 'current']} defaultValue={'current'} />
          </div>
        </Card>
      </Box>
    </>
  );
};

export default SecurityDashboard;

import { Box, Card } from "@mui/material";
import React from "react";
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
          <h2>Security Dashboard</h2>
          <div style={{ marginTop: "20px" }}>
            <WorkspaceDropdown />
          </div>
          <div style={{ marginTop: "20px" }}>
            <WorkspaceDropdown />
          </div>
        </Card>
      </Box>
    </>
  );
};

export default SecurityDashboard;

import React from "react";
import SecurityCompliance from "./SecurityCompliance";
import SecurityVulnerabilities from "./SecurityVulnerabilities";
import ApplicationVulnerabilities from "./ApplicationVulnerabilities";
import { Box } from "@mui/system";
import { PERMISSION_CONSTANTS } from "src/@core/static/app.constant";
import SecurityDashboard from "./SecurityDashboard";
import {SecurityProvider } from "src/context/SecurityContext";

const Security = () => {
  return (
      <SecurityProvider>
        <Box sx={{ marginBottom: "20px" }}>
          <SecurityDashboard title="Security Dashboard" subtitle={""} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <SecurityCompliance />
          <SecurityVulnerabilities />
        </Box>
        <ApplicationVulnerabilities />
      </SecurityProvider>
  );
};

Security.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.security,
};

export default Security;

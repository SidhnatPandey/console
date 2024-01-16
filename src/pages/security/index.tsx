import React from "react";
import SecurityCompliance from "./SecurityCompliance";
import SecurityVulnerabilities from "./SecurityVulnerabilities";
import ApplicationVulnerabilities from "./ApplicationVulnerabilities";
import { Box } from "@mui/system";
import { PERMISSION_CONSTANTS } from "src/@core/static/app.constant";
const Security = () => {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <SecurityCompliance />
        <SecurityVulnerabilities />
      </Box>
      <ApplicationVulnerabilities />
    </>
  );
};

Security.acl = {
  action: 'read',
  subject: PERMISSION_CONSTANTS.security
}

export default Security;

import React, { useContext } from "react";
import SecurityCompliance from "../../SecurityCompliance";
import SecurityVulnerabilities from "../../SecurityVulnerabilities";
import { Box } from "@mui/system";
import SecurityDashboard from "../../SecurityDashboard";
import {SecurityContext, SecurityProvider } from "src/context/SecurityContext";
import { PERMISSION_CONSTANTS } from "src/@core/static/app.constant";
import { useRouter } from "next/router";
import { convertToString } from "src/@core/utils/string";

const AppSecurityDetails  = () => {

  const router  = useRouter();
  const { appId} = router.query;
  const securityContext = useContext(SecurityContext);
  securityContext.setAppId(convertToString(appId));

  return (
      <SecurityProvider>
        <Box sx={{ marginBottom: "20px" }}>
          <SecurityDashboard title="Work Order API" subtitle="Application CVE Dashboard"  />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <SecurityCompliance />
          <SecurityVulnerabilities />
        </Box>
      </SecurityProvider>
  );
};

AppSecurityDetails.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.security,
};

export default AppSecurityDetails;

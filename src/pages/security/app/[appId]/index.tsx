import React from "react";
import SecurityCompliance from "../../SecurityCompliance";
import SecurityVulnerabilities from "../../SecurityVulnerabilities";
import { Box } from "@mui/system";
import SecurityDashboard from "../../SecurityDashboard";
import { PERMISSION_CONSTANTS } from "src/@core/static/app.constant";
import { useRouter } from "next/router";
import { convertToString } from "src/@core/utils/string";

const AppSecurityDetails = () => {

  const router = useRouter();
  const { appId } = router.query;


  return (
    <>
      <Box sx={{ marginBottom: "20px" }}>
        <SecurityDashboard title="Work Order API" subtitle="Application CVE Dashboard" />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <SecurityCompliance appId={convertToString(appId)} />
        <SecurityVulnerabilities appId={convertToString(appId)} />
      </Box>
    </>
  );
};

AppSecurityDetails.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.security,
};

export default AppSecurityDetails;

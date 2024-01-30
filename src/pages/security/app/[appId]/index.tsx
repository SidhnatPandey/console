import React from "react";
import SecurityCompliance from "../../SecurityCompliance";
import SecurityVulnerabilities from "../../SecurityVulnerabilities";
import { Box } from "@mui/system";
import SecurityDashboard from "../../SecurityDashboard";
import { PERMISSION_CONSTANTS } from "src/@core/static/app.constant";
import { useRouter } from "next/router";
import { convertToString } from "src/@core/utils/string";
import { SecurityProvider } from "src/context/SecurityContext";
import CveVulnerabilities from "./CveVulnerabilities";
import SecurityCveChart from "./SecurityCveChart";

const AppSecurityDetails = () => {

  const router = useRouter();
  const { appId, wid } = router.query;

  return (
    <>
      <SecurityProvider>
        <Box sx={{ marginBottom: "20px" }}>
          <SecurityDashboard title="Work Order API" subtitle="Application CVE Dashboard" wid={convertToString(wid)} showWorkspaceDropdown={false} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <SecurityCompliance appId={convertToString(appId)} />
          <SecurityVulnerabilities appId={convertToString(appId)} />
        </Box>
        <SecurityCveChart white={""} warning={""} primary={""} success={""} labelColor={""} borderColor={""} legendColor={""} />
        <CveVulnerabilities appId={convertToString(appId)} />
      </SecurityProvider>
    </>
  );
};

AppSecurityDetails.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.security,
};

export default AppSecurityDetails;

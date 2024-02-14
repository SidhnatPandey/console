import React from "react";
import SecurityCompliance from "../../SecurityCompliance";
import SecurityVulnerabilities from "../../SecurityVulnerabilities";
import { Box } from "@mui/system";
import SecurityDashboard from "../../SecurityDashboard";
import {
  LOCALSTORAGE_CONSTANTS,
  PERMISSION_CONSTANTS,
  SESSIONSTORAGE_CONSTANTS,
} from "src/@core/static/app.constant";
import { useRouter } from "next/router";
import { convertToString } from "src/@core/utils/string";
import { SecurityProvider } from "src/context/SecurityContext";
import CveVulnerabilities from "./CveVulnerabilities";
import SecurityCveChart from "./SecurityCveChart";
import BackButton from "src/component/backButton";

const AppSecurityDetails = () => {
  const router = useRouter();
  const { appId, data } = router.query;
  let wid!: string, appName!: string;
  if (data) {
    const params = JSON.parse(convertToString(data));
    wid = params.wid;
    appName = params.appName;
  }

  if (!wid) {
    wid = localStorage.getItem(LOCALSTORAGE_CONSTANTS.workspace)!;
  }
  if (!appName) {
    appName = sessionStorage.getItem(SESSIONSTORAGE_CONSTANTS.appName)!;
  }
  sessionStorage.setItem(SESSIONSTORAGE_CONSTANTS.appName, appName);

  return (
    <>
      <SecurityProvider>
        <Box sx={{ marginBottom: "20px" }}>
          <SecurityDashboard
            title={appName}
            subtitle="Application CVE Dashboard"
            wid={convertToString(wid)}
            showWorkspaceDropdown={false}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <SecurityCompliance appId={convertToString(appId)} />
          <SecurityVulnerabilities appId={convertToString(appId)} />
        </Box>
        <SecurityCveChart appId={convertToString(appId)} />
        <CveVulnerabilities appId={convertToString(appId)} />
        <BackButton />
      </SecurityProvider>
    </>
  );
};

AppSecurityDetails.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.security,
};

export default AppSecurityDetails;

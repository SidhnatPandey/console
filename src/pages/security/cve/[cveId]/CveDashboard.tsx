import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/system";
import SecurityDashboard from "../../SecurityDashboard";
import {
  LOCALSTORAGE_CONSTANTS,
  PERMISSION_CONSTANTS,
} from "src/@core/static/app.constant";
import { useRouter } from "next/router";
import { convertToString } from "src/@core/utils/string";
import { SecurityContext } from "src/context/SecurityContext";
import { appAffected } from "src/services/securityService";
import ImpactedApplications from "./ImpactedApplications";
import ImpactedPackages from "./ImpactedPackages";
import SeverityEpss from "./SeverityEpssCard";
import BackButton from "src/component/backButton";

export interface AppsAffectedByCVEData {
  AppsAffected: {
    AppName: string;
    AppID: string;
    WorkspaceId: string;
    WorkspaceName: string;
    [key: string]: string;
  }[];
  CveDescription: string;
  CveId: string;
  CveScore: number;
  CveUrl: string;
  PackageAffected: {
    PackageName: string;
    Version: string;
    [key: string]: string;
  }[];
  Severity: string;
}

const CveDashboard = () => {
  const securityContext = useContext(SecurityContext);
  const router = useRouter();
  const { cveId } = router.query;
  const [loading, setLoading] = useState<boolean>(false);
  const [appsAffectedData, setAppsAffectedData] =
    useState<AppsAffectedByCVEData>();

  useEffect(() => {
    getAppsAffected(
      convertToString(cveId),
      securityContext.runType,
      securityContext.workspace
    );
  }, [securityContext.workspace, securityContext.runType, cveId]);

  const getAppsAffected = (
    cveId: string,
    runType: string,
    workspaceId: string
  ) => {
    setLoading(true);
    appAffected(cveId, runType, workspaceId).then((res) => {
      setAppsAffectedData(res?.data || []);
      setLoading(false);
    });
  };
  const CveScore = appsAffectedData?.CveScore || 0;
  const CveDescription = appsAffectedData?.CveDescription || "";
  const CveUrl = appsAffectedData?.CveUrl || "";
  return (
    <>
      <Box sx={{ marginBottom: "20px" }}>
        <SecurityDashboard
          title={convertToString(cveId)}
          subtitle="CVE Details"
          CveScore={CveScore}
          CveDescription={CveDescription}
          CveUrl={CveUrl}
          showWorkspaceDropdown={true}
        />
        <SeverityEpss
          appsAffectedData={appsAffectedData}
          setAppsAffectedData={setAppsAffectedData}
        />
        <ImpactedApplications
          appsAffectedData={appsAffectedData}
          setAppsAffectedData={setAppsAffectedData}
          loading={loading}
        />

        <ImpactedPackages
          appsAffectedData={appsAffectedData}
          setAppsAffectedData={setAppsAffectedData}
          loading={loading}
        />
        <BackButton />
      </Box>
    </>
  );
};

CveDashboard.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.security,
};

export default CveDashboard;

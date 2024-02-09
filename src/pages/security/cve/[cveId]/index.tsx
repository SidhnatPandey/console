import React from "react";
import { PERMISSION_CONSTANTS } from "src/@core/static/app.constant";
import { SecurityProvider } from "src/context/SecurityContext";

import CveDashboard from "./CveDashboard";

const AffectedApps = () => {
  return (
    <SecurityProvider>
      <CveDashboard />
    </SecurityProvider>
  );
};

AffectedApps.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.security,
};

export default AffectedApps;

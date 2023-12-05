import React from "react";
import SecurityCompliance from "./SecurityCompliance";
import SecurityVulnerabilities from "./SecurityVulnerabilities";
import ApplicationVulnerabilities from "./ApplicationVulnerabilities";
import { Box } from "@mui/system";
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

export default Security;

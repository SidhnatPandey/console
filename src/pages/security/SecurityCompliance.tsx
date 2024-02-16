import React, { useContext, useEffect, useState } from "react";
// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Third Party Imports
import { ApexOptions } from "apexcharts";

// ** Custom Components Imports
import Icon from "src/@core/components/icon";
import CustomAvatar from "src/@core/components/mui/avatar";
import ReactApexcharts from "src/@core/components/react-apexcharts";

// ** Util Import
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";
import { getScans } from "src/services/securityService";
import { SecurityContext } from "src/context/SecurityContext";

interface Props {
  appId?: string;
}

const SecurityCompliance = (props: Props) => {
  const { appId } = props;
  // ** Hook
  const theme = useTheme();
  const securityContext = useContext(SecurityContext);

  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Compliant", "Non-Compliant"],
    colors: [
      hexToRGBA(theme.palette.success.main, 1),
      hexToRGBA(theme.palette.error.main, 1),
    ],
    legend: {
      show: true,
      position: "bottom",
    },
  };

  const [scanData, setScanData] = useState({
    succeeded: 0,
    failed: 0,
  });

  useEffect(() => {
    getScanData(securityContext.workspace, securityContext.runType, appId);
  }, [securityContext.workspace, securityContext.runType, appId]);

  const getScanData = (
    workspaceId: string,
    runType: string,
    appId?: string
  ) => {
    getScans(workspaceId, runType, appId)
      .then((response) => {
        setScanData(response?.data || {});
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const successData = scanData.succeeded || 0;
  const failureData = scanData.failed || 0;
  const totalData = successData + failureData;
  let seriesData = totalData === 0 ? [0, 0] : [successData, failureData];

  if (totalData === 0) {
    options.labels = ['No Data']
    options.colors = ['#f0f0f0']
    seriesData = [1]
  }


  return (
    <Card
      sx={{ width: "49%", height: "500px" }}
      data-testid="security-compliance-card"
    >
      <CardHeader title="Scan Compliance" data-testid="card-header" />
      <CardContent style={{ padding: 20, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ReactApexcharts
            type="pie"
            height={400}
            width={400}
            options={options}
            series={seriesData}
            data-testid="chart"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityCompliance;

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
      sparkline: { enabled: true },
    },

    labels: ["Policy Compliance"],
    colors: [hexToRGBA(theme.palette.success.main, 1)],
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        opacityTo: 1,
        opacityFrom: 1,
        shadeIntensity: 1,
        stops: [30, 70, 100],
        inverseColors: true,
        gradientToColors: [theme.palette.success.main],
      },
    },
    plotOptions: {
      radialBar: {
        endAngle: 140,
        startAngle: -140,
        hollow: { size: "60%" },
        track: { background: "#CE4A4B" },
        dataLabels: {
          name: {
            offsetY: -15,
            fontSize: "18px",
            color: "gray",
            fontFamily: theme.typography.fontFamily,
          },
          value: {
            offsetY: 15,
            fontWeight: 500,
            fontSize: "38px",
            formatter: (value) => `${value}%`,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
          },
        },
      },
    },

    grid: {
      padding: {
        top: -30,
        bottom: 12,
      },
    },
    responsive: [
      {
        breakpoint: 1300,
        options: {
          grid: {
            padding: {
              left: 22,
            },
          },
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          grid: {
            padding: {
              left: 0,
            },
          },
        },
      },
    ],
  };

  const [scanData, setScanData] = useState({
    totalApps: 0,
    succeeded: 0,
    failed: 0,
  });
  const [successPercentage, setSuccessPercentage] = useState(0);
  const [chartKey, setChartKey] = useState(Math.random());

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
        let percentage =
          (response?.data.succeeded / response?.data.totalApps) * 100 || 0;
        percentage = parseFloat(percentage.toFixed(2));
        setSuccessPercentage(percentage);
        setChartKey(Math.random());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Card
      sx={{ width: "49%", height: "500px" }}
      data-testid="security-compliance-card"
    >
      <CardHeader title="Scan Compliance" data-testid="card-header" />
      <CardContent style={{ padding: 20, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ReactApexcharts
            key={chartKey}
            type="radialBar"
            height={400}
            width={400}
            options={options}
            series={[successPercentage]}
            data-testid="chart"
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "55px",
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <CustomAvatar
                  skin="light"
                  variant="rounded"
                  color="success"
                  sx={{
                    marginRight: 4,
                    marginLeft: 10,
                    width: 34,
                    height: 34,
                  }}
                >
                  <Icon icon="tabler:circle-check" />
                </CustomAvatar>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 500 }}
                    data-testid="succeeded-scans"
                  >
                    Compliant
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: "text.secondary" }}
                    data-testid="succeeded-scans-data"
                  >
                    {scanData.succeeded ? scanData.succeeded : 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <CustomAvatar
                  skin="light"
                  variant="rounded"
                  color="error"
                  sx={{ marginRight: 4, marginLeft: 10, width: 34, height: 34 }}
                >
                  <Icon icon="tabler:circle-x" />
                </CustomAvatar>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 500 }}
                    data-testid="failed-scans"
                  >
                    Non-Compliant
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: "text.secondary" }}
                    data-testid="failed-scans-data"
                  >
                    {scanData.failed ? scanData.failed : 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityCompliance;

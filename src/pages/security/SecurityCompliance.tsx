import React, { useEffect, useState } from "react";
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
import OptionsMenu from "src/@core/components/option-menu";
import CustomAvatar from "src/@core/components/mui/avatar";
import ReactApexcharts from "src/@core/components/react-apexcharts";

// ** Util Import
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";
import { getScans } from "src/services/securityService";

const SecurityCompliance = () => {
  // ** Hook
  const theme = useTheme();

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true },
    },
    stroke: { dashArray: 10 },
    labels: ["Policy Compliance"],
    colors: [hexToRGBA(theme.palette.primary.main, 1)],
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
        opacityTo: 0.5,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: [theme.palette.primary.main],
      },
    },
    plotOptions: {
      radialBar: {
        endAngle: 130,
        startAngle: -140,
        hollow: { size: "60%" },
        track: { background: "transparent" },
        dataLabels: {
          name: {
            offsetY: -15,
            fontSize: "14px",
            color: theme.palette.text.disabled,
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
    totalScans: 0,
    succeeded: 0,
    failed: 0,
  });
  const [successPercentage, setSuccessPercentage] = useState(100);

  useEffect(() => {
    const getScanData = () => {
      getScans()
        .then((response) => {
          setScanData(response?.data || {});
          const percentage = (response?.data.succeeded / response?.data.totalScans) * 100 || 0;
          setSuccessPercentage(percentage);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getScanData();
  }, []);

  return (
    <Card sx={{ width: "60%", height: "80%" }}>
      <CardHeader
        title="Scan Compliance"
        action={
          <OptionsMenu
            options={["Refresh", "Edit", "Share"]}
            iconButtonProps={{ size: "small", sx: { color: "text.disabled" } }}
          />
        }
      />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={5} style={{ paddingTop: "50px" }}>
            <Typography variant="h4"> {scanData.totalScans}</Typography>
            <Typography sx={{ mb: 6, color: "text.secondary" }}>
              Total Scans
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <CustomAvatar
                skin="light"
                variant="rounded"
                color="success"
                sx={{ mr: 4, width: 34, height: 34 }}
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
                <Typography sx={{ fontWeight: 500 }}>Success</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.disabled" }}>
                  {scanData.succeeded ? scanData.succeeded : 0}{" "}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <CustomAvatar
                skin="light"
                variant="rounded"
                color="error"
                sx={{ mr: 4, width: 34, height: 34 }}
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
                <Typography sx={{ fontWeight: 500 }}>Failed</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.disabled" }}>
                  {scanData.failed ? scanData.failed : 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={7}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactApexcharts
              type="radialBar"
              height={325}
              options={options}
              series={[successPercentage]}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SecurityCompliance;

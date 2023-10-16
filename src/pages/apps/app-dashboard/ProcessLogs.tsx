import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PendingIcon from "@mui/icons-material/Pending";
import LoopIcon from "@mui/icons-material/Loop";
import CustomAvatar from "src/@core/components/mui/avatar";
import Icon from "src/@core/components/icon";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import Skeleton from 'react-loading-skeleton';


interface ProcessLogsProps {
  steps: Step[];
  loading: boolean
}

interface Step {
  completed_at: string;
  log: string;
  reason: string;
  run_name: string;
  started_at: string;
  status: string;
}

const ProcessLogs: React.FC<ProcessLogsProps> = ({ steps, loading }) => {

  const [value, setValue] = useState<string>("0");
  const [logs, setLogs] = useState<string[]>([])

  const icon = (status: string) => {
    switch (status) {
      case "Succeeded":
        return (
          <CustomAvatar
            skin="light"
            color={"success"}
            sx={{
              marginTop: 1,
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
            }}
            style={{ marginRight: 10 }}
          >
            <Icon icon={"ph:check-light"} />
          </CustomAvatar>
        );
      case "InProgress":
        return (
          <>

            <LoopIcon
              style={{ animation: "spin 4s linear infinite", marginLeft: "5px" }}

              color="primary"
              fontSize="medium"
            />
            <style>
              {`
              @keyframes spin {
                0% { transform: rotate(360deg); }
                100% { transform: rotate(0deg); }
              }`}
            </style>

          </>
        );
      case "Waiting":
        return (
          <PendingIcon fontSize="medium" style={{ color: "rgb(85, 85, 85)" }} />
        );
      case "Failed":
        return <ErrorOutlineIcon fontSize="medium" style={{ color: "red" }} />;
      default:
        return (
          <HelpOutlineIcon fontSize="medium" style={{ color: "rgb(85, 85, 85)" }} />
        );
    }
  };

  useEffect(() => {
    setValue("0");
    if (steps) {
      setLogs(steps[0].log.split('\n'));
    }
  }, [loading])

  const handleTabChange = (step: Step, index: number) => {
    setValue(index.toString());
    setLogs(step.log.split('\n'));
  };

  return (
    <Card sx={{ height: "auto", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ padding: "10px", marginLeft: "20px", flex: 1 }}>
        <Grid container spacing={2}>
          <Grid item>
            <Typography variant="h4">
              <b>Logs</b>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Grid container spacing={2} style={{ paddingLeft: "100px" }}>
        <Grid item xs={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Center horizontally
              alignItems: "center", // Center vertically
              width: "20%", // Adjust the width as needed
              padding: "20px", // Add padding for spacing
            }}
          >
            {loading ? <Skeleton width={100} height={20} /> :
              <TabContext value={value}>
                <TabList
                  orientation="vertical"
                  aria-label="vertical tabs example"
                  sx={{
                    width: "100%", // Make the tabs take the full width of the Box
                    "& .MuiTab-root": {
                      fontSize: "1", // Increase the font size
                      padding: "10px 20px", // Adjust padding for larger size
                    },
                  }}
                >
                  {steps?.map((step, index) => {
                    return (
                      <Tab
                        iconPosition="end"
                        value={index.toString()}
                        label={step.run_name}
                        key={index}
                        onClick={() => handleTabChange(step, index)}
                        icon={icon(step.status)}
                      />
                    );
                  })}
                </TabList>
              </TabContext>}
          </Box>
        </Grid>
        <Grid item xs={11}>
          <div className="scroll-container2" style={{
            height: '400px',
            backgroundColor: 'black',
            color: 'white',
            width: '100%',
            overflow: 'auto',
            padding: '10px',
          }}>
            {!loading && logs.map((log, index) => {
              return <p style={{ color: 'white', margin: 0 }} key={index}>{log}</p>
            })}
            {loading && <Skeleton count={20} width={500} height={10} />}
          </div>
        </Grid>
      </Grid>



    </Card>
  );
};

export default ProcessLogs;

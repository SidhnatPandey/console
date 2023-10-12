import React, { SyntheticEvent, useEffect, useState } from "react";
import { Grid, Card } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import Typography from "@mui/material/Typography";
import ProcessLogs from "./ProcessLogs";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PendingIcon from "@mui/icons-material/Pending";
import LoopIcon from "@mui/icons-material/Loop";
import CustomAvatar from "src/@core/components/mui/avatar";
import Icon from "src/@core/components/icon";
import { Container } from "@mui/system";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


// Define the prop types for the ProcessDetails component
interface ProcessDetailsProps {
  supplyChainStepData: {
    stage?: string;
    status?: string;
    duration?: string;
    gitRepo?: string;
    commit?: string;
    branch?: string;
    date?: string;
    steps: Step[];
  };
}

interface Step {
  completed_at: string;
  log: string;
  reason: string;
  run_name: string;
  started_at: string;
  status: string;
}

const ProcessDetails: React.FC<ProcessDetailsProps> = ({
  supplyChainStepData,
}) => {
  const [value, setValue] = useState<string>("0");
  const [step, setStep] = useState<Step>(supplyChainStepData?.steps[0]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  

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
              style={{ animation: "spin 4s linear infinite", marginLeft:"5px" }}
            
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
      return <ErrorOutlineIcon  fontSize="medium" style={{ color: "red" }} />;
    default:
      return (
        <HelpOutlineIcon fontSize="medium" style={{ color: "rgb(85, 85, 85)" }} />
      );
  }
};


  useEffect(() => {
    setValue("0");
    if (supplyChainStepData) {
      setStep(supplyChainStepData.steps[0]);
    }
  }, [supplyChainStepData?.steps[0]]);

  const handleTabChange = (step: Step, index: number) => {
    setStep(step);
  };

  return (
    <>
      <Card sx={{ display: "flex", flexDirection: "row" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            width: "20%", // Adjust the width as needed
            padding: "20px", // Add padding for spacing
          }}
        >
          <TabContext value={value}>
            <TabList
              orientation="vertical"
              onChange={handleChange}
              aria-label="vertical tabs example"
              sx={{
                width: "100%", // Make the tabs take the full width of the Box
                "& .MuiTab-root": {
                  fontSize: "1.2rem", // Increase the font size
                  padding: "10px 20px", // Adjust padding for larger size
                },
              }}
            >
              {supplyChainStepData?.steps.map((step, index) => {
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
          </TabContext>
        </Box>

        <Grid container spacing={2} style={{ padding: "30px" }}>
          <Grid item xs={12}>
            <Typography variant="h5">
              <b>Stage</b>{" "}
              {supplyChainStepData ? supplyChainStepData.stage : "N/A"}{" "}
            </Typography>
            <Typography variant="h6" style={{ marginBottom: "30px" }}>
              <b>Duration:</b> {"N/A"}
            </Typography>
            <Typography variant="h5">
              <b>Status</b>{" "}
              {supplyChainStepData ? supplyChainStepData.status : "N/A"}{" "}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h5">
              <b>Git Repo:</b>
              {"N/A"}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h5">
              <b>Commit:</b> {"N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h5">
              <b>Branch:</b> {"N/A"}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h5">
              <b>Date:</b> {"N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Card>
      <br></br>
      <ProcessLogs log={step?.log} />
    </>
  );
};

export default ProcessDetails;

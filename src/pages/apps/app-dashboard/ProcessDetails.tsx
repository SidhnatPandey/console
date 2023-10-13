import React, { SyntheticEvent, useEffect, useState } from "react";
import { Grid, Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import ProcessLogs from "./ProcessLogs";

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

  return (
    <>
      <Card sx={{ display: "flex", flexDirection: "row" }}>
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
      <ProcessLogs steps={supplyChainStepData.steps} />
    </>
  );
};

export default ProcessDetails;

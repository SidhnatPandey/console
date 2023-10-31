import React, { SyntheticEvent, useEffect, useState } from "react";
import { Grid, Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import ProcessLogs from "./ProcessLogs";
import Skeleton from 'react-loading-skeleton';

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
    started_at: string,
    completed_at: string
    steps: Step[];
  };
  loading: boolean,
  gitRepo: string | undefined,
  gitBranch: string | undefined
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
  loading,
  gitRepo,
  gitBranch
}) => {

  const [duration, setDuration] = useState<string | undefined>();

  const calcDuration = () => {
    const sDate = new Date(supplyChainStepData.started_at);
    const eDate = new Date(supplyChainStepData.completed_at);
    let diff = eDate.getTime() - sDate.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / 1000 / 60);
    diff -= minutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);
    let string = '';
    if (hours > 0) { string = hours + " hour " }
    if (minutes > 0) { string += minutes + " min " }
    if (seconds > 0) { string += seconds + " sec" }
    setDuration(string);
  }

  useEffect(() => {
    if (supplyChainStepData) {
      calcDuration();
    }
  }, [supplyChainStepData])

  return (
    <>
      <Card sx={{ display: "flex", flexDirection: "row" }}>
        <Grid container spacing={2} style={{ padding: "30px" }}>
          <Grid item xs={12}>
            {loading ? <Skeleton width={200} height={20} /> : <Typography variant="h5">
              <b>Stage:</b>{" "}
              {supplyChainStepData ? supplyChainStepData.stage : "N/A"}{" "}
            </Typography>}
            {loading ? <Skeleton width={150} height={20} /> : <Typography variant="h6" style={{ marginBottom: "30px" }}>
              <b>Duration:</b> {duration}
            </Typography>}
            {loading ? <Skeleton width={200} height={20} /> : <Typography variant="h5">
              <b>Status:</b>{" "}
              {supplyChainStepData ? supplyChainStepData.status : "N/A"}{" "}
            </Typography>}

          </Grid>

          <Grid item xs={6}>
            {loading ? <Skeleton width={200} height={20} /> :
              <Typography variant="h5">
                <b>Git Repo: </b>
                {gitRepo ? gitRepo : "N/A"}
              </Typography>}
          </Grid>

          <Grid item>
            {loading ? <Skeleton width={200} height={20} /> :
              <Typography variant="h5">
                <b>Commit:</b> {"N/A"}
              </Typography>}
          </Grid>

          <Grid item xs={6}>
            {loading ? <Skeleton width={150} height={20} /> :
              <Typography variant="h5">
                <b>Branch:</b> {gitBranch ? gitBranch : "N/A"}
              </Typography>}
          </Grid>

          <Grid item>
            {loading ? <Skeleton width={150} height={20} /> :
              <Typography variant="h5">
                <b>Date:</b> {supplyChainStepData?.started_at ? new Date(supplyChainStepData?.started_at).toLocaleString() : "N/A"}
              </Typography>}
          </Grid>
        </Grid>
      </Card>
      <br></br>
      <ProcessLogs steps={supplyChainStepData?.steps} loading={loading} />
    </>
  );
};

export default ProcessDetails;

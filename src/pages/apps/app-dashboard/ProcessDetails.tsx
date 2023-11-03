import React, { useEffect, useState } from "react";
import { Grid, Card, Button } from "@mui/material";
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
    started_at: string;
    completed_at: string;
    steps: Step[];
    result: Result[];
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

interface Result {
  Key: string,
  Value: string
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
    setDuration(undefined);
    if (supplyChainStepData) {
      calcDuration();
    }
  }, [supplyChainStepData])

  return (
    <>
      <Card data-testid="card" sx={{ display: "flex", flexDirection: "row" }}>
        <Grid container spacing={2} style={{ padding: "30px" }}>
          <Grid item xs={12} style={{ marginBottom: "-10px", marginTop: "-20px" }}><h2>Stage Summary</h2></Grid>
          <Grid item xs={4}>
            {loading ? <Skeleton width={200} height={20} /> : <Typography variant="h5" data-testid="stage">
              <b>Stage:</b>{" "}
              {supplyChainStepData ? supplyChainStepData.stage : "N/A"}{" "}
            </Typography>}
          </Grid>
          <Grid item xs={4}>
            {loading ? <Skeleton width={150} height={20} /> : <Typography variant="h5" data-testid="duration">
              <b>Duration:</b> {duration ? duration : "N/A"}
            </Typography>}
          </Grid>
          <Grid item xs={4}>
            {loading ? <Skeleton width={200} height={20} /> : <Typography variant="h5" data-testid="status">
              <b>Status:</b>{" "}
              {supplyChainStepData ? supplyChainStepData.status : "N/A"}{" "}
            </Typography>}
          </Grid>

          <Grid item xs={4}>
            {loading ? <Skeleton width={200} height={20} /> :
              <Typography data-testid="gitrepo" variant="h5">
                <b>Git Repo: </b>
                {gitRepo ? gitRepo : "N/A"}
              </Typography>}
          </Grid>

          <Grid item xs={4}>
            {loading ? <Skeleton width={150} height={20} /> :
              <Typography data-testid="branch" variant="h5">
                <b>Branch:</b> {gitBranch ? gitBranch : "N/A"}
              </Typography>}
          </Grid>

          <Grid item xs={4}>
            {loading ? <Skeleton width={150} height={20} /> :
              <Typography data-testid="date" variant="h5">
                <b>Date:</b> {supplyChainStepData?.started_at ? new Date(supplyChainStepData?.started_at).toLocaleString() : "N/A"}
              </Typography>}
          </Grid>



          {supplyChainStepData?.result.length > 0 && <>
            <Grid item xs={12} style={{ marginBottom: "-20px", marginTop: "-10px" }}><h2>Result</h2></Grid>
            {supplyChainStepData.result.map((result: any, index: number) => {
              return <>
                <Grid item xs={3}>
                  {loading ? <Skeleton width={150} height={20} /> :
                    <Typography variant="h5">
                      <b>{result.Key.toLowerCase()}</b>
                    </Typography>}
                </Grid>
                <Grid item xs={9}>
                  {loading ? <Skeleton width={350} height={20} /> :
                    <Typography variant="h5">
                      {result.Value}
                    </Typography>}
                </Grid>
              </>
            })}
          </>
          }

          <Grid item xs={12}>
            {(supplyChainStepData?.stage?.toLowerCase().includes("approval") && supplyChainStepData.status === 'Succeeded') && <div className='demo-space-x'>
              <Button variant='contained' color='success' size="large">
                Approve
              </Button>
              <Button variant='contained' color='error' size="large">
                Reject
              </Button>
            </div>}
          </Grid>
        </Grid>
      </Card >
      <br></br>
      {supplyChainStepData?.steps?.length > 0 && <ProcessLogs steps={supplyChainStepData?.steps} loading={loading} />}
    </>
  );
};

export default ProcessDetails;

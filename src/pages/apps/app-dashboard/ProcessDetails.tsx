import React from 'react';
import { Typography, Grid, Card } from "@mui/material";

// Define the prop types for the ProcessDetails component
interface ProcessDetailsProps {
  supplyChainStepData?: {
    stage?: string; // Include 'stage' in the props
    status?: string;
    duration?: string;
    gitRepo?: string;
    commit?: string;
    branch?: string;
    date?: string;
  };
}

const ProcessDetails: React.FC<ProcessDetailsProps> = ({
  supplyChainStepData,
}) => {
  const {
    stage = "N/A", // Add stage here
    status = "N/A",
    duration = "N/A",
    gitRepo = "N/A",
    commit = "N/A",
    branch = "N/A",
    date = "N/A",
  } = supplyChainStepData || {};

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Grid container spacing={2} style={{ padding: '30px' }}>
        <Grid item xs={12}>
          <Typography variant="h5"><b>{stage}:</b> {status}</Typography>
          <Typography variant="h6" style={{ marginBottom: '30px' }}>
            <b>Duration:</b> {duration}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h5"><b>Git Repo:</b> {gitRepo}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5"><b>Commit:</b> {commit}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h5"><b>Branch:</b> {branch}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5"><b>Date:</b> {date}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ProcessDetails;

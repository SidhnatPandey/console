import React from 'react';
import { Typography, Grid } from "@mui/material";

interface ProcessDetailsProps {
  title: string | null;
}

const ProcessDetails: React.FC<ProcessDetailsProps> = ({ title }) => {
  if (title === null) {
    return null; // Return null to hide the component
  }

  return (
    <Grid container spacing={2} style={{ padding: '30px' }}>
      <Grid item xs={12}>
        <Typography variant="h5"><b>{title}:</b> In progress</Typography>
        <Typography variant="h6" style={{ marginBottom: '30px' }}><b>Duration:</b> 29 sec</Typography>
      </Grid>

      <Grid item xs={8.6} container justifyContent="space-between">
        <Grid item>
          <Typography variant="h5"><b>Git Repo:</b> git@github.com:initializ/api:git</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5"><b>Commit:</b> SHA</Typography>
        </Grid>
      </Grid>

      <Grid item xs={8} container justifyContent="space-between">
        <Grid item>
          <Typography variant="h5"><b>Branch:</b> develop</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5"><b>Date:</b></Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProcessDetails;

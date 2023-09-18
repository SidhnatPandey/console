import React from 'react';
import { Typography, Grid, Card } from "@mui/material";

// Define the prop types for the ProcessDetails component
interface ProcessDetailsProps {
  title: string;
  duration?: string; // Make 'duration' prop optional
  gitRepo?: string;
  commit?: string;
  branch?: string;
  date?: string;
}

const ProcessDetails: React.FC<ProcessDetailsProps> = ({ title }) => {
 

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
    <Grid container spacing={2} style={{ padding: '30px' }}>
      <Grid item xs={12}>
        <Typography variant="h5"><b>{title}:</b> In progress</Typography>
        <Typography variant="h6" style={{ marginBottom: '30px' }}><b>Duration:</b> 29 sec</Typography>
      </Grid>

      <Grid item xs={6}>

        <Typography variant="h5"><b>Git Repo:</b> git@github.com:initializ/api:git</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5"><b>Commit:</b> SHA</Typography>

      </Grid>

      <Grid item xs={6}>

        <Typography variant="h5"><b>Branch:</b> develop</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5"><b>Date:</b></Typography>
      </Grid>

    </Grid>
    </Card>
  );
};

export default ProcessDetails;

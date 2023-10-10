import React, { SyntheticEvent, useState } from 'react';
import { Grid, Card } from "@mui/material";
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'

// Define the prop types for the ProcessDetails component
interface ProcessDetailsProps {
  supplyChainStepData?: {
    stage?: string;
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
    stage = "N/A",
    status = "N/A",
    duration = "N/A",
    gitRepo = "N/A",
    commit = "N/A",
    branch = "N/A",
    date = "N/A",
  } = supplyChainStepData || {};

  const [value, setValue] = useState<string>('1');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: 'row' }}>
    <Box sx={{
      display: 'flex',
      justifyContent: 'center', // Center horizontally
      alignItems: 'center', // Center vertically
      width: '20%', // Adjust the width as needed
      padding: '20px', // Add padding for spacing
    }}>
      <TabContext value={value}>
        <TabList
          orientation='vertical'
          onChange={handleChange}
          aria-label='vertical tabs example'
          sx={{
            width: '100%', // Make the tabs take the full width of the Box
            '& .MuiTab-root': {
              fontSize: '1.2rem', // Increase the font size
              padding: '10px 20px', // Adjust padding for larger size
            },
          }}
        >
          <Tab value='1' label='Prepare' />
          <Tab value='2' label='Create' />
          <Tab value='3' label='Result' />
        </TabList>
      </TabContext>
    </Box>

      <Grid container spacing={2} style={{ padding: '30px' }}>
        
        <Grid item xs={12}>
          <Typography variant="h5"><b>Stage</b> {stage} </Typography>
          <Typography variant="h6" style={{ marginBottom: '30px' }}>
            <b>Duration:</b> {duration}
          </Typography>
          <Typography variant="h5"><b>Status</b> {status} </Typography>

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

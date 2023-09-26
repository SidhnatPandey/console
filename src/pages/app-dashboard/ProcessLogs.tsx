import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const ProcessLogs = () => {
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
      <div className="scroll-container2" style={{
  height: '400px',
  backgroundColor: 'black',
  color: 'white',
  width: '100%',
  overflow: 'auto',
  
  
 
}}>
  <ul style={{ whiteSpace: 'nowrap' ,padding: '10px', 
    margin: '10px', marginLeft:'20px', paddingRight:'40px'}}>
    {Array(40)
      .fill(null)
      .map((_, index) => (
        <li
          key={index}
          style={{ listStyle: 'none' }}
        >
          done: false metadata: @type:
          type.googleapis.com/google.logging.v2.CopyLogEntriesMetadata progress: 75 request:
          destination: storage.googleapis.com/my-storage-bucket-1 filter: "timestamp
          2021-05-23T10:00:00.0Z" name:
          projects/my-test-project/locations/us-central1/buckets/my-logging-bucket-2
          startTime: 2021-05-23T10:52:40.039751Z state: OPERATION_STATE_RUNNING
        </li>
      ))}
  </ul>
</div>

    </Card>
  );
};

export default ProcessLogs;

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

interface ProcessLogsProps {
  log: string;
}

const ProcessLogs: React.FC<ProcessLogsProps> = ({ log }) => {
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
       {log}
      </div>
    </Card>
  );
};

export default ProcessLogs;

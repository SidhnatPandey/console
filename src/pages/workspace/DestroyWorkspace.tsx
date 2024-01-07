import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from "@mui/icons-material/Delete";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import ConfirmationDialog from "src/component/ConfirmationDialog";

interface DestroyWorkspaceProps {
  loading: boolean;
  onConfirmDestroy: () => void; // Callback for confirming destruction
}

const DestroyWorkspace: React.FC<DestroyWorkspaceProps> = ({ loading, onConfirmDestroy }) => {
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const handleDestroyWorkspace = () => {
    // Open the confirmation dialog
    setConfirmationDialogOpen(true);
  };

  const confirmDestroyWorkspace = () => {
    // Implement any necessary logic on confirmation
    onConfirmDestroy();
    setConfirmationDialogOpen(false);
  };

  return (
    <Card sx={{ margin: '-25px 0 0' }}>
      {loading ? (
        <CircularProgress /> // Replace with your loading/skeleton component
      ) : (
        <CardHeader
          sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
        />
      )}
      <CardContent sx={{ pt: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2)} !important` }}>
        <Grid container spacing={3}>
          {loading ? (
            <CircularProgress /> // Replace with your loading/skeleton component
          ) : (
            <>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5">Destroy</Typography>
                  <Typography variant="body1">Delete Workspace</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '20px', // Adjust spacing as needed
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
                    Destroy Workspace and Associated Apps
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    startIcon={<DeleteIcon />}
                    style={{ backgroundColor: "#FF0000", color: "#FFFFFF" }}
                    onClick={handleDestroyWorkspace}
                  >
                    Destroy
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        onConfirm={confirmDestroyWorkspace}
        onCancel={() => setConfirmationDialogOpen(false)}
        message="Are you sure you want to delete this Workspace?"
      />
    </Card>
  );
};

export default DestroyWorkspace;

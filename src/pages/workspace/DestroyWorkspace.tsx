import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from "@mui/icons-material/Delete";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ConfirmationDialog from "src/component/ConfirmationDialog";
import { deleteWorkspace } from 'src/services/appService';
import router from 'next/router';
import { LOCALSTORAGE_CONSTANTS } from 'src/@core/static/app.constant';
import { AuthContext } from 'src/context/AuthContext';
import useLoading from 'src/hooks/loading';

interface DestroyWorkspaceProps {
  loading: boolean;
  workspaceId: any
}

const DestroyWorkspace: React.FC<DestroyWorkspaceProps> = ({ workspaceId }) => {
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const { loading, startLoading, stopLoading } = useLoading();
  const auth = useContext(AuthContext);

  const handleDestroyWorkspace = () => {
    setConfirmationDialogOpen(true);
  };

  const confirmDestroyWorkspace = () => {
    startLoading();
    deleteWorkspace(workspaceId.id)
      .then(() => {
        setTimeout(() => {
          auth.fetchWorkspaces(null);
          setConfirmationDialogOpen(false);
          removeWorkspace(workspaceId.id);
          const defaultRoute = localStorage.getItem(LOCALSTORAGE_CONSTANTS.homeRoute) || '/';
          router.push(defaultRoute);
          stopLoading();
        }, 3000)
      })
      .catch((error) => {
        console.error("Error deleting workspace:", error);
        setConfirmationDialogOpen(false);
        stopLoading();
      });
  };

  const removeWorkspace = (id: string) => {
    const allWorkspace = auth.workspaces;
    const index = allWorkspace.findIndex(ele => ele.id === id);
    allWorkspace.splice(index, 1)
    auth.setWorkspaces(allWorkspace);
  }

  return (
    <Card sx={{ margin: '-25px 0 0' }}>
      <CardHeader
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
      />
      <CardContent sx={{ pt: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2)} !important` }}>
        <Grid container spacing={3}>
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
                  data-testid="destroy-button"
                  startIcon={<DeleteIcon />}
                  style={{ backgroundColor: "#FF0000", color: "#FFFFFF" }}
                  onClick={handleDestroyWorkspace}
                >
                  Destroy
                </Button>

              </Box>
            </Grid>
          </>
        </Grid>
      </CardContent>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        loading={loading}
        open={isConfirmationDialogOpen}
        onConfirm={confirmDestroyWorkspace}
        onCancel={() => setConfirmationDialogOpen(false)}
        message="Are you sure you want to delete this Workspace?"
      />
    </Card>
  );
};

export default DestroyWorkspace;
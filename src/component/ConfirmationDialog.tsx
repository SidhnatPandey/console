import React from 'react';
import { Dialog, DialogActions, DialogContent, Button, Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: any;
  loading?: boolean
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onConfirm, onCancel, message, loading }) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onCancel} style={{ textAlign: 'center' }}>
      <DialogContent >
        <Typography variant="body1" color="textPrimary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button variant="outlined" color="primary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" sx={{ mr: 2 }} onClick={onConfirm} disabled={loading}>
          {loading && <CircularProgress size="1.2rem" color='secondary' style={{ marginRight: '5px' }} />}
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

import React from 'react';
import { Dialog, DialogActions, DialogContent, Button, Typography } from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onConfirm, onCancel, message }) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onCancel}>
      <DialogContent>
        <Typography variant="body1" color="textPrimary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" sx={{ mr: 2 }} onClick={onConfirm}>
          Yes
        </Button>
        <Button variant="outlined" color="primary" onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

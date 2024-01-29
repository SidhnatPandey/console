import React from 'react';
import { Dialog, DialogActions, DialogContent, Button, Typography, DialogTitle } from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    heading: string;
    message: any;
    onCancel(): void;
}

const AlertDialog = ({ open, heading, message, onCancel }: ConfirmationDialogProps) => {

    return (
        <Dialog fullWidth maxWidth="xs" open={open} onClose={onCancel} style={{ textAlign: 'center' }}>
            <DialogTitle style={{ fontSize: '18px ' }}>
                {heading}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1"  >
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant="contained" color="primary" onClick={onCancel}>
                    ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;

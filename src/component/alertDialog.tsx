import React from 'react';
import { Dialog, DialogActions, DialogContent, Button, Typography, DialogTitle } from '@mui/material';
import { useRouter } from 'next/router';

interface ConfirmationDialogProps {
    open: boolean;
    heading: string;
    message: any;
    onCancel(): void;
}

const AlertDialog = ({ open, heading, message, onCancel }: ConfirmationDialogProps) => {

    const router = useRouter();

    const goToBilling = () => {
        router.push('/billing');
        onCancel();
    }

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
                {/* <Button variant="contained" color="primary" onClick={onCancel}>
                    ok
                </Button> */}
                <Button variant="contained" color="primary" onClick={goToBilling}>
                    Go to Billing
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;

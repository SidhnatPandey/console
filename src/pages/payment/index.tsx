import React, { useContext, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { env } from 'next-runtime-env';
import { LOCALSTORAGE_CONSTANTS } from 'src/@core/static/app.constant';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext } from 'src/context/AuthContext';
const stripePromise = loadStripe(env("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")!);
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { Icon } from "@iconify/react";

interface Props {
    openDialog: boolean,
    handleClose(): void;
}

export default function Payment(props: Props) {

    const { openDialog, handleClose } = props;
    const [clientSecret, setClientSecret] = useState('');
    const authContext = useContext(AuthContext);

    const userInfo = JSON.parse(localStorage.getItem(LOCALSTORAGE_CONSTANTS.userInfo)!);

    useEffect(() => {
        fetch("/api/checkout_sessions", {
            method: "POST",
            body: JSON.stringify({
                email: userInfo.email,
                customer_id: authContext?.org?.customer_id
            })
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    return (
        <Dialog open={openDialog}>
            <DialogTitle id='full-screen-dialog-title'>
                <IconButton
                    aria-label='close'
                    onClick={handleClose}
                    sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
                >
                    <Icon icon='tabler:x' />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div id="checkout" style={{ minHeight: '600px', minWidth: '400px' }}>
                    {!clientSecret && (
                        <>
                            <Skeleton width={350} height={60} style={{ margin: "20px" }} />
                            <Skeleton width={200} height={30} style={{ margin: "20px" }} />
                            <Skeleton width={350} height={70} style={{ margin: "20px" }} />
                            <Skeleton width={350} height={60} style={{ margin: "20px" }} />
                            <Skeleton width={350} height={50} style={{ margin: "20px" }} />
                            <Skeleton width={350} height={60} style={{ margin: "20px" }} />
                            <Skeleton width={350} height={50} style={{ margin: "20px" }} />
                        </>
                    )}
                    {clientSecret && (
                        <EmbeddedCheckoutProvider
                            stripe={stripePromise}
                            options={{ clientSecret }}
                        >
                            <EmbeddedCheckout />
                        </EmbeddedCheckoutProvider>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
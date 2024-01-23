import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { env } from 'next-runtime-env';
import { LOCALSTORAGE_CONSTANTS } from 'src/@core/static/app.constant';

const stripePromise = loadStripe(env("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")!);

export default function App() {
    const [clientSecret, setClientSecret] = useState('');

    const userInfo = JSON.parse(localStorage.getItem(LOCALSTORAGE_CONSTANTS.userInfo)!);

    useEffect(() => {
        fetch("/api/checkout_sessions", {
            method: "POST",
            body: JSON.stringify({
                email: userInfo.email,
                customer_id: 'cus_PQUjR6DfVLlh81'
            })
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    return (
        <div id="checkout">
            {!clientSecret && (
                <h1>Loading...</h1>
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
    )
}
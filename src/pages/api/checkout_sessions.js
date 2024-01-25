import { env } from 'next-runtime-env';
import Stripe from 'stripe';

//const stripe = require('stripe')(env('STRIPE_SECRET_KEY'));

const stripe = new Stripe(env('STRIPE_SECRET_KEY'));

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            try {
                // Create Checkout Sessions from body params.
                const { email, customer_id } = JSON.parse(req.body);
                const obj = {
                    ui_mode: 'embedded',
                    payment_method_types: ['card'],
                    billing_address_collection: 'required',
                    mode: 'setup',
                    return_url:
                        `${req.headers.origin}/billing?session_id={CHECKOUT_SESSION_ID}`,
                }
                if (customer_id) {
                    obj['customer'] = customer_id
                } else {
                    obj['customer_creation'] = 'always'
                    obj['customer_email'] = email
                }
                const session = await stripe.checkout.sessions.create(obj);

                res.send({ clientSecret: session.client_secret });
            } catch (err) {
                res.status(err.statusCode || 500).json(err.message);
            }
            break;
        case "GET":
            try {
                const session =
                    await stripe.checkout.sessions.retrieve(req.query.session_id);

                res.send({
                    status: session.status,
                    customer_email: session.customer_details.email,
                    customer_id: session.customer
                });
            } catch (err) {
                res.status(err.statusCode || 500).json(err.message);
            }
            break;
        default:
            res.setHeader('Allow', req.method);
            res.status(405).end('Method Not Allowed');
    }
}
import { Box, Card, CardContent, Grid, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import PlanDetails from "src/@core/components/plan-details";
import { PricingPlanType } from "src/@core/components/plan-details/types";
import Payment from "../payment";
import { saveCardSession } from "src/services/billingService";
import { useRouter } from "next/navigation";
import Toaster from "src/utils/toaster";
import { getItemFromLocalstorage, removeItemFromLocalstorage, setItemToLocalstorage } from "src/services/locastorageService";
import { LOCALSTORAGE_CONSTANTS } from "src/@core/static/app.constant";
import { AuthContext } from "src/context/AuthContext";

interface Props {
    plans: PricingPlanType[]
    fetchCards(): void;
}

const Plans = (props: Props) => {

    const { plans, fetchCards } = props;
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const router = useRouter();
    const authContext = useContext(AuthContext);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    const upgradePlan = (plan: PricingPlanType) => {
        setItemToLocalstorage(LOCALSTORAGE_CONSTANTS.planId, plan.id);
        setOpenPaymentDialog(true);
    }

    const handleClose = () => {
        setOpenPaymentDialog(false);
    }

    useEffect(() => {
        if (sessionId) { fetchSession() }
    }, [sessionId]);

    const fetchSession = () => {
        fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'complete') {
                    sendData(sessionId, data.customer_id);
                    Toaster.successToast('Process Completed')
                } else {
                    Toaster.errorToast('Process Failed')
                }
            });
    }

    const sendData = (sessionId: string | null, customreId: string) => {
        if (sessionId && customreId) {
            const planId = getItemFromLocalstorage(LOCALSTORAGE_CONSTANTS.planId)!;
            saveCardSession(sessionId, customreId, planId).then(
                () => {
                    fetchCards();
                    authContext.fetchOrg();
                    urlParams.delete("session_id");
                    router.replace('/billing');
                    removeItemFromLocalstorage(LOCALSTORAGE_CONSTANTS.planId);
                }
            )
        }
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ mb: [10, 10], textAlign: 'center' }}>
                    <Typography variant='h4'>Pricing Plans</Typography>
                    <Box sx={{ mt: 2.5, mb: 10.75 }}>
                        <Typography sx={{ color: 'text.secondary' }}>
                            All plans include 40+ advanced tools and features to boost your product.
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>Choose the best plan to fit your needs.</Typography>
                    </Box>
                </Box>
                <Grid container spacing={6} justifyContent="center">
                    {plans?.map((item: PricingPlanType) => (
                        <Grid item xs={12} md={4} key={item.title.toLowerCase()}>
                            <PlanDetails plan={'monthly'} data={item} handleUpgrade={upgradePlan} />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
            <Payment openDialog={openPaymentDialog} handleClose={handleClose}></Payment>
        </Card >
    )
}

export default Plans;
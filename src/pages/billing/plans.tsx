import { Box, Card, CardContent, Grid, Typography } from "@mui/material"
import { useRouter } from "next/navigation";
import { useState } from "react";
import PlanDetails from "src/@core/components/plan-details";
import { PricingPlanType } from "src/@core/components/plan-details/types";
import { setApiBaseUrl } from "src/@core/services/interceptor";
import { APP_API } from "src/@core/static/api.constant";
import { getFetcher } from "src/services/fetcherService";
import { toTitleCase } from "src/utils/stringUtils";
import useSWR from "swr";

const Plans = () => {

    const router = useRouter();

    const pricingPlans: PricingPlanType[] = [
        {
            imgWidth: 140,
            imgHeight: 140,
            title: 'Developer',
            monthlyPrice: 0,
            currentPlan: true,
            popularPlan: false,
            subtitle: 'A simple start for everyone',
            imgSrc: '/images/pages/pricing-plan-basic.png',
            yearlyPlan: {
                perMonth: 0,
                totalAnnual: 0
            },
            planBenefits: [
                '100 responses a month',
                'Unlimited forms and surveys',
                'Unlimited fields',
                'Basic form creation tools',
                'Up to 2 subdomains'
            ]
        },
        {
            imgWidth: 140,
            imgHeight: 140,
            monthlyPrice: 49,
            title: 'Startup',
            popularPlan: true,
            currentPlan: false,
            subtitle: 'For small to medium businesses',
            imgSrc: '/images/pages/pricing-plan-standard.png',
            yearlyPlan: {
                perMonth: 40,
                totalAnnual: 480
            },
            planBenefits: [
                'Unlimited responses',
                'Unlimited forms and surveys',
                'Instagram profile page',
                'Google Docs integration',
                'Custom “Thank you” page'
            ]
        },
        {
            imgWidth: 140,
            imgHeight: 140,
            monthlyPrice: 99,
            popularPlan: false,
            currentPlan: false,
            title: 'Enterprise',
            subtitle: 'Solution for big organizations',
            imgSrc: '/images/pages/pricing-plan-enterprise.png',
            yearlyPlan: {
                perMonth: 80,
                totalAnnual: 960
            },
            planBenefits: [
                'PayPal payments',
                'Logic Jumps',
                'File upload with 5GB storage',
                'Custom domain support',
                'Stripe integration'
            ]
        }
    ]

    const [plans, setPlans] = useState<PricingPlanType[]>();

    const key = APP_API.getPlans;
    setApiBaseUrl('billing');
    const { data } = useSWR(key, getFetcher, {
        onSuccess: () => {
            const plans: any = [];
            data.data.forEach((plan: any, index: number) => {
                const descriptionArr = plan.description.split('\n');
                const desc = descriptionArr.shift();
                const obj = {
                    title: toTitleCase(plan.plan_name),
                    subtitle: desc,
                    currentPlan: index === 0 ? true : false,
                    popularPlan: index === 1 ? true : false,
                    monthlyPrice: plan.plan_price,
                    planBenefits: descriptionArr
                }
                plans.push(obj);
            })
            setPlans(plans);
        }
    });

    const upgradePlan = (plan: PricingPlanType) => {
        console.log(plan);
        router.push('/payment');
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ mb: [10, 17.5], textAlign: 'center' }}>
                    <Typography variant='h4'>Pricing Plans</Typography>
                    <Box sx={{ mt: 2.5, mb: 10.75 }}>
                        <Typography sx={{ color: 'text.secondary' }}>
                            All plans include 40+ advanced tools and features to boost your product.
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>Choose the best plan to fit your needs.</Typography>
                    </Box>
                </Box>
                <Grid container spacing={6}>
                    {plans?.map((item: PricingPlanType) => (
                        <Grid item xs={12} md={4} key={item.title.toLowerCase()}>
                            <PlanDetails plan={'monthly'} data={item} handleUpgrade={upgradePlan} />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default Plans;
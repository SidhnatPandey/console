import { SyntheticEvent, useContext, useEffect, useState } from "react";
import PaymentMethod from "./paymentMethod";
import Plans from "./plans";

import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList, { TabListProps } from '@mui/lab/TabList';
import AppsIcon from "@mui/icons-material/Apps";
import { getCards } from "src/services/billingService";
import { AuthContext } from "src/context/AuthContext";
import usePlan from "src/hooks/plan";

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
    borderBottom: "0 !important",
    "& .MuiTabs-indicator": {
        display: "none",
    },
    "& .Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        color: `${theme.palette.common.white} !important`,
    },
    "& .MuiTab-root": {
        lineHeight: 1,
        borderRadius: theme.shape.borderRadius,
    },
}));

export interface CardType {
    id: string,
    billing_details: {
        address: {
            city: string,
            country: string,
            line1: string,
            line2: string,
            postal_code: string,
            state: string
        },
        email: string,
        name: string,
        phone: string
    },
    card: {
        brand: string,
        country: string,
        exp_month: number,
        exp_year: number,
        last4: string
    },
    created: number,
    Default: boolean
}

const Billing = () => {

    const [value, setValue] = useState<string>('1');
    const [cards, setCards] = useState<CardType[]>([]);
    const authContext = useContext(AuthContext);
    const plan = usePlan();

    const fetchCards = () => {
        getCards().then(
            response => {
                setCards(response?.data);
            }
        )
    }

    useEffect(() => {
        fetchCards();
        plan.fetchPlans();
    }, [authContext.org])

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    return (
        <TabContext value={value}>
            <TabList onChange={handleChange} aria-label='customized tabs example'>
                <Tab value='1' label='Plans' icon={<AppsIcon />} iconPosition="start" />
                <Tab value='2' label='Invoices' />
            </TabList>
            <TabPanel value='1' sx={{ p: '20px 0px' }}>
                <Plans plans={plan.userPlans()} fetchCards={fetchCards} />
                <br />
                {plan.planTier() > 1 && <PaymentMethod cards={cards} fetchCards={fetchCards} customerId={authContext?.org?.customer_id}></PaymentMethod>}
            </TabPanel>
            <TabPanel value='2' sx={{ p: '20px 0px' }}>
                <Typography>
                    Chocolate bar carrot cake candy canes sesame snaps. Cupcake pie gummi bears jujubes candy canes. Chupa chups
                    sesame snaps halvah.
                </Typography>
            </TabPanel>
        </TabContext>
    )
}

export default Billing;
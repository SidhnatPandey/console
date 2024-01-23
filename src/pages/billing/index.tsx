import { SyntheticEvent, useState } from "react";
import PaymentMethod from "./paymentMethod";
import Plans from "./plans";

import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList, { TabListProps } from '@mui/lab/TabList';
import AppsIcon from "@mui/icons-material/Apps";

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

const Billing = () => {

    const [value, setValue] = useState<string>('1')

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
                <Plans />
                <br />
                {/* <PaymentMethod></PaymentMethod> */}
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
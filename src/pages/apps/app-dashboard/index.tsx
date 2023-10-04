import { Card, Grid, Typography } from "@mui/material"
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import { styled } from '@mui/material/styles'

//icons
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StackedBarChartOutlinedIcon from '@mui/icons-material/StackedBarChartOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import SettingsIcon from '@mui/icons-material/Settings';
import InsightsIcon from '@mui/icons-material/Insights';
import AppsIcon from '@mui/icons-material/Apps';

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'


import Link from "next/link";
import { SyntheticEvent, useState } from "react"
import AppSummary from "./AppSummay"
import ProcessTile from "../app-dashboard/ProcessTile"

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius
  }
}))

const AppDashboardHome = () => {

  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  /* uit:create-dashboard */

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
        data-testid="card"
      >
        <span>
          <Icon
            icon={'uit:create-dashboard'}
            style={{
              fontSize: '120px',
              margin: '20px',
              background: 'rgba(101, 91, 211, 0.2)',
            }}
            rotate={3}
          />
        </span>
        <span style={{ marginTop: '3.5rem' }}>
          <h1 style={{ marginBottom: '0' }} data-testid="title">
            Hello World
          </h1>
          <span className="mr-2">
            {' '}
            <StackedBarChartOutlinedIcon className="icon-bottom" />
            <b> Current Stage : QA </b>
          </span>
          <span className="mr-2">
            {' '}
            <CheckCircleIcon className="icon-bottom" color="success" /> Running
          </span>
          <span className="mr-2">
            {' '}
            <LocationOnOutlinedIcon className="icon-bottom" />
            <Link href={'abc.com'} style={{ color: '#655bd3' }}>
              {' '}
              https://hello-world.init.run{' '}
            </Link>
          </span>
        </span>
      </Card>

      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="customized tabs example"
          style={{ margin: '1.5rem 0' }}
          data-testid="tab-list"
        >
          <Tab value="1" label="Overview" icon={<AppsIcon />} iconPosition="start" data-testid="tab-1" />
          <Tab value="2" label="Insights" icon={<InsightsIcon />} iconPosition="start" data-testid="tab-2" />
          <Tab value="3" label="Logs" icon={<GridViewIcon />} iconPosition="start" data-testid="tab-3" />
          <Tab value="4" label="Settings" icon={<SettingsIcon />} iconPosition="start" data-testid="tab-4" />
        </TabList>
        <TabPanel value="1" sx={{ p: 0 }} data-testid="tab-panel-1">
          <AppSummary data-testid="app-summary" />
          <br />
          <ProcessTile data-testid="process-tile" />
        </TabPanel>
        <TabPanel value="2" data-testid="tab-panel-2">
          <Typography>
            Chocolate bar carrot cake candy canes sesame snaps. Cupcake pie gummi bears jujubes candy canes. Chupa chups
            sesame snaps halvah.
          </Typography>
        </TabPanel>
        <TabPanel value="3" data-testid="tab-panel-3">
          <Typography>
            Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa chups. Macaroon ice cream tootsie roll
            carrot cake gummi bears.
          </Typography>
        </TabPanel>
        <TabPanel value="4" data-testid="tab-panel-4">
          <Typography>
            Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa chups. Macaroon ice cream tootsie roll
            carrot cake gummi bears.
          </Typography>
        </TabPanel>
      </TabContext>

    </>
  )
}

export default AppDashboardHome
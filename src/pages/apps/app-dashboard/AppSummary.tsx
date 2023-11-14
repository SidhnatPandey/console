// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Skeleton from 'react-loading-skeleton';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useEffect, useState } from 'react'
import { matrixData } from 'src/services/dashboardService'

interface Matrix {
  CPUPercentage: string,
  MemoryRequestMB: string,
  MemoryUsageMB: string,
  NetworkReceiveBytes: string,
  NetworkTransmitBytes: string,
}

interface AppSummaryProps {
  loading: boolean,
  appName: string | undefined,
  metricsTimer: number
}

const AppSummary: React.FC<AppSummaryProps> = ({ loading, appName, metricsTimer }) => {

  const [matrix, setMatrix] = useState<Matrix>();
  useEffect(() => {
    if (appName) {
      matrixData(appName).then(
        (response) => {
          setMatrix(response?.data);
        })
      const metricsIntervalId = setInterval(() => {
        matrixData(appName).then(
          (response) => {
            setMatrix(response?.data);
          })
      }, metricsTimer); // Call every 60 seconds (adjust as needed)
      return () => clearInterval(metricsIntervalId);
    }
  }, [appName])
  return (
    <Card>
      {loading ? <Skeleton width={200} height={20} style={{ margin: "20px" }} /> : <CardHeader
        title='App Summary'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
        action={
          <Typography variant='body2' data-testid="updated-time" sx={{ color: 'text.disabled' }}>
            Updated {(metricsTimer) / 1000} seconds ago
          </Typography>
        }
      />}
      <CardContent sx={{ pt: theme => `${theme.spacing(7)} !important` }}>
        <Grid container spacing={6}>
          {loading ? <Skeleton width={300} height={40} style={{ marginLeft: "20px" }} count={4} inline /> : <>
            <Grid item xs={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomAvatar skin='light' color="primary" sx={{ mr: 4, width: 42, height: 42 }}>
                  <Icon icon="tabler:chart-pie-2" />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h5'>3 / 6</Typography>
                  <Typography variant='body1'>Instances/Auto Scale</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomAvatar skin='light' color="info" sx={{ mr: 4, width: 42, height: 42 }}>
                  <Icon icon="ph:cpu-bold" />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h5'>{matrix?.CPUPercentage ? (Number(matrix?.CPUPercentage) * 100).toFixed(2) : "?"} %</Typography>
                  <Typography variant='body1'>CPU</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomAvatar skin='light' color="error" sx={{ mr: 4, width: 42, height: 42 }}>
                  <Icon icon="icon-park-outline:memory-one" />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h5'>
                    {matrix?.MemoryUsageMB ? Number(matrix?.MemoryUsageMB).toFixed(2) : "?"} / {matrix?.MemoryRequestMB ? Number(matrix?.MemoryRequestMB).toFixed(2) : "?"}</Typography>
                  <Typography variant='body1'>Memory/Request (MB)</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomAvatar skin='light' color="success" sx={{ mr: 4, width: 42, height: 42 }}>
                  <Icon icon="ooui:network" />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h5'>
                    {matrix?.NetworkReceiveBytes ? Number(matrix?.NetworkReceiveBytes).toFixed(2) : "?"} / {matrix?.NetworkTransmitBytes ? Number(matrix?.NetworkTransmitBytes).toFixed(2) : "?"}</Typography>
                  <Typography variant='body1'>N/W Receive/Transmit (B/s)</Typography>
                </Box>
              </Box>
            </Grid>
          </>}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AppSummary

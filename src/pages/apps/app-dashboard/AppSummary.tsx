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

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useDeferredValue, useEffect, useState } from 'react'
import { matrixData } from 'src/services/dashboardService'

interface DataType {
  icon: string
  stats: string
  title: string
  color: ThemeColor
}

interface Matrix {
  CPUPercentage: string,
  MemoryRequestMB: string,
  MemoryUsageMB: string,
  NetworkReceiveBytes: string,
  NetworkTransmitBytes: string,
}

const data: DataType[] = [
  {
    stats: '? / ?',
    title: 'Instances/Auto Scale',
    color: 'primary',
    icon: 'tabler:chart-pie-2'
  },
  {
    color: 'info',
    stats: '? %',
    title: 'CPU',
    icon: 'ph:cpu-bold'
  },
  {
    color: 'error',
    stats: '?/? GB',
    title: 'Memory/Allocated',
    icon: 'icon-park-outline:memory-one'
  },
  {
    stats: '?/? GB',
    color: 'success',
    title: 'Disk/Allocated',
    icon: 'material-symbols:database-outline'
  }
]

const renderStats = () => {
  return data.map((sale: DataType, index: number) => (
    <Grid item xs={6} md={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin='light' color={sale.color}  data-testid="custom-avatar" sx={{ mr: 4, width: 42, height: 42 }}>
          <Icon icon={sale.icon}  />
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h5'  data-testid="statistic">{sale.stats}</Typography>
          <Typography variant='body2' data-testid="title" >{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

interface AppSummaryProps {
  loading: boolean,
  appName: string | undefined
}

const AppSummary: React.FC<AppSummaryProps> = ({ loading, appName }) => {

  const [matrix, setMatrix] = useState<Matrix>();
  useEffect(() => {
    if (appName) {
      matrixData(appName).then(
        (response) => {
          setMatrix(response?.data);
        })
    }
  }, [appName])
  return (
    <Card>
      {loading ? <Skeleton width={200} height={20} style={{ margin: "20px" }} /> : <CardHeader
        title='App Summary'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
        action={
          <Typography variant='body2'data-testid="updated-time" sx={{ color: 'text.disabled' }}>
            Updated 1 minute ago
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
                  <Typography variant='h5'>? / ?</Typography>
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
                  <Typography variant='body1'>Memory/Allocated (MB)</Typography>
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

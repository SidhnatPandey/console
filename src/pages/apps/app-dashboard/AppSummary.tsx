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

interface DataType {
  icon: string
  stats: string
  title: string
  color: ThemeColor
}

const data: DataType[] = [
  {
    stats: '1 / 2',
    title: 'Instances/Auto Scale',
    color: 'primary',
    icon: 'tabler:chart-pie-2'
  },
  {
    color: 'info',
    stats: '1 %',
    title: 'CPU',
    icon: 'ph:cpu-bold'
  },
  {
    color: 'error',
    stats: '0.7/1 GB',
    title: 'Memory/Allocated',
    icon: 'icon-park-outline:memory-one'
  },
  {
    stats: '1.4/2 GB',
    color: 'success',
    title: 'Disk/Allocated',
    icon: 'material-symbols:database-outline'
  }
]

const renderStats = () => {
  return data.map((sale: DataType, index: number) => (
    <Grid item xs={6} md={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
          <Icon icon={sale.icon} />
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h5'>{sale.stats}</Typography>
          <Typography variant='body2'>{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

interface AppSummaryProps {
  loading: boolean
}

const AppSummary: React.FC<AppSummaryProps> = ({ loading }) => {
  return (
    <Card>
      {loading ? <Skeleton width={200} height={20} style={{ margin: "20px" }} /> : <CardHeader
        title='App Summary'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
        action={
          <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            Updated 1 minute ago
          </Typography>
        }
      />}
      <CardContent sx={{ pt: theme => `${theme.spacing(7)} !important` }}>
        <Grid container spacing={6}>
          {loading ? <Skeleton width={300} height={40} style={{ marginLeft: "20px" }} count={4} inline /> : renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AppSummary

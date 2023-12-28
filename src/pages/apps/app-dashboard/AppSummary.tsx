import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';
import Icon from 'src/@core/components/icon';
import CustomAvatar from 'src/@core/components/mui/avatar';
import { APP_API } from 'src/@core/static/api.constant';
import { getFetcher } from 'src/services/fetcherService';
import { setApiBaseUrl } from 'src/@core/services/interceptor';

interface Matrix {
  CurrentInstance: string;
  MaxInstance: string;
  CPUPercentage: string;
  MemoryRequestMB: string;
  MemoryUsageMB: string;
  MemoryLimitMB: string;
  NetworkReceiveBytes: string;
  NetworkTransmitBytes: string;
}

interface AppSummaryProps {
  loading: boolean;
  appName: string | undefined;
  metricsTimer: number;
}

const AppSummary: React.FC<AppSummaryProps> = ({ loading, appName, metricsTimer }) => {

  let key = appName ? APP_API.appMatrix : undefined;
  if (appName) { key = key?.replace('{appName}', appName); }
  setApiBaseUrl();
  const { data: matrix } = useSWR<Matrix>(key, getFetcher);

  return (
    <Card>
      {loading ? (
        <Skeleton width={200} height={20} style={{ margin: '20px' }} />
      ) : (
        <CardHeader
          title="App Summary"
          sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
          action={
            <Typography variant="body2" data-testid="updated-time" sx={{ color: 'text.disabled' }}>
              Updated {(metricsTimer) / 1000} seconds ago
            </Typography>
          }
        />
      )}
      <CardContent sx={{ pt: (theme) => `${theme.spacing(7)} !important` }}>
        <Grid container spacing={6}>
          {loading ? (
            <Skeleton width={300} height={40} style={{ marginLeft: '20px' }} count={4} inline />
          ) : (
            <>
              <Grid item xs={6} md={3} data-testid="instances-count">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin="light" color="primary" sx={{ mr: 4, width: 42, height: 42 }}>
                    <Icon icon="tabler:chart-pie-2" />
                  </CustomAvatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5">{matrix?.CurrentInstance ?? '?'}/{matrix?.MaxInstance ?? '?'}</Typography>
                    <Typography variant="body1">Instances/Auto Scale</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={3} data-testid="cpu-percentage">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin="light" color="info" sx={{ mr: 4, width: 42, height: 42 }}>
                    <Icon icon="ph:cpu-bold" />
                  </CustomAvatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5">{matrix?.CPUPercentage ? (Number(matrix?.CPUPercentage)).toFixed(2) : '?'}</Typography>
                    <Typography variant="body1">CPU</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={3} data-testid="memory-usage">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin="light" color="error" sx={{ mr: 4, width: 42, height: 42 }}>
                    <Icon icon="icon-park-outline:memory-one" />
                  </CustomAvatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5">
                      {matrix?.MemoryUsageMB ? Number(matrix?.MemoryUsageMB).toFixed(2) : '?'} / {matrix?.MemoryRequestMB ? Number(matrix?.MemoryRequestMB).toFixed(2) : '?'} / {matrix?.MemoryLimitMB ? Number(matrix?.MemoryLimitMB).toFixed(2) : '?'}
                    </Typography>
                    <Typography variant="body1">Mem Curr/Req/Limit (MB)</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={3} data-testid="network-usage">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin="light" color="success" sx={{ mr: 4, width: 42, height: 42 }}>
                    <Icon icon="ooui:network" />
                  </CustomAvatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5">
                      {matrix?.NetworkReceiveBytes ? Number(matrix?.NetworkReceiveBytes).toFixed(2) : '?'} / {matrix?.NetworkTransmitBytes ? Number(matrix?.NetworkTransmitBytes).toFixed(2) : '?'}
                    </Typography>
                    <Typography variant="body1">N/W Receive/Transmit (B/s)</Typography>
                  </Box>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AppSummary;

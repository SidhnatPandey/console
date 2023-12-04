import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Skeleton from 'react-loading-skeleton';
import DeleteIcon from '@mui/icons-material/Delete';

interface DestroyAppProps {
    loading: boolean;
    appName?: string;
    metricsTimer?: number;
}

const DestroyApp: React.FC<DestroyAppProps> = ({ loading, appName, metricsTimer }) => {
    return (
        <Card sx={{ margin: '-25px' }}>
            {loading ? (
                <Skeleton width={200} height={20} style={{ margin: "20px" }} />
            ) : (
                <CardHeader
                    title='App Settings'
                    sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
                />
            )}
            <CardContent sx={{ pt: (theme) => `${theme.spacing(7)} !important` }}>
                <Grid container spacing={3}>
                    {loading ? (
                        <Skeleton width={300} height={40} style={{ marginLeft: "20px" }} count={3} inline />
                    ) : (
                        <>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant='h5'>Destroy</Typography>
                                    <Typography variant='body1'>Delete App</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: '20px', // Adjust spacing as needed
                                    }}
                                >
                                    <Typography variant='body1' sx={{ whiteSpace: 'nowrap' }}>
                                        Destroy App and Associated Components
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Button
                                        startIcon={<DeleteIcon />}
                                        style={{ backgroundColor: '#FF0000', color: '#FFFFFF' }}
                                    >
                                        Destroy
                                    </Button>
                                </Box>
                            </Grid>
                        </>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default DestroyApp;

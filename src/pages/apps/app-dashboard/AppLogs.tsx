import { useEffect, useState } from "react";
import { getAppLogs } from "src/services/dashboardService";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import Skeleton from 'react-loading-skeleton';
import { styled } from '@mui/material/styles'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import { Input, TextField } from "@mui/material";


interface AppLogsProps {
    appName: string | undefined,
}

interface LogsData {
    run_name: string;
    log: string;
}

interface ProcessLogsProps {
    steps: Step[] | undefined;
    loading: boolean;
    tabHeading: string;
}

interface Step {
    log: string;
    run_name: string;
    status?: string;
}

// Styled TabList component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
    borderRight: 0,
    '& .MuiTabs-indicator': {
        display: 'none'
    },
    '& .Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: `${theme.palette.common.white} !important`
    },
    '& .MuiTab-root': {
        lineHeight: 1,
        margin: theme.spacing(0.5, 0),
        borderRadius: theme.shape.borderRadius
    }
}))

const AppLogs: React.FC<AppLogsProps> = ({ appName }) => {

    const [value, setValue] = useState<string>("1");
    const [logs, setLogs] = useState<string[]>([]);
    const [tabName, setTabName] = useState<string>("Prod");
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (appName) { getLogs(tabName) }
    }, [appName])

    const getLogs = (step: string) => {
        if (appName) {
            getAppLogs(appName, step).then((res) => {
                if (res && res.data) {
                    setLogs(res.data.log.split('\n'));
                }
            });
        }
    };

    const handleTabChange = (step: string, index: number) => {
        setValue(index.toString());
        setTabName((preStep) => { return step });
        getLogs(step);
    };

    const highlightText = (text: string, highlight: string) => {
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => (
                    <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { backgroundColor: '#f9f9ad', color: 'black' } : { fontWeight: 'normal' }}>
                        {part}
                    </span>
                ))}
            </span>
        );
    };

    const handleSearchChange = (e: any) => {
        setSearchTerm(e.target.value);
    };

    return (
        <Card sx={{ height: "auto", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ padding: "10px", flex: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={2} textAlign="center" marginLeft={"-5px"}>
                        <Typography variant="h4">
                            <b>Environments</b>
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h4">
                            <b style={{ textTransform: 'capitalize' }}>{tabName} Logs</b>
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField label="Search" size="small" variant="outlined" value={searchTerm} onChange={handleSearchChange} fullWidth />
                    </Grid>
                </Grid>
            </CardContent>

            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Box
                        sx={{
                            paddingLeft: '10px'
                        }}
                    >
                        {loading ? <Skeleton width={100} height={20} /> :
                            <TabContext value={value}>
                                <TabList
                                    orientation="vertical"
                                    aria-label="vertical tabs example"
                                >
                                    <Tab value='1' label='Prod' onClick={() => handleTabChange('Prod', 1)} />
                                    <Tab value='2' label='Stg' onClick={() => handleTabChange('Stg', 2)} />
                                    <Tab value='3' label='Test' onClick={() => handleTabChange('Test', 3)} />
                                </TabList>
                            </TabContext>}
                    </Box>
                </Grid>
                <Grid item xs={10}>
                    <div className="scroll-container2" style={{
                        height: '400px',
                        backgroundColor: 'black',
                        color: 'white',
                        width: '100%',
                        overflow: 'auto',
                        padding: '10px',
                    }}>
                        {!loading && logs.map((log, index) => {
                            return <p style={{ color: 'white', margin: 0, fontFamily: "monospace", whiteSpace: "pre-wrap" }} key={index}>{highlightText(log, searchTerm)}</p>
                        })}
                        {loading && <Skeleton width={600} height={10} />}
                        {loading && <Skeleton width={400} height={10} />}
                        {loading && <Skeleton width={800} height={10} />}
                        {loading && <Skeleton width={500} height={10} />}
                        {loading && <Skeleton width={600} height={10} />}
                        {loading && <Skeleton width={300} height={10} />}
                        {loading && <Skeleton width={400} height={10} />}
                        {loading && <Skeleton width={800} height={10} />}
                        {loading && <Skeleton width={600} height={10} />}
                        {loading && <Skeleton width={400} height={10} />}
                        {loading && <Skeleton width={800} height={10} />}
                        {loading && <Skeleton width={500} height={10} />}
                        {loading && <Skeleton width={600} height={10} />}
                        {loading && <Skeleton width={300} height={10} />}
                        {loading && <Skeleton width={400} height={10} />}
                        {loading && <Skeleton width={800} height={10} />}
                    </div>
                </Grid>
            </Grid>
        </Card>
    );
}

export default AppLogs;
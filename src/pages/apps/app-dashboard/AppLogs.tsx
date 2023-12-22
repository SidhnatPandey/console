import { Key, useEffect, useRef, useState } from "react";
import { getAppLogs } from "src/services/dashboardService";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { styled } from '@mui/material/styles'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import { TextField } from "@mui/material";
import useSWR from 'swr';
import { APP_API } from "src/@core/static/api.constant";

interface AppLogsProps {
  appId: string,
}

// Styled TabList component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderRight: 0,
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  "& .MuiTab-root": {
    lineHeight: 1,
    margin: theme.spacing(0.5, 0),
    borderRadius: theme.shape.borderRadius,
  },
}));

const AppLogs: React.FC<AppLogsProps> = ({ appId }) => {
  const [value, setValue] = useState<string>("1");
  const [tabName, setTabName] = useState<string>("Prod");
  const [searchTerm, setSearchTerm] = useState('');

  // Ref for the scroll container
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // creating the url for getting the logs
    let key = APP_API.appLogs;
    key = key.replace('{appId}', appId);
    key = key + tabName.toLowerCase();
    const { data } = useSWR(key, getAppLogs);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scroll({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [data]);

  const handleTabChange = (step: string, index: number) => {
    setValue(index.toString());
    setTabName(() => { return step });
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
            <TabContext value={value}>
              <TabList
                orientation="vertical"
                aria-label="vertical tabs example"
              >
                <Tab value='1' label='Prod' onClick={() => handleTabChange('Prod', 1)} />
                <Tab value='2' label='Stg' onClick={() => handleTabChange('Stg', 2)} />
                <Tab value='3' label='Test' onClick={() => handleTabChange('Test', 3)} />
              </TabList>
            </TabContext>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <div className="scroll-container-logs" ref={scrollContainerRef} style={{
            height: '500px',
            backgroundColor: 'black',
            color: 'white',
            width: '100%',
            overflow: 'auto',
            padding: '10px',
          }}>
            {
              data?.data?.data?.log?.split('\n').map((log: string, index: Key | null | undefined) => (
                <p style={{ color: 'white', margin: 0, fontFamily: "monospace", whiteSpace: "pre-wrap" }} key={index}>
                  {highlightText(log, searchTerm)}
                </p>
              ))
            }
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AppLogs;
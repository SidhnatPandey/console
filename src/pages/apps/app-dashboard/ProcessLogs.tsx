import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PendingIcon from "@mui/icons-material/Pending";
import LoopIcon from "@mui/icons-material/Loop";
import CustomAvatar from "src/@core/components/mui/avatar";
import Icon from "src/@core/components/icon";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import Skeleton from 'react-loading-skeleton';
import { styled } from '@mui/material/styles'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import { Input, TextField } from "@mui/material";

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

const ProcessLogs: React.FC<ProcessLogsProps> = ({ steps, loading, tabHeading }) => {

  const [value, setValue] = useState<string>("0");
  const [logs, setLogs] = useState<string[]>([]);
  const [tabName, setTabName] = useState<string>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  const icon = (status: string | undefined) => {
    if (status) {
      const lstatus = status.toLowerCase();
      switch (lstatus) {
        case "succeeded":
          return (
            <CustomAvatar
              skin="light"
              color={"success"}
              sx={{
                marginTop: 1,
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
              }}
              style={{ marginRight: 10 }}
            >
              <Icon icon={"ph:check-light"} style={{ fontSize: '1rem', padding: '1px 0 0 1px' }} />
            </CustomAvatar>
          );
        case "inprogress":
          return (
            <>
              <LoopIcon
                style={{ animation: "spin 4s linear infinite", marginLeft: "5px" }}

                color="primary"
                fontSize="medium"
              />
              <style>
                {`
              @keyframes spin {
                0% { transform: rotate(360deg); }
                100% { transform: rotate(0deg); }
              }`}
              </style>
            </>
          );
        case "waiting":
          return (
            <PendingIcon fontSize="medium" style={{ color: "rgb(85, 85, 85)" }} />
          );
        case "failed":
          return <ErrorOutlineIcon fontSize="medium" style={{ color: "red" }} />;
        default:
          return <HelpOutlineIcon fontSize="medium" style={{ color: "rgb(85, 85, 85)" }} />
      }
    }
  };

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const cStage = localStorage.getItem('cStage') || '';
    if (steps && steps.length > 0 && steps[0].log) {
      if ((selectedStage === '') || (cStage != selectedStage)) {
        setValue("0");
        setLogs(steps[0].log.split('\n'));
        setTabName(steps[0].run_name);
        setSelectedStage(cStage);
      }
    } else {
      setLogs([]);
    }
  }, [steps, loading]);

  const handleTabChange = (step: Step, index: number) => {
    setValue(index.toString());
    setLogs(step.log.split('\n'));
    setTabName(step.run_name);
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

  return (
    <Card sx={{ height: "auto", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ padding: "10px", flex: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={2} textAlign="center" marginLeft={"-5px"}>
            <Typography variant="h4">
              <b>{tabHeading}</b>
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
                  {steps?.map((step, index) => {
                    return (
                      <Tab
                        iconPosition="end"
                        value={index.toString()}
                        // label={step.run_name.length > 9 ? step.run_name.substring(0, 8) + "..." : step.run_name}
                        label={step.run_name}
                        key={index}
                        onClick={() => handleTabChange(step, index)}
                        icon={icon(step?.status)}
                      />
                    );
                  })}
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
};

export default ProcessLogs;

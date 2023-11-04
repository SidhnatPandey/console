import { Card, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import { styled } from "@mui/material/styles";

//icons
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StackedBarChartOutlinedIcon from "@mui/icons-material/StackedBarChartOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
import SettingsIcon from "@mui/icons-material/Settings";
import InsightsIcon from "@mui/icons-material/Insights";
import AppsIcon from "@mui/icons-material/Apps";
import Skeleton from "react-loading-skeleton";

// ** Custom Components Imports
import Icon from "src/@core/components/icon";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingIcon from "@mui/icons-material/Pending";
import LoopIcon from "@mui/icons-material/Loop";
import CustomAvatar from "src/@core/components/mui/avatar";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { SyntheticEvent, useEffect, useState } from "react";
import AppSummary from "./AppSummary";
import AppCreationFlow from "./AppCreationFlow";
import { supplyChainRuns } from "src/services/dashboardService";
import { useRouter } from "next/router";
import { appDetails } from "src/services/appService";
import { env } from "next-runtime-env";
import "react-loading-skeleton/dist/skeleton.css";

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

interface App {
  application_name: string;
  git_branch: string;
  git_repo: string;
  git_user: string;
  env_variables: { Key: string; Value: string }[];
  id: string;
  port: number;
  stage: string;
  status: string;
  http_path: string;
  description: string;
  url: string
  last_deployed: string
}

const AppDashboard = () => {
  const router = useRouter();
  const timer = Number(env("NEXT_PUBLIC_APP_DASHBOARD_REFRESH_TIMER")) || 60000;

  //states
  const [value, setValue] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(true);
  const [supplyChainRunData, setSupplyChainRunData] = useState<any>(null); // State to hold the fetched data
  const [appData, setAppData] = useState<App>(); // State to hold the fetched data

  useEffect(() => {
    if (router?.query?.appId) {
      getAppDetails(router?.query?.appId);
      getSupplyChainRun(router?.query?.appId);
    }
    const intervalId = setInterval(() => {
      getSupplyChainRun(router.query.appId);
    }, timer); // Call every 60 seconds (adjust as needed)
    return () => clearInterval(intervalId);
  }, [router]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleTriggerFromChild = () => {
    getAppDetails(router?.query?.appId);
    getSupplyChainRun(router?.query?.appId);
  }

  const getAppDetails = (id: any) => {
    appDetails(id)
      .then((response: any) => {
        setAppData(response.data);
        //setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const getSupplyChainRun = (id: any) => {
    supplyChainRuns(id)
      .then((response: any) => {
        setSupplyChainRunData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const getIcon = (status: string | undefined) => {
    if (status) {
      const lstatus = status.toLowerCase();
      switch (lstatus) {
        case "succeeded":
          return (
            <CustomAvatar
              skin="light"
              color={"success"}
              sx={{
                width: 20,
                height: 20,
                display: "inline-block",
                marginBottom: -1,
              }}
            >
              <Icon icon={"ph:check-light"} />
            </CustomAvatar>
          );
        case "inprogress":
          return (
            <>
              <LoopIcon
                style={{
                  animation: "spin 4s linear infinite",
                  marginLeft: "5px",
                  marginBottom: "-5px",
                }}
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
            <PendingIcon
              fontSize="medium"
              style={{ color: "rgb(85, 85, 85)", marginBottom: "-5px" }}
            />
          );
        case "failed":
          return (
            <ErrorOutlineIcon
              fontSize="medium"
              style={{ color: "red", marginBottom: "-5px" }}
            />
          );
        default:
          return (
            <HelpOutlineIcon
              fontSize="medium"
              style={{ color: "rgb(85, 85, 85)", marginBottom: "-5px" }}
            />
          );
      }
    } else {
      return (
        <HelpOutlineIcon
          fontSize="medium"
          style={{ color: "rgb(85, 85, 85)", marginBottom: "-5px" }}
        />
      );
    }
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
        data-testid="card"
      >
        <span>
          {loading ? (
            <Skeleton
              width={120}
              height={120}
              style={{ margin: "20px" }}
              inline
            />
          ) : (
            <Icon
              icon={"uit:create-dashboard"}
              style={{
                fontSize: "120px",
                margin: "20px",
                background: "rgba(101, 91, 211, 0.2)",
              }}
              rotate={3}

            />
          )}
        </span>
        <span style={{ marginTop: "3.5rem" }}>
          <h1 style={{ marginBottom: "0" }} data-testid="title">
            {loading ? <Skeleton /> : appData?.application_name || "N/A"}
          </h1>
          {loading ? (
            <Skeleton
              width={400}
              height={20}
              style={{ marginBottom: "35px" }}
            />
          ) : (
            <>
              <span style={{ marginTop: "3.5rem" }}>
                {loading ? (
                  <Skeleton
                    width={400}
                    height={20}
                    style={{ marginBottom: "35px" }}
                  />
                ) : (
                  <>
                    <span className="mr-2">
                      {" "}
                      <StackedBarChartOutlinedIcon className="icon-bottom" data-testid="stage-icon" />
                      <b data-testid="stage"> Current Stage : {appData?.stage || "N/A"} </b>
                    </span>
                    <span className="mr-2" data-testid="status-icon">
                      {" "}
                      {getIcon(supplyChainRunData?.status)}{" "}
                      <b data-testid="status">
                        {supplyChainRunData?.status || "N/A"}
                      </b>
                    </span>
                    <span className="mr-2" data-testid="website-link">
                      {" "}
                      <LocationOnOutlinedIcon className="icon-bottom" data-testid="location-icon" />
                      <a href={"abc.com"} style={{ color: "#655bd3" }} >
                        {appData?.url}
                      </a>
                    </span>
                  </>
                )}
              </span>
            </>
          )}
        </span>
      </Card>

      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="customized tabs example"
          style={{ margin: "1.5rem 0" }}
          data-testid="tab-list"
        >
          <Tab
            value="1"
            label="Overview"
            icon={<AppsIcon />}
            iconPosition="start"
            data-testid="Overview"
          />
          <Tab
            value="2"
            label="Insights"
            icon={<InsightsIcon />}
            iconPosition="start"
            data-testid="Insights"
          />
          <Tab
            value="3"
            label="Logs"
            icon={<GridViewIcon />}
            iconPosition="start"
            data-testid="Logs"
          />
          <Tab
            value="4"
            label="Settings"
            icon={<SettingsIcon />}
            iconPosition="start"
            data-testid="Settings"
          />
        </TabList>
        <TabPanel value="1" sx={{ p: 0 }} data-testid="tab-panel-1">
          <AppSummary loading={loading} appName={appData?.application_name} />
          <br />
          <AppCreationFlow
            loading={loading}
            timer={timer}
            supplyChainData={supplyChainRunData}
            gitRepo={appData?.git_repo}
            gitBranch={appData?.git_branch}
            hanldeChildTrigger={handleTriggerFromChild}
          />
        </TabPanel>
        <TabPanel value="2" data-testid="tab-panel-2">
          <Typography>
            Chocolate bar carrot cake candy canes sesame snaps. Cupcake pie
            gummi bears jujubes candy canes. Chupa chups sesame snaps halvah.
          </Typography>
        </TabPanel>
        <TabPanel value="3" data-testid="tab-panel-3">
          <Typography>
            Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa
            chups. Macaroon ice cream tootsie roll carrot cake gummi bears.
          </Typography>
        </TabPanel>
        <TabPanel value="4" data-testid="tab-panel-4">
          <Typography>
            Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa
            chups. Macaroon ice cream tootsie roll carrot cake gummi bears.
          </Typography>
        </TabPanel>
      </TabContext>
    </>
  );
};

export default AppDashboard;

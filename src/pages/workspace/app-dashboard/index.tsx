import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import { styled } from "@mui/material/styles";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StackedBarChartOutlinedIcon from "@mui/icons-material/StackedBarChartOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
import SettingsIcon from "@mui/icons-material/Settings";
import AppsIcon from "@mui/icons-material/Apps";
import Skeleton from "react-loading-skeleton";
import Icon from "src/@core/components/icon";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingIcon from "@mui/icons-material/Pending";
import LoopIcon from "@mui/icons-material/Loop";
import CustomAvatar from "src/@core/components/mui/avatar";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import AppSummary from "./AppSummary";
import AppCreationFlow from "./AppCreationFlow";
import { useRouter } from "next/router";
import { appDetails } from "src/services/appService";
import { env } from "next-runtime-env";
import "react-loading-skeleton/dist/skeleton.css";
import AppLogs from "./AppLogs";
import DestroyApp from "./DestroyApp";
import { APP_API } from "src/@core/static/api.constant";
import useSWR from "swr";
import { getFetcher } from "src/services/fetcherService";
import { setApiBaseUrl } from "src/@core/services/interceptor";
import {
  LOCALSTORAGE_CONSTANTS,
  PERMISSION_CONSTANTS,
} from "src/@core/static/app.constant";
import { AbilityContext } from "src/layouts/components/acl/Can";
import SwitcherButton from "src/component/switcherButton";
import useWorkspace from "src/hooks/useWorkspace";
import AppConfigSetting from "./AppConfigSetting";
import AppEnvVaribale from "./AppEnvVaribale";
import AppDomain from "./AppDomain";

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

export interface App {
  application_name: string;
  git_branch: string;
  git_repo: string;
  git_user: string;
  env_variables: {
    test: {
      key: string;
      value: string;
      type: string;
    }[];
    stg: {
      key: string;
      value: string;
      type: string;
    }[];
    prod: {
      key: string;
      value: string;
      type: string;
    }[];
  };
  id: string;
  port: number;
  stage: string;
  status: string;
  http_path: string;
  description: string;
  url: string;
  last_deployed: string;
  instance_details: {
    instance_type: string;
    vertical_auto_scale: boolean;
    max: number;
    min: number;
  };
}

const defaultApp = {
  application_name: "N/A",
  git_branch: "N/A",
  git_repo: "N/A",
  git_user: "N/A",
  env_variables: {
    test: [],
    stg: [],
    prod: [],
  },
  id: "N/A",
  port: 0,
  stage: "N/A",
  status: "N/A",
  http_path: "N/A",
  description: "N/A",
  url: "N/A",
  last_deployed: "N/A",
  instance_details: {
    instance_type: "N/A",
    vertical_auto_scale: false,
    max: 1,
    min: 1,
  },
};
const AppDashboard = () => {
  const router = useRouter();
  const workspaceHook = useWorkspace();
  const timer = Number(env("NEXT_PUBLIC_APP_DASHBOARD_REFRESH_TIMER")) || 60000;
  const workspaceId = localStorage.getItem(LOCALSTORAGE_CONSTANTS.workspace)!;
  const [value, setValue] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  // const [supplyChainRunData, setSupplyChainRunData] = useState<any>(null); // State to hold the fetched data
  const [appData, setAppData] = useState<App>(defaultApp); // State to hold the fetched data
  const [runType, setRunType] = useState<string>("current");
  const [showSettingEdit, setShowSettingEdit] = useState<boolean>(false);
  const [hideEdit, setHideEdit] = useState<boolean>(false);
  const ability = useContext(AbilityContext);

  let key = APP_API.supplyChainRuns;
  const updatedAppId: any = router?.query?.appId;
  key = key?.replace("{appId}", updatedAppId);
  const nkey = key + "&run_type=" + runType;
  setApiBaseUrl();
  const { data: supplyChainRunsData, mutate } = useSWR(nkey, getFetcher, {
    refreshInterval: timer,
  });

  const triggerSupplyChainRun = (selectedValue: string) => {
    setRunType(selectedValue);
  };

  useEffect(() => {
    mutate;
  }, [runType]);

  useEffect(() => {
    if (router?.query?.appId) {
      getAppDetails(router?.query?.appId);
    }
  }, [router]);

  useEffect(() => {
    if (router?.query?.appId && value === "4") {
      getAppDetails(router?.query?.appId);
    }
  }, [value]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getAppDetails = (id: any) => {
    appDetails(id, workspaceId)
      .then((response: any) => {
        setAppData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  // console.log(appData?.env_variables );
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
              <Icon
                style={{ fontSize: "1rem", padding: "4px 0 0 3px" }}
                icon={"ph:check-light"}
              />
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

  const isShowEdit = () => {
    const lstatus = supplyChainRunsData?.data?.status.toLowerCase();
    let show = false;
    show = runType === "current" && lstatus === "success" && !hideEdit;
    setShowSettingEdit(show);
  };

  useEffect(() => {
    isShowEdit();
  }, [supplyChainRunsData, runType, hideEdit]);

  const handleHideEdit = (state: boolean) => {
    setHideEdit(state);
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
        <span style={{ marginTop: "3.5rem", width: "250%" }}>
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
                      <StackedBarChartOutlinedIcon
                        className="icon-bottom"
                        data-testid="stage-icon"
                      />
                      <b data-testid="stage">
                        {" "}
                        Current Stage :{" "}
                        {supplyChainRunsData?.data?.current_stage || "N/A"}{" "}
                      </b>
                    </span>
                    <span className="mr-2" data-testid="status-icon">
                      {" "}
                      {getIcon(supplyChainRunsData?.data?.status)}{" "}
                      <b data-testid="status">
                        {supplyChainRunsData?.data?.status || "N/A"}
                      </b>
                    </span>
                    <span className="mr-2" data-testid="website-link">
                      {" "}
                      <LocationOnOutlinedIcon
                        className="icon-bottom"
                        data-testid="location-icon"
                      />
                      {supplyChainRunsData?.data?.url ? (
                        <a
                          href={
                            supplyChainRunsData?.data?.url.startsWith(
                              "http://"
                            ) ||
                            supplyChainRunsData?.data?.url.startsWith(
                              "https://"
                            )
                              ? supplyChainRunsData?.data?.url
                              : `https://${supplyChainRunsData?.data?.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#655bd3" }}
                        >
                          {supplyChainRunsData?.data?.url}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </>
                )}
              </span>
            </>
          )}
        </span>
        <span
          style={{
            textAlign: "end",
            marginRight: "20px",
            marginTop: "3rem",
            width: "100%",
          }}
        >
          <p
            style={{ fontSize: "20px", marginBottom: "10px", textAlign: "end" }}
          >
            Workspace: <b>{workspaceHook.getWorkspaceNameById(workspaceId)}</b>
          </p>
          <SwitcherButton
            handleBtnClick={triggerSupplyChainRun}
            btnNames={["current", "prod"]}
            defaultValue={"current"}
          ></SwitcherButton>
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
          {/* <Tab
            value="2"
            label="Insights"
            icon={<InsightsIcon />}
            iconPosition="start"
            data-testid="Insights"
          /> */}
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
          <AppSummary
            loading={loading}
            appName={appData?.application_name}
            metricsTimer={timer}
          />
          <br />
          <AppCreationFlow
            loading={loading}
            timer={timer}
            supplyChainData={supplyChainRunsData?.data}
            gitRepo={appData?.git_repo}
            gitBranch={appData?.git_branch}
            workspaceId={workspaceId}
            time={new Date() + ""}
          />
        </TabPanel>
        <TabPanel value="2" data-testid="tab-panel-2">
          <Typography>Under Development</Typography>
        </TabPanel>
        <TabPanel value="3" sx={{ p: 0 }} data-testid="tab-panel-3">
          <AppLogs appId={appData?.id ? appData.id : "0"} />
        </TabPanel>

        <TabPanel value="4" data-testid="tab-panel-4">
          <Typography sx={{ marginBottom: 10 }}>
            <AppConfigSetting
              data={appData}
              showEdit={showSettingEdit}
              setHideEdit={handleHideEdit}
            />
          </Typography>

          <Typography sx={{ marginBottom: 10 }}>
            <AppEnvVaribale
              Data={appData}
              showEdit={showSettingEdit}
              setHideEdit={handleHideEdit}
            />
          </Typography>

          {/*   <Typography sx={{ marginBottom: 10 }}>
            <Card sx={{ margin: "-25px" }}>
              <CardContent>
                <AppDomain   url={appData.url}  />
              </CardContent> 
            </Card>
          </Typography> */}

          <Typography>
            {ability?.can("read", PERMISSION_CONSTANTS.deleteApp) && (
              <DestroyApp
                appName={appData?.application_name}
                appId={appData?.id}
                metricsTimer={0}
              />
            )}
          </Typography>
        </TabPanel>
      </TabContext>
    </>
  );
};

AppDashboard.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.appDashboard,
};

export default AppDashboard;

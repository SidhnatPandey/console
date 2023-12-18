// ** React Imports
import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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

import { SyntheticEvent, useEffect } from "react";
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
    minWidth: 130,
    minHeight: 38,
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
  },
}));

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <Grid container spacing={6} marginTop={"10px"}>
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TabList
                variant="scrollable"
                scrollButtons="auto"
                aria-label="customized tabs example"
                onChange={handleChange} // Add onChange handler
              >
                <Tab
                  value="profile"
                  data-testid="profile-tab"
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        "& svg": { mr: 2 },
                      }}
                    >
                      <Icon fontSize="1.125rem" icon="tabler:user-check" />
                      Profile
                    </Box>
                  }
                />
              </TabList>
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default ProfileTabs;

// ** React Imports
import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import { styled } from "@mui/material/styles";

// ** Custom Components Imports
import Icon from "src/@core/components/icon";
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

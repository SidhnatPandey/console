// ** React Imports
import { useState } from "react";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TabContext from "@mui/lab/TabContext";
import { styled, Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import Icon from "src/@core/components/icon";

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
  const hideText = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

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
              >
                <Tab
                  value="profile"
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ...(!hideText && { "& svg": { mr: 2 } }),
                      }}
                    >
                      <Icon fontSize="1.125rem" icon="tabler:user-check" />
                      {!hideText && "Profile"}
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

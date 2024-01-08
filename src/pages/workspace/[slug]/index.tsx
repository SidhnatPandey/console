import { Card, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import IconifyIcon from "src/@core/components/icon";
import Apps from "../../apps";
import WorkspaceSettings from "../WorkspaceSettings";
import { AuthContext } from "src/context/AuthContext";
import { Workspace } from "src/context/types";
import { Icon } from "@iconify/react";

const Workspace = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const authContext = useContext(AuthContext);
  const [workspace, setWorkspace] = useState<Workspace | undefined>();

  // State to manage the current project
  const [currentProject, setCurrentProject] = useState<string | string[] | undefined | null>();

  useEffect(() => {
    // Update the current project when the query parameter changes
    setCurrentProject(slug);
    setWorkspace(authContext.workspaces.find((workspace) => workspace.name === slug));
  }, [slug]);

  const handleShowApps = () => {
    setSelectedTab(0);
  };

  const handleShowSettings = () => {
    setSelectedTab(1);
  };

  return (
    <div>
      {currentProject ? (
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
                <IconifyIcon
                  icon={"ion:document-outline"}
                  style={{
                    fontSize: "120px",
                    margin: "20px",
                    background: "rgba(101, 91, 211, 0.2)",
                  }}
                  rotate={4}
                />
              )}
            </span>
            <span style={{ marginTop: "3.5rem" }}>
              <h1 style={{ marginBottom: "0" }} data-testid="title">
                {loading ? <Skeleton /> : currentProject || "N/A"}
              </h1>
              {loading ? (
                <Skeleton
                  width={400}
                  height={20}
                  style={{ marginBottom: "35px" }}
                />
              ) : (
                <>
                  <span
                    data-testid="description"
                    style={{ marginTop: "3.5rem" }}
                  >
                    {loading ? (
                      <Skeleton
                        width={400}
                        height={20}
                        style={{ marginBottom: "35px" }}
                      />
                    ) : (
                      <>This workspace is for {currentProject}</>
                    )}
                  </span>
                </>
              )}
            </span>
          </Card>
          <br />
          <Tabs
            sx={{ borderBottom: 'none !important' }}
            value={selectedTab}
            data-testid="tabs"
            aria-label="workspace tabs"
            TabIndicatorProps={{
              style: {
                display: "none",
              },
            }}
          >
            <Button
              value={0}
              variant="text"
              onClick={handleShowApps}
              sx={{
                backgroundColor: selectedTab === 0 ? "primary.main" : "inherit",
                color: selectedTab === 0 ? "white" : "primary.main",
                fontWeight: selectedTab === 0 ? "bold" : "normal",
                "&:hover": {
                  backgroundColor: selectedTab === 0 ? "primary.dark" : "inherit",
                },
              }}
            >
              <Icon
                data-testid="apps"
                icon={"uit:create-dashboard"}
                style={{
                  fontSize: "20px",
                  marginRight: "8px",
                  transform: "rotate(-90deg)",
                }}
              />
              Apps
            </Button>

            <Button
              value={1}
              variant="text"
              onClick={handleShowSettings}
              sx={{
                backgroundColor: selectedTab === 1 ? "primary.main" : "inherit",
                color: selectedTab === 1 ? "white" : "primary.main",
                fontWeight: selectedTab === 1 ? "bold" : "normal",
                "&:hover": {
                  backgroundColor: selectedTab === 1 ? "primary.dark" : "inherit",
                },
              }}
            >
              <Icon
                data-testid="settings"
                icon={"uil:setting"}
                style={{
                  fontSize: "20px",
                  marginRight: "8px",
                }}
              />
              Settings
            </Button>
          </Tabs>

          {/* Show/Hide Apps or Settings component based on state */}
          {selectedTab === 0 && (
            <Box mt={4}>
              <Apps
                selectedRow={null}
                workspaceId={workspace?.id}
              />
            </Box>
          )}
          {selectedTab === 1 && (
            <Box mt={4}>
              {/* Render Settings component */}
              <h2 data-testid="settingsContent"><WorkspaceSettings/></h2>
              {/* Add your Settings component content here */}
            </Box>
          )}
        </>
      ) : (
        <h1 data-testid="workspaceComponent">Workspace Component</h1>
      )}
    </div>
  );
};

export default Workspace;
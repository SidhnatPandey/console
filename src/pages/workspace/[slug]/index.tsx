import { Card, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import IconifyIcon from "src/@core/components/icon";
import Apps from "../apps";
import WorkspaceSettings from "../WorkspaceSettings";
import { AuthContext } from "src/context/AuthContext";
import { Icon } from "@iconify/react";
import {
  LOCALSTORAGE_CONSTANTS,
  PERMISSION_CONSTANTS,
} from "src/@core/static/app.constant";
import { convertToString } from "src/@core/utils/string";

const Workspace = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const authContext = useContext(AuthContext);
  const [workspace, setWorkspace] = useState<any>();
  // State to manage the current project

  useEffect(() => {
    // Update the current project when the query parameter changes
    const workspace = authContext.workspaces?.find(
      (workspace) => workspace.id === slug
    );
    localStorage.setItem(
      LOCALSTORAGE_CONSTANTS.workspace,
      convertToString(workspace?.id)
    );
    setWorkspace(workspace);
    setSelectedTab(0);
  }, [slug, authContext.workspaces]);

  const handleShowApps = () => {
    setSelectedTab(0);
  };

  const handleShowSettings = () => {
    setSelectedTab(1);
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
            {loading ? <Skeleton /> : workspace?.name || "N/A"}
          </h1>
          {loading ? (
            <Skeleton
              width={400}
              height={20}
              style={{ marginBottom: "35px" }}
            />
          ) : (
            <>
              <span data-testid="description">
                {loading ? (
                  <Skeleton
                    width={400}
                    height={20}
                    style={{ marginBottom: "35px" }}
                  />
                ) : (
                  <>
                    {workspace && workspace.description ? (
                      <p style={{ marginTop: "0px" }}>
                        {workspace.description}
                      </p>
                    ) : (
                      <> No description available for this workspace.</>
                    )}
                  </>
                )}
              </span>
            </>
          )}
        </span>
      </Card>
      <br />
      <Tabs
        sx={{ borderBottom: "none !important" }}
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
          data-testid="button"
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

        {workspace?.role != "developer" ? (
          <Button
            data-testid="button2"
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
        ) : null}
      </Tabs>

      {/* Show/Hide Apps or Settings component based on state */}
      {selectedTab === 0 && (
        <Box mt={4}>
          <Apps selectedRow={null} workspace_id={workspace?.id} />
        </Box>
      )}
      {selectedTab === 1 && (
        <Box mt={4}>
          {/* Render Settings component */}
          <h2 data-testid="settingsContent">
            <WorkspaceSettings workspaceId={workspace} />
          </h2>
          {/* Add your Settings component content here */}
        </Box>
      )}
    </>
  );
};

Workspace.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.workspace,
};

export default Workspace;

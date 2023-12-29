import { Card, Button, Box, Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect, SetStateAction } from 'react';
import Skeleton from 'react-loading-skeleton';
import IconifyIcon from 'src/@core/components/icon';
import Apps from '../apps';
import { Icon } from '@iconify/react';

const Workspace = () => {
  const router = useRouter();
  const { query } = router;
  const [loading, setLoading] = useState<boolean>(false);
  const [showApps, setShowApps] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  // Extract project identifier from the query parameter
  const projectId = Array.isArray(query.project) ? query.project[0] : query.project;

  // State to manage the current project
  const [currentProject, setCurrentProject] = useState<string | null>(projectId || null);

  useEffect(() => {
    // Update the current project when the query parameter changes
    setCurrentProject(projectId || null);
  }, [projectId]);

  const handleShowApps = () => {
    setShowApps(true);
    setSelectedTab(0);
  };

  const handleShowSettings = () => {
    setShowApps(false);
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
                  <span style={{ marginTop: "3.5rem" }}>
                    {loading ? (
                      <Skeleton
                        width={400}
                        height={20}
                        style={{ marginBottom: "35px" }}
                      />
                    ) : (
                      <>
                        This workspace is for {currentProject}
                      </>
                    )}
                  </span>
                </>
              )}
            </span>
          </Card>
          <br />
          <Tabs
            value={selectedTab}
            aria-label="workspace tabs"
            TabIndicatorProps={{
              style: {
                display: 'none',              },
            }}
          >
            <Button
              value={0}
              variant="text"
              onClick={handleShowApps}
              sx={{
                backgroundColor: selectedTab === 0 ? 'primary.main' : 'inherit',
                color: selectedTab === 0 ? 'white' : 'primary.main',
                fontWeight: selectedTab === 0 ? 'bold' : 'normal',
                '&:hover': {
                  backgroundColor: selectedTab === 0 ? 'primary.dark' : 'inherit',
                },
              }}
            >
              <Icon
                icon={"uit:create-dashboard"}
                style={{
                  fontSize: "20px", // Adjust the size as needed
                  marginRight: "8px", // Add some spacing between the icon and text
                  transform: "rotate(-90deg)", // Rotate the icon 90 degrees to the right
                }}
              />
              Apps
            </Button>

            <Button
              value={1}
              variant="text"
              onClick={handleShowSettings}
              sx={{
                backgroundColor: selectedTab === 1 ? 'primary.main' : 'inherit',
                color: selectedTab === 1 ? 'white' : 'primary.main',
                fontWeight: selectedTab === 1 ? 'bold' : 'normal',
                '&:hover': {
                  backgroundColor: selectedTab === 1 ? 'primary.dark' : 'inherit',
                },
              }}
            >
              <Icon
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
          {showApps && (
            <Box mt={4}>
              <Apps selectedRow={null} setSelectedRow={(value: SetStateAction<number | null>) => { }} />
            </Box>
          )}
          {!showApps && (
            <Box mt={4}>
              {/* Render Settings component */}
              <h2>Settings Content</h2>
              {/* Add your Settings component content here */}
            </Box>
          )}
        </>
      ) : (
        <h1>Workspace Component</h1>
      )}
    </div>
  );
};

export default Workspace;

import { Box, Button, Card, Link, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
// import SwitcherButton from "src/component/switcherButton";
import WorkspaceDropdown from "src/component/workspaceDropdown";
import { SecretContext } from "src/context/SecretContext";
import useWorkspace from "src/hooks/useWorkspace";

interface SecretDashboardProps {
  title: string;
  subtitle?: string;
  wid?: string;
  showWorkspaceDropdown: boolean;
}
const SecretsDashboard = ({
  title,
  wid,
  showWorkspaceDropdown,
}: SecretDashboardProps) => {
  const secretContext = useContext(SecretContext);
  
  useEffect(() => {
    if (wid) {
      secretContext.setWorkspace(wid);
    }
  }, [wid, secretContext.setWorkspace]);

  const workspace = useWorkspace();

  return (
    <>
      <Box>
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "top",
            padding: "16px",
            gap: 5,
          }}
        >
          <div>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
          </div>
          <div style={{ display: "flex", gap: 15 }}>
            <div
              style={{
                flexDirection: "column",
                alignItems: "top",
                minWidth: "190px",
              }}
            >
              {showWorkspaceDropdown ? (
                <WorkspaceDropdown globalDefault={true} />
              ) : (
                <div style={{ display: "flex" }}>
                  <Typography
                    variant="body1"
                    style={{ fontSize: 19, marginRight: 8 }}
                  >
                    Workspace :
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ fontSize: 19, fontWeight: "bold" }}
                  >
                    {workspace.getWorkspaceNameById(wid)}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Box>
    </>
  );
};

export default SecretsDashboard;

import { Box, Button, Card, Link, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import SwitcherButton from "src/component/switcherButton";
import WorkspaceDropdown from "src/component/workspaceDropdown";
import { SecurityContext } from "src/context/SecurityContext";
import useWorkspace from "src/hooks/useWorkspace";

interface SecurityDashboardProps {
  title: string;
  subtitle?: string;
  wid?: string;
  showWorkspaceDropdown: boolean;
  CveScore?: number;
  CveDescription?: string;
  CveUrl?: string;
}
const SecurityDashboard = ({
  title,
  subtitle,
  wid,
  showWorkspaceDropdown,
  CveScore,
  CveDescription,
  CveUrl,
}: SecurityDashboardProps) => {
  const securityContext = useContext(SecurityContext);
  useEffect(() => {
    if (wid) {
      securityContext.setWorkspace(wid);
    }
  }, [wid, securityContext.setWorkspace]);

  const workspace = useWorkspace();

  const triggerSecurityData = (selectedValue: string) => {
    securityContext.setRunType(selectedValue);
  };
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
            <Typography variant="subtitle1" component="div" gutterBottom>
              {subtitle}
            </Typography>
            {CveScore !== undefined && (
              <Typography component="div">
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ fontWeight: "bold" }}
                >
                  CVSS SCORE:
                </Typography>{" "}
                <Typography variant="subtitle1" component="span">
                  {CveScore}
                </Typography>
              </Typography>
            )}
            {CveDescription && (
              <Typography component="div">
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ fontWeight: "bold" }}
                >
                  Description:
                </Typography>{" "}
                <Typography variant="subtitle1" component="span">
                  {CveDescription}
                </Typography>
              </Typography>
            )}
            {CveUrl && (
              <Typography component="div">
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ fontWeight: "bold" }}
                >
                  Reference:
                </Typography>{" "}
                <Link href={CveUrl} target="_blank" rel="noopener noreferrer">
                  Vulnerability Database
                </Link>
              </Typography>
            )}{" "}
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
                <WorkspaceDropdown globalDefault={false}/>
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
            <div
              style={{
                flexDirection: "column",
                alignItems: "top",
                minWidth: "190px",
              }}
            >
              <SwitcherButton
                handleBtnClick={triggerSecurityData}
                btnNames={["prod", "non-prod"]}
                defaultValue={"non-prod"}
              />
            </div>
          </div>
        </Card>
      </Box>
    </>
  );
};

export default SecurityDashboard;

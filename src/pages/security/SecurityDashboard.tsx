import { Box, Button, Card } from "@mui/material";
import React, { useContext } from "react";
import SwitcherButton from "src/component/switcherButton";
import WorkspaceDropdown from "src/component/workspaceDropdown";
import { SecurityContext } from "src/context/SecurityContext";
import useWorkspace from "src/hooks/useWorkspace";

interface SecurityDashboardProps {
  title: string;
  subtitle?: string;
  wid?: string;
  showWorkspaceDropdown: boolean;
}
const SecurityDashboard = ({
  title,
  subtitle,
  wid,
  showWorkspaceDropdown,
}: SecurityDashboardProps) => {
  const securityContext = useContext(SecurityContext);
  if (wid) {
    securityContext.setWorkspace(wid);
  }

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
            alignItems: "center",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <div>
            <h3 style={{ marginBottom: 0 }}>{title}</h3>
            <h5 style={{ marginTop: 0 }}>{subtitle}</h5>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
            {showWorkspaceDropdown ? (
              <WorkspaceDropdown />
            ) : (
              <Button
                variant="contained"
                size="medium"
                sx={{
                  backgroundColor: "lightgray",
                  "&:hover": { backgroundColor: "lightgray" },
                  color: "black",
                }}
              >
                {workspace.getWorkspaceNameById(wid)}
              </Button>
            )}

            <SwitcherButton
              handleBtnClick={triggerSecurityData}
              btnNames={["prod", "non-prod"]}
              defaultValue={"non-prod"}
            />
          </div>
        </Card>
      </Box>
    </>
  );
};

export default SecurityDashboard;

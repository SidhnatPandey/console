import React, { useState, useContext } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AuthContext } from "src/context/AuthContext";
import { SecurityContext } from "src/context/SecurityContext";

const WorkspaceDropdown = () => {
  const [workspaceAnchorEl, setWorkspaceAnchorEl] =
    useState<HTMLElement | null>(null);
  const { workspaces } = useContext(AuthContext);
  const securityContext = useContext(SecurityContext);

  const workspaceOpen = Boolean(workspaceAnchorEl);
  const [selectedWorkspace, setSelectedWorkspace] = useState("All Workspaces");

  const handleWorkspaceClick = (event: React.MouseEvent<HTMLElement>) => {
    setWorkspaceAnchorEl(event.currentTarget);
  };

  const handleWorkspaceClose = () => {
    setWorkspaceAnchorEl(null);
  };

  const handleWorkspaceSelect = (workspace: any) => {
    setSelectedWorkspace(workspace.name);
    securityContext.setWorkspace(workspace.id);
    handleWorkspaceClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        size="medium"
        onClick={handleWorkspaceClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          backgroundColor: "lightgray",
          "&:hover": { backgroundColor: "lightgray" },
          color: "black",
          borderRadius: "4px",
          width: "190px",
        }}
      >
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {selectedWorkspace}
        </span>
      </Button>
      <Menu
        anchorEl={workspaceAnchorEl}
        open={workspaceOpen}
        onClose={handleWorkspaceClose}
      >
        <MenuItem
          onClick={() =>
            handleWorkspaceSelect({ name: "All Workspaces", id: "all" })
          }
        >
          All Workspaces
        </MenuItem>
        {workspaces &&
          workspaces.map((workspace, index) => (
            <MenuItem
              key={workspace.id || index}
              onClick={() => handleWorkspaceSelect(workspace)}
            >
              {workspace.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default WorkspaceDropdown;

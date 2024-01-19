import React, { useState, useContext } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { AuthContext } from 'src/context/AuthContext';

const WorkspaceDropdown = () => {
  const [organizationAnchorEl, setOrganizationAnchorEl] = useState<HTMLElement | null>(null);
  const { workspaces } = useContext(AuthContext);

  const organizationOpen = Boolean(organizationAnchorEl);
  const [selectedWorkspace, setSelectedWorkspace] = useState('All Workspaces');

  const handleOrganizationClick = (event: React.MouseEvent<HTMLElement>) => {
    setOrganizationAnchorEl(event.currentTarget);
  };

  const handleOrganizationClose = () => {
    setOrganizationAnchorEl(null);
  };

  const handleWorkspaceSelect = (workspaceName: string) => {
    setSelectedWorkspace(workspaceName);
    handleOrganizationClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        size="large"
        onClick={handleOrganizationClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{ backgroundColor: 'lightgray', '&:hover': { backgroundColor: 'lightgray' }, color: 'black' }}
      >
        {selectedWorkspace}
      </Button>
      <Menu
        anchorEl={organizationAnchorEl}
        open={organizationOpen}
        onClose={handleOrganizationClose}
      >
        <MenuItem onClick={() => handleWorkspaceSelect('All Workspaces')}>
          All Workspaces
        </MenuItem>
        {workspaces && workspaces.map((workspace, index) => (
          <MenuItem key={workspace.id || index} onClick={() => handleWorkspaceSelect(workspace.name)}>
            {workspace.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default WorkspaceDropdown;

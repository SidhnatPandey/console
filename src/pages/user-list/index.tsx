import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { Avatar, FormControl, InputLabel, Select } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomChip from "src/@core/components/mui/chip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

const WorkspaceSettings: React.FC = () => {
  const workspaceSettingsData = [
    {
      id: 1,
      profileImageUrl: "../images/avatars/15.png",
      userFullName: "John Doe",
      role: "Admin",
      emailAddress: "john@example.com",
      status: "Active",
    },
    {
        id: 2,
        profileImageUrl: "../images/avatars/1.png",
        userFullName: "Shivani Shekhawat",
        role: "User",
        emailAddress: "shivani@example.com",
        status: "Inactive",
      },
  ];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    rowId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleOptionClick = (option: string) => {
    console.log(`Option '${option}' clicked for row ${selectedRow}`);
    handleMenuClose();
  };

  const handleAddUserClick = () => {
    setAddUserDialogOpen(true);
  };

  const handleAddUserDialogClose = () => {
    setAddUserDialogOpen(false);
  };

  const handleAddUser = () => {
    console.log("User added");
    handleAddUserDialogClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChipColor = (status: any) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "20px",
            marginRight: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddUserClick}
            startIcon={<AddIcon />}
          >
            Add New User
          </Button>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main + "10",
                }}
              >
                <TableCell>
                  <Typography variant="subtitle1" style={{ textTransform: "none" }}>User Full Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1"style={{ textTransform: "none" }}>Role</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1"style={{ textTransform: "none" }}>Email Address</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1"style={{ textTransform: "none" }}>Status</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1"style={{ textTransform: "none" }}>Action</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? workspaceSettingsData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : workspaceSettingsData
              ).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        alt={row.userFullName}
                        src={row.profileImageUrl}
                        sx={{ marginRight: 2 }}
                      />
                      <div>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {row.userFullName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          @{row.userFullName.split(" ")[0]}
                        </Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.emailAddress}</TableCell>
                  <TableCell>
                    <CustomChip
                      rounded
                      skin="light"
                      label={row.status ? row.status : "Pending"}
                      color={getStatusChipColor(row.status)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
                        handleMenuClick(e, row.id)
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl && selectedRow === row.id)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleOptionClick("a")}>
                        <VisibilityIcon style={{ marginRight: "10px" }} />
                        View
                      </MenuItem>
                      <MenuItem onClick={() => handleOptionClick("b")}>
                        <DeleteIcon style={{ marginRight: "10px" }} />
                        Remove
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={workspaceSettingsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ marginLeft: "16px" }}
        />
      </Card>

      <Dialog
        open={isAddUserDialogOpen}
        onClose={handleAddUserDialogClose}
        PaperProps={{
          style: {
            width: "30%",
          },
        }}
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Email Address"
            fullWidth
            placeholder="Enter email address"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            label="Username"
            fullWidth
            placeholder="Enter username"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            label="Organization"
            fullWidth
            placeholder="Enter organization"
            style={{ marginBottom: "20px" }}
          />

          <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              label="Role"
              placeholder="Select role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="workspace-select-label">Workspace</InputLabel>
            <Select
              labelId="workspace-select-label"
              id="workspace-select"
              label="Workspace"
              placeholder="Select workspace"
            >
              <MenuItem value="workspace1">Workspace 1</MenuItem>
              <MenuItem value="workspace2">Workspace 2</MenuItem>
              <MenuItem value="workspace3">Workspace 3</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddUserDialogClose}
            color="primary"
            size="large"
            variant="contained"
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            color="primary"
            size="large"
            variant="contained"
            type="submit"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorkspaceSettings;

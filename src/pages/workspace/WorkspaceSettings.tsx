import React, { useEffect, useState } from "react";
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
import DestroyWorkspace from "./DestroyWorkspace";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CustomChip from "src/@core/components/mui/chip";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  getListOfUsersWorkspaces,
  addUserToWorkspace,
  removeUserFromWorkspace,
  orguser,
} from "src/services/appService";
import toast from "react-hot-toast";
import { Avatar } from "@mui/material";
import { UserDataType } from "src/context/types";
import { toTitleCase } from "src/utils/stringUtils";
import { getUserData } from "src/services/userService";

interface WorkspaceSettingsDataItem {
  profile_picture: any;
  username: string;
  id: number;
  user_full_name: string;
  role: string;
  email: string;
  status: string;
  org_id: string;
  user_id: string;
  user: UserDataType;
}

interface WorkspaceSettingsComponent {
  workspaceId: any;
}

const WorkspaceSettings: React.FC<WorkspaceSettingsComponent> = ({
  workspaceId,
}) => {
  const [workspaceSettingsData, setWorkspaceSettingsData] = useState<
    WorkspaceSettingsDataItem[]
  >([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState<WorkspaceSettingsDataItem[]>(
    []
  );
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [isValidationError, setIsValidationError] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<WorkspaceSettingsDataItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchWorkspaces();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isEditDialogOpen) {
      setSelectedUserId(selectedUserForEdit?.user_id || "");
    }
  }, [selectedUserForEdit, isEditDialogOpen]);

  const fetchWorkspaces = () => {
    setLoading(true);
    getListOfUsersWorkspaces(workspaceId?.id)
      .then((response) => {
        setWorkspaceSettingsData(response?.data || []);
        getProfilePicture(response?.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching workspaces:", error);
      });
  };

  const fetchUsers = async () => {
    try {
      const users = await orguser();
      if (users) {
        const filteredUsers = users?.data?.users?.filter(
          (user: any) => user.email
        );
        setFetchedUsers(filteredUsers);
      } else {
        console.error("Invalid data format received from orguser API");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getProfilePicture = (userArr: WorkspaceSettingsDataItem[]) => {
    userArr.forEach((user: WorkspaceSettingsDataItem) => {
      getUserData(user.user_id).then((resp: any) => {
        if (resp.data) {
          user.profile_picture = resp.data.user_info.profile_picture;
          setWorkspaceSettingsData([...userArr]);
        }
      })
    })
  }

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

  const getStatusChipColor = (status: any) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "deleted":
        return "error";
      default:
        return "warning";
    }
  };

  const handleOptionClick = (option: string, id?: string, role?: string) => {
    handleMenuClose();
    if (option === "Remove" && selectedRow) {
      const userToRemove = workspaceSettingsData.find(
        (user, key) => key === selectedRow
      );
      if (userToRemove && id && role && workspaceId.id) {
        const payload = {
          role: role,
          user_id: id,
          workspace_id: workspaceId.id,
        };
        removeUserFromWorkspace(payload)
          .then(() => {
            toast.success("User removed successfully");
            setWorkspaceSettingsData((prevData) => {
              const updatedData = prevData.filter(
                (user, key) => key !== selectedRow
              );
              return updatedData;
            });
          })
          .catch((error) => {
            console.error("Error removing user:", error);
          });
      }
    } else if (option === "Edit" && selectedRow) {
      const userToEdit = workspaceSettingsData.find(
        (user, key) => key === selectedRow
      );
      if (userToEdit) {
        const updatedUsers = workspaceSettingsData.map((user, key) => ({
          ...user,
          isEdit: key === selectedRow,
        }));
        setWorkspaceSettingsData(updatedUsers);
        setSelectedUserForEdit(userToEdit);
        setSelectedUserRole(userToEdit.role);
        setEditDialogOpen(true);
      }
    }
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedUserForEdit(null);
  };
  const handleAddUserClick = () => {
    setAddUserDialogOpen(true);
  };

  const handleAddUserDialogClose = () => {
    setAddUserDialogOpen(false);
    setSelectedUserId("");
    setSelectedUserRole("");
    setIsValidationError(false);
  };

  const handleAddUser = () => {
    if (selectedUserId && selectedUserRole) {
      setIsValidationError(false);
      handleAddUserDialogClose();
      const payload = {
        role: selectedUserRole,
        user_id: selectedUserId,
        workspace_id: workspaceId?.id,
      };
      addUserToWorkspace(payload)
        .then(() => {
          fetchWorkspaces();
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    } else {
      setIsValidationError(true);
    }
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

  const handleRemove = (row: any) => {
    setSelectedUserRole(row.role);
    setSelectedUserId(row.user_id);
    handleOptionClick("Remove", row.user_id, row.role);
  };

  const getRole = (role: string) => {
    return role === "workspace-admin" ? "Workspace Admin" : toTitleCase(role);
  };

  return (
    <>
      <Card data-testid="card" sx={{ margin: "0 0 30px 0" }}>
        <br />
        <Typography
          variant="h3"
          gutterBottom
          sx={{ marginLeft: "25px", marginRight: "25px" }}
        >
          Workspace Settings
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginLeft: "25px",
              fontWeight: "normal",
            }}
          >
            Workspace Users
          </Typography>

          <Button
            data-testid="button"
            variant="contained"
            color="primary"
            onClick={handleAddUserClick}
            sx={{ marginLeft: "auto", marginRight: "20px" }}
          >
            Add User
          </Button>
        </div>
        <br />
        <TableContainer>
          <Table data-testid="tableData">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main + "10",
                }}
              >
                <TableCell>
                  <Typography
                    data-testid="user-full-name"
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    UserFullName
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography data-testid="role" variant="subtitle1">
                    Role
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography data-testid="email-address" variant="subtitle1">
                    Email Address
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography data-testid="status" variant="subtitle1">
                    Status
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography data-testid="action" variant="subtitle1">
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workspaceSettingsData.length > 0 ? (
                workspaceSettingsData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, key) => {
                    const [first_name, last_name] = row.user_full_name.split(" ");
                    return (
                      <TableRow key={key}>
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Avatar
                              data-testid="avatar-0"
                              alt={row.user_full_name}
                              src={
                                row?.profile_picture
                                  ? `data:image/jpeg;base64,${row.profile_picture}`
                                  : undefined
                              }
                              sx={{ marginRight: 2, fontSize: "2rem" }}
                              style={{ alignItems: "center", fontSize: "20px" }}
                            >
                              {!row.profile_picture &&
                                (first_name ||
                                  last_name
                                  ? `${first_name
                                    ? toTitleCase(
                                      first_name[0]
                                    )
                                    : ""
                                  }${last_name
                                    ? toTitleCase(
                                      last_name[0]
                                    )
                                    : ""
                                  }`
                                  : row.username
                                    ? toTitleCase(row.username[0])
                                    : "")}
                            </Avatar>
                            <div>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "bold" }}
                              >
                                {row?.user_full_name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="div"
                              >
                                @{row.username}
                              </Typography>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRole(row.role)}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>
                          <CustomChip
                            rounded
                            skin="light"
                            label={
                              row.status ? toTitleCase(row.status) : "Pending"
                            }
                            color={getStatusChipColor(row.status)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            data-testid="menu-icon"
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={(
                              e: React.MouseEvent<HTMLElement, MouseEvent>
                            ) => handleMenuClick(e, key)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            data-testid="menu"
                            id="long-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl && selectedRow === key)}
                            onClose={handleMenuClose}
                          >
                            <MenuItem
                              data-testid="edit-user"
                              onClick={() => handleOptionClick("Edit")}
                            >
                              <EditIcon
                                fontSize="small"
                                style={{ marginRight: "4.5px" }}
                              />
                              Edit
                            </MenuItem>
                            <MenuItem
                              data-testid="remove-user"
                              onClick={() => handleRemove(row)}
                            >
                              <DeleteForeverIcon
                                fontSize="small"
                                sx={{ marginRight: 1 }}
                              />
                              Remove
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      fontSize: "18px",
                      paddingTop: "50px", // Increase the top padding
                      paddingBottom: "50px", // Increase the bottom padding
                    }}
                  >
                    {loading ? "Loading ..." : "No Users"}
                  </TableCell>
                </TableRow>
              )}
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
      <Card sx={{ margin: "16px 0 0 0" }}>
        <DestroyWorkspace loading={false} workspaceId={workspaceId} />
      </Card>
      <Dialog
        data-tesid="user-dialog"
        open={isAddUserDialogOpen}
        onClose={handleAddUserDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle data-testid="user-dialog-title">
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={handleAddUserDialogClose}
              sx={{ marginLeft: "auto" }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Invite User
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
            Add User to the workspace
          </Typography>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              data-testid="email-select"
              label="User Email"
              fullWidth
              select
              SelectProps={{
                native: false,
              }}
              sx={{ marginTop: "16px", width: "calc(50% - 8px)" }}
              id="userEmail"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              error={isValidationError && !selectedUserId}
              helperText={
                isValidationError && !selectedUserId ? "Email is required" : ""
              }
            >
              {Array.isArray(fetchedUsers)
                ? fetchedUsers.map((user) => (
                  <MenuItem key={user.id} value={user.user_id}>
                    {user.email}
                  </MenuItem>
                ))
                : null}
            </TextField>
            <TextField
              data-testid="role-select"
              label="Role"
              fullWidth
              select
              SelectProps={{
                native: false,
              }}
              sx={{ marginTop: "16px", width: "calc(50% - 8px)" }}
              id="roleSelect"
              value={selectedUserRole}
              onChange={(e) => setSelectedUserRole(e.target.value)}
              error={isValidationError && !selectedUserRole}
              helperText={
                isValidationError && !selectedUserRole ? "Role is required" : ""
              }
            >
              <MenuItem value="workspace-admin">Workspace Admin</MenuItem>
              <MenuItem value="developer">Developer</MenuItem>
            </TextField>
          </div>

          <Button
            data-testid="submit-button"
            variant="contained"
            onClick={handleAddUser}
            color="primary"
            sx={{
              marginTop: "16px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={handleEditDialogClose}
              sx={{ marginLeft: "auto" }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Edit User
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
            Update User details
          </Typography>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Display existing user details for editing */}
            <TextField
              label="User Email"
              fullWidth
              value={selectedUserForEdit?.email || ""}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
              }}
              disabled
              sx={{ marginTop: "16px", width: "calc(50% - 8px)" }}
            />
            <TextField
              label="Role"
              fullWidth
              select
              SelectProps={{
                native: false,
              }}
              sx={{ marginTop: "16px", width: "calc(50% - 8px)" }}
              id="roleSelect"
              value={selectedUserRole}
              onChange={(e) => {
                setSelectedUserRole(e.target.value);
              }}
              error={isValidationError && !selectedUserRole}
              helperText={
                isValidationError && !selectedUserRole ? "Role is required" : ""
              }
            >
              <MenuItem value="workspace-admin">Workspace Admin</MenuItem>
              <MenuItem value="developer">Developer</MenuItem>
            </TextField>
          </div>

          <Button
            variant="contained"
            onClick={() => {
              handleAddUser();
              handleEditDialogClose();
            }}
            color="primary"
            sx={{
              marginTop: "16px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkspaceSettings;

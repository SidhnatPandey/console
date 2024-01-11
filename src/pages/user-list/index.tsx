import React, { useContext, useEffect, useState } from "react";
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
import ConfirmationDialog from "src/component/ConfirmationDialog";
import {
  Avatar,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomChip from "src/@core/components/mui/chip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  getOrganisationsUserList,
  inviteUser,
  removeUserFromOrg,
} from "src/services/userService";
import toast from "react-hot-toast";
import { UserDataType } from "src/context/types";
import { toTitleCase } from "src/utils/stringUtils";
import { AuthContext } from "src/context/AuthContext";
import { LOCALSTORAGE_CONSTANTS } from "src/@core/static/app.constant";
import { useForm, Controller } from "react-hook-form";

const UserList: React.FC = () => {
  const authContext = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const [org, setOrg] = useState<{
    org_id: string;
    org_name: string;
  }>();
  const [isRemoveConfirmationOpen, setRemoveConfirmationOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDataType[]>([]);

  useEffect(() => {
    const orgId = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_CONSTANTS.ogrId)!
    );
    const org = authContext.organisations.filter(
      (org) => org.org_id === orgId
    )[0];
    setOrg(org);
    console.log(org);
  }, [authContext]);

  useEffect(() => {
    settingsData();
  }, []);

  const settingsData = () => {
    setLoading(true);
    getOrganisationsUserList().then((response) => {
      setUsers(response.data.users);
      setLoading(false);
    });
  };

  const removeOrgUsers = () => {
    if (userToRemove) {
      removeUserFromOrg(userToRemove)
        .then(() => {
          settingsData();
          setRemoveConfirmationOpen(false);
          handleMenuClose();
        })
        .catch(() => {
          setRemoveConfirmationOpen(false);
          handleMenuClose();
        });
    }
  };

  const handleAddUserClick = () => {
    setIsEditMode(false);
    reset({
      email: "",
      username: "",
      organization: "",
      role: "",
      workspace: "",
    });
    setAddUserDialogOpen(true);
  };

  const handleEditUserClick = (user: UserDataType) => {
    setIsEditMode(true);
    reset({
      email: user.email,
      username: user.username,
      role: user.role.toLowerCase(),
      workspace: "",
    });
    setAddUserDialogOpen(true);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleAddUserDialogClose = () => {
    setAddUserDialogOpen(false);
  };

  const onSubmit = (user: any) => {
    inviteUser(user)
      .then((response) => {
        const message = response.message || "User added Successfully";
        toast.success(message);
        setAddUserDialogOpen(false);
        settingsData();
      })
      .catch((error) => {
        if (error.response) {
          toast.error(
            error.response.data.message || "An error occurred on the server"
          );
        } else if (error.request) {
          toast.error("No response was received from the server");
        } else {
          toast.error(
            error.message || "An error occurred while making the request"
          );
        }
      });
  };

  const handleRemoveConfirmation = (userId: string) => {
    setUserToRemove(userId);
    setRemoveConfirmationOpen(true);
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
                  <Typography
                    variant="subtitle1"
                    style={{ textTransform: "none" }}
                  >
                    User Full Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    style={{ textTransform: "none" }}
                  >
                    Role
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    style={{ textTransform: "none" }}
                  >
                    Email Address
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    style={{ textTransform: "none" }}
                  >
                    Status
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    style={{ textTransform: "none" }}
                  >
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            alt={toTitleCase(
                              row.user_info.first_name || row.username
                            )}
                            src={
                              row.user_info.profile_picture
                                ? `data:image/jpeg;base64,${row.user_info.profile_picture}`
                                : undefined
                            }
                            sx={{ marginRight: 2, fontSize: "2rem" }}
                            style={{ alignItems: "normal" }}
                          >
                            {!row.user_info.profile_picture &&
                              (row.user_info.first_name ||
                                row.user_info.last_name
                                ? `${row.user_info.first_name
                                  ? row.user_info.first_name[0]
                                  : ""
                                }${row.user_info.last_name
                                  ? row.user_info.last_name[0]
                                  : ""
                                }`
                                : row.username
                                  ? row.username[0]
                                  : "")}
                          </Avatar>

                          <div>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {toTitleCase(row.user_info.first_name)}{" "}
                              {toTitleCase(row.user_info.last_name)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              @{row.username}
                            </Typography>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell>{row.email}</TableCell>
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
                          onClick={(
                            e: React.MouseEvent<HTMLElement, MouseEvent>
                          ) => handleMenuClick(e, row.id)}
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
                          <MenuItem onClick={() => handleEditUserClick(row)}>
                            <EditIcon style={{ marginRight: "10px" }} />
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleRemoveConfirmation(row.user_id)
                            }
                          >
                            <DeleteIcon style={{ marginRight: "10px" }} />
                            Remove
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      fontSize: "18px",
                      paddingTop: "50px",
                      paddingBottom: "50px",
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
          count={users.length}
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
        PaperProps={{ style: { width: "30%" } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {isEditMode ? "Edit User" : "Add/Invite New User"}
            <IconButton
              aria-label="close"
              onClick={handleAddUserDialogClose}
              style={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Email Address"
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter Valid email address"
              style={{ marginBottom: "20px" }}
              disabled={isEditMode}
              error={!!errors.email}
            />
            <TextField
              label="Username"
              fullWidth
              {...register("username")}
              placeholder="Enter username"
              style={{ marginBottom: "20px" }}
              disabled={isEditMode}
            />
            <TextField
              label="Organization"
              fullWidth
              disabled
              placeholder="Enter organization"
              style={{ marginBottom: "20px" }}
              value={org?.org_name}
            />

            <FormControl fullWidth style={{ marginBottom: "20px" }}>
              <InputLabel id="role-select-label">Select Role</InputLabel>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="role-select-label"
                    id="role-select"
                    label="Role"
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="workspace-select-label">
                Select Workspace
              </InputLabel>
              <Controller
                name="workspace"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="workspace-select-label"
                    id="workspace-select"
                    label="Workspace"
                  >
                    {authContext.workspaces.length &&
                      authContext.workspaces.map((workspace) => (
                        <MenuItem value={workspace.id} key={workspace.id}>
                          {workspace.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              size="large"
              variant="contained"
              type="submit"
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmationDialog
        open={isRemoveConfirmationOpen}
        onConfirm={removeOrgUsers}
        onCancel={() => { setRemoveConfirmationOpen(false), handleMenuClose() }}
        message="Are you sure you want to remove this user?"
      />
    </>
  );
};

export default UserList;

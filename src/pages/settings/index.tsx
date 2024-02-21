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
import { CircularProgress } from '@mui/material';
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
  checkEmail,
  checkUsername,
  getOrganisationsUserList,
  getUserData,
  inviteUser,
  removeUserFromOrg,
} from "src/services/userService";
import { UserDataType } from "src/context/types";
import { toTitleCase } from "src/utils/stringUtils";
import { AuthContext } from "src/context/AuthContext";
import { LOCALSTORAGE_CONSTANTS } from "src/@core/static/app.constant";
import { useForm, Controller } from "react-hook-form";
import Toaster from "src/utils/toaster";
import useLoading from "src/hooks/loading";
import AlertDialog from "src/component/alertDialog";
import usePlan from "src/hooks/plan";

interface RowOptionsProps {
  user: UserDataType;
  editClickHandler: any;
  refreshData: any;
  orgName: string | undefined;
}

export const RowOptions: React.FC<RowOptionsProps> = ({
  user,
  editClickHandler,
  refreshData,
  orgName,
}) => {
  // ** Hooks
  // const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRemoveConfirmationOpen, setRemoveConfirmationOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<string>();

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const removeOrgUsers = () => {
    if (userToRemove) {
      removeUserFromOrg(userToRemove)
        .then((response) => {
          if (response.status === 200) {
            // Successful removal
            Toaster.successToast("User Removed successfully");
            setRemoveConfirmationOpen(false);
            refreshData();
          } else {
            Toaster.errorToast("Unexpected response status: " + response.status);
            setRemoveConfirmationOpen(false);
          }
        })
        .catch((error) => {
          setRemoveConfirmationOpen(false);
  
          if (error.response && error.response.status === 400) {
            const errorMessage = error.response.data.message;
  
            if (errorMessage === "Oops! It seems like you're trying to remove yourself from organization.") {
              Toaster.errorToast(errorMessage);
            } else {
              Toaster.errorToast("Error: " + errorMessage);
            }
          } else {
            Toaster.errorToast("Oops! It seems like you're trying to remove yourself from organization.");
          }
        });
    }
  };
  

  return (
    <>
      <IconButton
        data-testid="menu-icon"
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleRowOptionsClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        data-testid="menu"
        anchorEl={anchorEl}
        keepMounted
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
      >
        <MenuItem
          data-testid="edit-user"
          onClick={() => {
            editClickHandler(user), handleRowOptionsClose();
          }}
        >
          <EditIcon style={{ marginRight: "10px" }} />
          Edit
        </MenuItem>
        <MenuItem
          data-testid="remove-user"
          onClick={() => {
            setRemoveConfirmationOpen(true), setUserToRemove(user.user_id);
          }}
        >
          <DeleteIcon style={{ marginRight: "10px" }} />
          Remove
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        open={isRemoveConfirmationOpen}
        onConfirm={removeOrgUsers}
        onCancel={() => {
          setRemoveConfirmationOpen(false), handleRowOptionsClose();
        }}
        message={
          <span>
            Are you sure you want to remove{" "}
            {user.user_info.first_name && user.user_info.last_name ? (
              <span style={{ fontWeight: "bold" }}>
                {`${user.user_info.first_name} ${user.user_info.last_name}`}
              </span>
            ) : (
              <span style={{ fontWeight: "bold" }}>{user.username}</span>
            )}{" "}
            from <span style={{ fontWeight: "bold" }}>{orgName}</span>?
          </span>
        }
      />
    </>
  );
};

const UserList = () => {
  const authContext = useContext(AuthContext);
  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm();

  const [org, setOrg] = useState<{
    org_id: string;
    org_name: string;
  }>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDataType[]>([]);
  const [existingUser, setExistingUser] = useState<boolean>(false);
  const [userNameExist, setUserNameExist] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const { loading, startLoading, stopLoading } = useLoading();
  const planHook = usePlan();
  useEffect(() => {
    const orgId = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_CONSTANTS.ogrId)!
    );
    const org = authContext.organisations.filter(
      (org) => org.org_id === orgId
    )[0];
    setOrg(org);
  }, [authContext]);

  useEffect(() => {
    settingsData();
  }, []);

  const settingsData = () => {
    setLoadingData(true);
    getOrganisationsUserList().then((response) => {
      if (response.data.users) {
        setUsers(response.data.users);
        getProfilePicture(response.data.users);
      }
      setLoadingData(false);
    });
  };

  const getProfilePicture = (userArr: UserDataType[]) => {
    userArr.forEach((user: UserDataType) => {
      getUserData(user.user_id).then((resp: any) => {
        if (resp.data) {
          user.user_info.profile_picture = resp.data.user_info.profile_picture;
          setUsers([...userArr]);
        }
      })
    })
  }

  const handleAddUserClick = () => {
    if (!planHook.isDeveloperPlan()) {
      setIsEditMode(false);
      reset({
        email: "",
        username: "",
        organization: "",
        role: "",
        workspace: "",
      });
      setAddUserDialogOpen(true);
    } else {
      setOpenAlert(true);
    }
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

  const handleAddUserDialogClose = () => {
    setAddUserDialogOpen(false);
    reset({ username: "" });
    clearErrors("username");
    setExistingUser(false);
    setUserNameExist(false);
  };

  const onSubmit = (user: any) => {
    if (!loading) {
      startLoading();
      if (userNameExist) {
        Toaster.errorToast(" Username already Exist.");
        stopLoading();
        return;
      }
      const params = {
        email: user.email,
        username: user.username,
        role: user.role,
        workspace_id: user.workspace,
        org: user.org,
      };
      inviteUser(params)
        .then(() => {
          const successMessage = isEditMode
            ? "User edited successfully"
            : "User invited successfully";
          Toaster.successToast(successMessage);
          settingsData();
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            Toaster.errorToast("Bad Request - Invalid data sent");
          } else {
            Toaster.errorToast("Network error or server is down");
          }
        }).finally(() => {
          setAddUserDialogOpen(false);
          stopLoading();
        })
    }
  };

  const checkEmailExists = (event: any) => {
    const email = event.target.value;
    if (email) {
      checkEmail(email)
        .then((response) => {
          if (response && response.status === 409) {
            setValue("username", response.data.username);
            setExistingUser(true);
            clearErrors("username");
          } else {
            setExistingUser(false);
            setValue("username", "");
          }
        })
        .catch((error) => {
          console.log(error);
          setValue("username", "");
        });
    }
  };

  const checkUserExists = (username: string) => {
    if (username) {
      checkUsername(username)
        .then((response) => {
          if (response) {
            if (response.status === 409) {
              setError("username", {
                type: "manual",
                message: "Username already exists",
              });
              setUserNameExist(true);
            } else if (response.status === 200) {
              clearErrors("username");
              setUserNameExist(false);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
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

  return (
    <>
      <Card data-testid="card">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "20px",
            marginRight: "20px",
          }}
        >
          <Button
            data-testid="add-new-user-button"
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
                  backgroundColor: (theme: any) => theme.palette.primary.main + "10",
                }}
              >
                <TableCell>
                  <Typography
                    data-testid="user-full-name"
                    variant="subtitle1"
                    style={{ textTransform: "none" }}
                  >
                    User Full Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    data-testid="role"
                    variant="subtitle1"
                    style={{ textTransform: "none" }}
                  >
                    Role
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    data-testid="email-address"
                    variant="subtitle1"
                    style={{ textTransform: "none" }}
                  >
                    Email Address
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    data-testid="status"
                    variant="subtitle1"
                    style={{ textTransform: "none" }}
                  >
                    Status
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    data-testid="action"
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
                  .map((row) => {
                    return (
                      <TableRow key={row.user_id}>
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Avatar
                              data-testid="avatar-0"
                              alt={toTitleCase(
                                row.user_info.first_name || row.username
                              )}
                              src={
                                row.user_info.profile_picture
                                  ? `data:image/jpeg;base64,${row.user_info.profile_picture}`
                                  : undefined
                              }
                              sx={{ marginRight: 2, fontSize: "2rem" }}
                              style={{ alignItems: "center", fontSize: "20px" }}
                            >
                              {!row.user_info.profile_picture &&
                                (row.user_info.first_name ||
                                  row.user_info.last_name
                                  ? `${row.user_info.first_name
                                    ? toTitleCase(
                                      row.user_info.first_name[0]
                                    )
                                    : ""
                                  }${row.user_info.last_name
                                    ? toTitleCase(
                                      row.user_info.last_name[0]
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
                                {toTitleCase(row.user_info.first_name)}{" "}
                                {toTitleCase(row.user_info.last_name)}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                @{row.username}
                              </Typography>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {row.role === "admin" ? "Admin" : "User"}
                        </TableCell>
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
                          <RowOptions
                            user={row}
                            editClickHandler={handleEditUserClick}
                            refreshData={settingsData}
                            orgName={org?.org_name}
                          ></RowOptions>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell
                    data-testid="tableData"
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      fontSize: "18px",
                      paddingTop: "50px",
                      paddingBottom: "50px",
                    }}
                  >
                    {loadingData ? "Loading ..." : "No Users"}
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
        data-testid="user-dialog"
      >
        <form data-testid="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle data-testid="user-dialog-title">
            {isEditMode ? "Edit User" : "Add/Invite New User"}
            <IconButton
              aria-label="close"
              onClick={() => handleAddUserDialogClose()}
              style={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  data-testid="email-input"
                  label="Email Address"
                  fullWidth
                  {...field}
                  placeholder="Enter Valid email address"
                  id="user-email-address"
                  style={{ marginBottom: "20px" }}
                  disabled={isEditMode}
                  error={!!error}
                  helperText={error ? error.message : null}
                  onBlur={(e) => {
                    field.onBlur();
                    checkEmailExists(e);
                  }}
                />
              )}
            />
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters long",
                },
              }}
              render={({ field }) => (
                <TextField
                  data-testid="username-input"
                  {...field}
                  label="Username"
                  fullWidth
                  placeholder="Enter username"
                  id="user-username"
                  style={{ marginBottom: "20px" }}
                  disabled={isEditMode || existingUser}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.username || userNameExist}
                  helperText={
                    (errors.username?.message as string) ||
                    (userNameExist && "Username already exists")
                  }
                  onChange={(e: any) => {
                    clearErrors("username");
                    field.onChange(e);
                  }}
                  onBlur={() => {
                    field.onBlur();
                    checkUserExists(getValues("username"));
                  }}
                />
              )}
            />
            <Controller
              name="organization"
              control={control}
              render={({ field }) => (
                <TextField
                  data-testid="organization-input"
                  label="Organization"
                  fullWidth
                  disabled
                  placeholder="Enter organization"
                  style={{ marginBottom: "20px" }}
                  {...field}
                  value={field.value || org?.org_name}
                />
              )}
            />
            <FormControl
              fullWidth
              style={{ marginBottom: "20px" }}
              error={!!errors.role}
            >
              <InputLabel id="role-select-label">Select Role</InputLabel>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select
                    data-testid="role-select"
                    {...field}
                    labelId="role-select-label"
                    id="role-select"
                    label="Select Role"
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="workspace-admin">Workspace Admin</MenuItem>
                    <MenuItem value="developer">Developer</MenuItem>
                  </Select>
                )}
              />
              {errors.role && (
                <FormHelperText>{errors.role.message as string}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={!!errors.workspace}>
              <InputLabel id="workspace-select-label">
                Select Workspace
              </InputLabel>
              <Controller
                name="workspace"
                control={control}
                rules={{ required: "Workspace is required" }}
                render={({ field }) => (
                  <Select
                    data-testid="workspace-select"
                    {...field}
                    labelId="workspace-select-label"
                    id="workspace-select"
                    label="Select Workspace"
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
              {errors.workspace && (
                <FormHelperText>
                  {errors.workspace.message as string}
                </FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              data-testid="submit-button"
              color="primary"
              size="large"
              variant="contained"
              type="submit"
            >
              {loading && <CircularProgress size="1.2rem" color='secondary' style={{ marginRight: '5px' }} />}
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <AlertDialog open={openAlert} heading={'Plan Upgrade Needed'} message={'Please go to billing to upgrade your plan'} onCancel={() => setOpenAlert(false)} />
    </>
  );
};

export default UserList;

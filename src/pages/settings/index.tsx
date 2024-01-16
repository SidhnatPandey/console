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

interface RowOptionsProps {
  user: UserDataType,
  editClickHandler: any,
  refreshData: any,
  orgName: string | undefined
}

const RowOptions: React.FC<RowOptionsProps> = ({ user, editClickHandler, refreshData, orgName }) => {
  // ** Hooks
  // const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isRemoveConfirmationOpen, setRemoveConfirmationOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<string>();


  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const removeOrgUsers = () => {
    if (userToRemove) {
      removeUserFromOrg(userToRemove)
        .then(() => {
          setRemoveConfirmationOpen(false);
          refreshData();
        })
        .catch(() => {
          setRemoveConfirmationOpen(false);
        });
    }
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleRowOptionsClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
      >
        <MenuItem onClick={() => { editClickHandler(user), handleRowOptionsClose() }}>
          <EditIcon style={{ marginRight: "10px" }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => { setRemoveConfirmationOpen(true), setUserToRemove(user.user_id) }}
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
        message={`Are you sure you want to remove ${user.user_info.first_name && user.user_info.last_name ? `${user.user_info.first_name} ${user.user_info.last_name}` : user.username} from ${orgName} ?`}
      />
    </>
  )
}


const UserList = () => {
  const authContext = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm();

  const [org, setOrg] = useState<{
    org_id: string;
    org_name: string;
  }>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDataType[]>([]);
  const [existingUser, setExistingUser] = useState<boolean>(false);

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
      workspace: '',
    });
    setAddUserDialogOpen(true);
  };

  const handleAddUserDialogClose = () => {
    setAddUserDialogOpen(false);
  };

  const onSubmit = (user: any) => {
    const params = {
      email: user.email,
      role: user.role,
      workspace_id: user.workspace,
      org: user.org
    }
    inviteUser(params)
      .then((response) => {
        const successMessage = isEditMode
          ? "User edited successfully"
          : "User invited successfully";

        const message = response.message || successMessage;
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

  const checkEmailExists = (event: any) => {
    const email = event.target.value;
    if (email) {
      checkEmail(email)
        .then((response) => {
          if (response && response.status == 409) {
            setValue('username', response.data.username)
            setExistingUser(true);
          } else {
            setExistingUser(false);
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
    switch (status) {
      case "Active":
        return "success";
      case "Deleted":
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
                  .map((row) => {
                    return <TableRow key={row.user_id}>
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
                            style={{ alignItems: "center", fontSize: '20px' }}
                          >
                            {!row.user_info.profile_picture &&
                              (row.user_info.first_name ||
                                row.user_info.last_name
                                ? `${row.user_info.first_name
                                  ? toTitleCase(row.user_info.first_name[0])
                                  : ""
                                }${row.user_info.last_name
                                  ? toTitleCase(row.user_info.last_name[0])
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
                        <RowOptions user={row} editClickHandler={handleEditUserClick} refreshData={settingsData} orgName={org?.org_name}></RowOptions>
                      </TableCell>
                    </TableRow>
                  })
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
              onClick={() => handleAddUserDialogClose()}
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
                onBlur: (checkEmailExists),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              //onBlur={() =>checkEmailExists(email) }
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
              disabled={isEditMode || existingUser}
              value={isEditMode || existingUser ? getValues("username") : ""}
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
                    <MenuItem value="workspace-admin"> Workspace Admin</MenuItem>
                    <MenuItem value="developer">Developer</MenuItem>
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

    </>
  );
};

UserList.acl = {
  action: 'manage',
  subject: 'OrgSettings'
}

export default UserList;

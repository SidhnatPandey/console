import React, { useState, ChangeEvent, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import { Paper } from "@mui/material";
import { deactivateUser, postUserProfile } from "src/services/userService";
import { toast } from "react-hot-toast";
import { Countries } from "src/@core/static/countries";
import { useRouter } from "next/router";
import ConfirmationDialog from "../../../component/ConfirmationDialog";
import { AuthContext } from "src/context/AuthContext"; // Update with the actual path to your AuthContext
import { CircularProgress } from '@mui/material';
import { checkDeleteCriteria } from "src/services/userService";
import { LOCALSTORAGE_CONSTANTS } from "src/@core/static/app.constant";

interface Data {
  user_info?: any;
  email?: string;
  state?: string;
  address?: string;
  country?: string;
  lastName?: string;
  firstName?: string;
  organization?: string;
  phoneNumber?: string;
  zipCode?: number;
  city?: string;
  username?: string;
  user_id?: string;
  role?: string;
  profile_picture?: string;
}

const initialData: Data = {
  user_id: "",
  state: "",
  phoneNumber: "",
  address: "",
  zipCode: 0,
  lastName: "",
  city: "",
  firstName: "",
  country: "",
  organization: "",
  email: "",
  username: "",
  role: "",
  user_info: undefined,
  profile_picture: "",
};

const ImgStyled = styled("img")(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: ".5rem",
  borderRadius: "5px",
  cursor: "pointer",
  "&:hover": {
    opacity: "0.9",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
}));

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
}));

const TabAccount = () => {
  const authContext = useContext(AuthContext); // Access the auth context
  const [formData, setFormData] = useState<Data>(initialData);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [originalData, setOriginalData] = useState<Data>(initialData); // Added for storing original data
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false); // State for the confirmation dialog
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deleteCriteria, setDeleteCriteria] = useState<{ allowed: boolean }>({ allowed: false });
  const router = useRouter();

  const setData = () => {
    const userData = authContext?.user;
    const orgId = JSON.parse(localStorage.getItem(LOCALSTORAGE_CONSTANTS.ogrId)!);
    const org = authContext.organisations.filter((org) => org.org_id === orgId)[0];
    const profilePicture = 'data:image/jpeg;base64,' + userData?.user_info?.profile_picture || "/images/avatars/user-default-avatar.png";
    const data: Data = {
      ...formData,
      role: userData?.role,
      user_id: userData?.user_id,
      state: userData?.user_info?.address?.state,
      phoneNumber: userData?.user_info?.phone_number,
      address: userData?.user_info?.address?.street_address,
      zipCode: userData?.user_info?.address?.zip_code,
      lastName: userData?.user_info?.last_name,
      city: userData?.user_info?.address?.city,
      firstName: userData?.user_info?.first_name,
      country: userData?.user_info?.address?.country,
      organization: org.org_name,
      email: userData?.email,
      username: userData?.username,
      profile_picture: userData?.user_info?.profile_picture,
    }

    setFormData(data);
    setOriginalData(data);
    setImgSrc(profilePicture);
  }

  useEffect(() => {
    checkDeleteCriteria()
      .then((result) => {
        setDeleteCriteria(result.data);  // Assuming the response contains data property
      })
      .catch((error) => {
        console.error("Error checking delete criteria:", error);
        setDeleteCriteria({ allowed: false });
      });
  }, []);

  useEffect(() => {
    setData();
  }, []);

  const handleSaveChanges = () => {
    setIsSubmitting(true);
    const uprofile = {
      role: formData.role,
      user_info: {
        address: {
          city: formData.city,
          country: formData.country,
          state: formData.state,
          street_address: formData.address,
          zip_code: Number(formData.zipCode),
        },
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        // Check if a new image is selected before updating profile_picture
        profile_picture: formData.user_info?.profile_picture || undefined,
      },
    };

    postUserProfile(uprofile)
      .then((response: any) => {
        setIsSubmitting(false);
        if (response.status === 200) {
          // Update the user context immediately after a successful profile update
          authContext.setUser(response.data);
          toast.success('Profile updated successfully!');
          router.push('/myProfile');
        } else {
          toast.error('Profile update failed. Please try again.');
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        if (error.response && error.response.status === 400) {
          toast.error('Bad request. Please check your data and try again.');
        } else {
          toast.error('An error occurred. Please try again later.');
        }
      });
  };

  const handleInputImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const { files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const allowedExtensions = ['jpeg', 'jpg', 'png'];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        if (selectedFile.size <= 800 * 1024) {
          reader.onload = () => {
            const profilePicture: any = reader.result;
            setImgSrc(reader.result as string);
            setFormData({
              ...formData,
              user_info: {
                ...formData.user_info,
                profile_picture: profilePicture?.split(',')[1] as string,
              },
            });
          };
          reader.readAsDataURL(selectedFile);
        } else {
          toast.error(
            'Image size exceeds the limit of 800KB. Please choose a smaller image.'
          );
        }
      } else {
        toast.error('Only JPEG, JPG, and PNG files are allowed.');
      }
    }
  };

  const handleInputImageReset = () => {
    setImgSrc('data:image/jpeg;base64,' + originalData.profile_picture);
    setFormData({
      ...formData,
      user_info: {
        ...formData.user_info,
        profile_picture: "",
      },
    });
  };
  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    // Update user context
    if (authContext.user) {
      const updatedUser = {
        ...authContext.user,
        user_info: {
          ...authContext.user.user_info,
          [field]: value,
        },
      };
      authContext.setUser(updatedUser);
    }
  };

  const handleCancelChanges = () => {
    setFormData({ ...originalData });
  };

  const handleCheckboxChange = () => {
    // Toggle the checkbox state
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  const handleDeactivateAccount = () => {
    setConfirmationDialogOpen(false);
    deactivateUser()
      .then((response: any) => {
        if (response.status === 200) {
          toast.success('Account deactivated successfully!');
          authContext.logout(); // Assuming you have a logout method in your auth context
        } else {
          toast.error('Account deactivation failed. Please try again.');
        }
      })
      .catch(() => {
        toast.error('An error occurred. Please try again later.');
      });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { checkbox: false } });

  return (
    <Box>
      {/* Account Details Card */}
      <Card>
        <CardHeader title="Profile Details" />
        <form onSubmit={handleSubmit(handleSaveChanges)}>
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ImgStyled src={imgSrc && imgSrc.split(',')[1] !== "null" ? imgSrc : "/images/avatars/user-default-avatar.png"} alt="Profile Pic" />
              <div>
                <ButtonStyled variant="contained" as="label">
                  Upload New Photo
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png" // Allow only JPEG and PNG files
                    onChange={handleInputImageChange}
                    style={{ display: "none" }}
                  />
                </ButtonStyled>
                <ResetButtonStyled
                  color="secondary"
                  variant="outlined"
                  onClick={handleInputImageReset}
                >
                  Reset
                </ResetButtonStyled>
                <Typography sx={{ mt: 4, color: "text.disabled" }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </div>
            </Box>
          </CardContent>
          <Divider />
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleFormChange("firstName", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleFormChange("lastName", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={formData.email}
                  placeholder="john.doe@example.com"
                  InputProps={{ readOnly: true }}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Organization"
                  placeholder="Initializ"
                  value={formData.organization}
                  disabled
                  onChange={(e) =>
                    handleFormChange("organization", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  placeholder="202 555 0111"
                  onChange={(e) =>
                    handleFormChange("phoneNumber", e.target.value)
                  }
                // InputProps={{ startAdornment: <InputAdornment position='start'>US (+1)</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  placeholder="California"
                  value={formData.state}
                  onChange={(e) => handleFormChange("state", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Zip Code"
                  placeholder="231465"
                  value={formData.zipCode}
                  onChange={(e) => handleFormChange("zipCode", e.target.value)}
                  id="zipCode"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="country-label" htmlFor="country">
                    Country
                  </InputLabel>
                  <Select
                    id="country"
                    labelId="country-label"  // Added labelId to associate with the label
                    label="Country"
                    value={formData.country}
                    onChange={(e) => handleFormChange("country", e.target.value)}
                  >
                    {Countries.map((country) => (
                      <MenuItem key={country.code} value={country.name}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="string"
                  label="City"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleFormChange("city", e.target.value)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ pt: (theme) => `${theme.spacing(6.5)} !important` }}
              >
                <Button
                  variant="contained"
                  sx={{ mr: 4 }}
                  onClick={handleSaveChanges}
                >
                  {isSubmitting && <CircularProgress size="1.2rem" color='secondary' style={{ marginRight: '5px' }} />}
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancelChanges}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
      <br />
      {/* Delete Account Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Delete Account" />
          <CardContent>
            <form
              onSubmit={handleSubmit(() => setConfirmationDialogOpen(true))}
            >
              <Paper
                sx={{
                  background: "rgba(255, 165, 0, 0.1)",
                  p: 2,
                  mb: 4,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1" color="orange">
                  Are you sure you want to delete your account?
                  <br />
                  Once you delete your account, there is no going back. Please
                  be certain.
                </Typography>
                {!deleteCriteria.allowed && (
                  <Typography variant="body1" color="error">
                    <b>Note: </b> Before you can delete your account, you will need to delete any organization you own or transfer ownership to another user.                 </Typography>
                )}
              </Paper>
              <Box sx={{ mb: 4 }}>
                <FormControl>
                  <Controller
                    name="checkbox"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <FormControlLabel
                        label="I confirm my account deactivation"
                        sx={
                          errors.checkbox
                            ? {
                              "& .MuiTypography-root": {
                                color: "error.main",
                              },
                            }
                            : null
                        }
                        control={
                          <Checkbox
                            {...field}
                            size="small"
                            name="validation-basic-checkbox"
                            sx={
                              errors.checkbox ? { color: "error.main" } : null
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                      />
                    )}
                  />
                  {errors.checkbox && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="validation-basic-checkbox"
                    >
                      Please confirm you want to delete the account
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Button
                variant="contained"
                color="error"
                type="submit"
                onClick={() => setConfirmationDialogOpen(true)}
                disabled={!isCheckboxChecked || !deleteCriteria.allowed}  // Disable if checkbox is not checked or user cannot delete the account
              >
                Deactivate Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        onConfirm={handleDeactivateAccount}
        onCancel={() => setConfirmationDialogOpen(false)}
        message="Are you sure you want to deactivate your account?"
      />
    </Box>
  );
};

export default TabAccount;

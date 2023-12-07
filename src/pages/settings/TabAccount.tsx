import React, { useState, ChangeEvent, useEffect } from "react";
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
import { Paper, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from "@mui/material";
import { userProfile } from "src/services/authService";
import { toast } from "react-hot-toast";
import { Countries } from "src/@core/static/countries";
import { useRouter } from "next/router";
import { deactivateUser } from "src/services/authService";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
interface Data {
  email: string;
  state: string;
  address: string;
  country: string;
  lastName: string;
  currency: string;
  language: string;
  timezone: string;
  firstName: string;
  organization: string;
  phoneNumber: number | string;
  zipCode: number | string;
  city: string;
  username: string;
  user_id: string;
  role: string;
}

const initialData: Data = {
  user_id: "",
  state: "",
  phoneNumber: "",
  address: "",
  zipCode: "",
  lastName: "Doe",
  city: "",
  currency: "usd",
  firstName: "John",
  language: "arabic",
  timezone: "gmt-12",
  country: "australia",
  organization: "Pixinvent",
  email: "john.doe@example.com",
  username: "",
  role: "",
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
  const [formData, setFormData] = useState<Data>(initialData);
  const [imgSrc, setImgSrc] = useState<string>("/images/avatars/15.png");
  const [originalData, setOriginalData] = useState<Data>(initialData); // Added for storing original data
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false); // State for the confirmation dialog
  const router = useRouter();

  const fetchData = () => {
    userProfile("", "get")
      .then((response: any) => {
        const responseData = response?.data;
        setFormData({
          ...formData,
          role: responseData?.role,
          user_id: responseData?.user_id,
          state: responseData?.user_info?.address?.state,
          phoneNumber: responseData?.user_info?.phone_number,
          address: responseData?.user_info?.address?.street_address,
          zipCode: responseData?.user_info?.address?.zip_code,
          lastName: responseData?.user_info?.last_name,
          city: responseData?.user_info?.address?.city,
          firstName: responseData?.user_info?.first_name,
          country: responseData?.user_info?.address?.country,
          organization: responseData?.org,
          email: responseData?.email,
          username: responseData?.username,
        });
        setOriginalData({
          ...formData,
          role: responseData?.role,
          user_id: responseData?.user_id,
          state: responseData?.user_info?.address?.state,
          phoneNumber: responseData?.user_info?.phone_number,
          address: responseData?.user_info?.address?.street_address,
          zipCode: responseData?.user_info?.address?.zip_code,
          lastName: responseData?.user_info?.last_name,
          city: responseData?.user_info?.address?.city,
          firstName: responseData?.user_info?.first_name,
          country: responseData?.user_info?.address?.country,
          organization: responseData?.org,
          email: responseData?.email,
          username: responseData?.username,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveChanges = () => {
    const uprofile = {
      role: formData.role,
      user_info: {
        address: {
          city: formData.city,
          country: formData.country,
          state: formData.state,
          street_address: formData.address,
          zip_code: formData.zipCode,
        },
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
      },
    };

    userProfile(uprofile, "post")
      .then((response: any) => {
        if (response.status === 200) {
          toast.success('Profile updated successfully!');
          setOriginalData({ ...formData });
          router.push("/myProfile");
        } else {
          toast.error('Profile update failed. Please try again.');
        }
      })
      .catch((error) => {
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
      if (selectedFile.size <= 800 * 1024) {
        reader.onload = () => {
          setImgSrc(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        alert(
          "Image size exceeds the limit of 800KB. Please choose a smaller image."
        );
      }
    }
  };

  const handleInputImageReset = () => {
    setImgSrc("");
  };

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCancelChanges = () => {
    setFormData({ ...originalData });
  };

  const handleDeactivateAccount = () => {
    setConfirmationDialogOpen(false);
    deactivateUser()
      .then((response: any) => {
        if (response.status === 200) {
          toast.success('Account deactivated successfully!');
          // Redirect or perform additional actions after deactivation
        } else {
          toast.error('Account deactivation failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('An error occurred during account deactivation. Please try again later.');
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
            <ImgStyled src={"/images/avatars/15.png"} alt="Profile Pic" />
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
                placeholder="Initialize"
                value={formData.organization}
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  label="Country"
                  value={formData.country}
                  onChange={(e) =>
                    handleFormChange("country", e.target.value)
                  }
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
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelChanges}
              >
                Cancel
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
          <form onSubmit={handleSubmit(() => setConfirmationDialogOpen(true))}>
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
              onClick={() => setConfirmationDialogOpen(true)} // Open the confirmation dialog
              disabled={errors.checkbox !== undefined}
            >
              Deactivate Account
            </Button>

          </form>
        </CardContent>
      </Card>
    </Grid>

    {/* Confirmation Dialog */}
    <Dialog fullWidth maxWidth="xs" open={isConfirmationDialogOpen} onClose={() => setConfirmationDialogOpen(false)}>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(6)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            '& svg': { mb: 6, color: 'error.main' }
          }}
        >
          {/* Assuming you have an Icon component */}
          {/* <Icon icon="tabler:alert-circle" style={{ fontSize: 5.5 }} /> */}
          <Typography variant="body1" color="textPrimary">
            Are you sure you want to deactivate your account?
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button variant="contained" sx={{ mr: 2 }} onClick={() => handleDeactivateAccount()}>
          Yes
        </Button>
        <Button variant="outlined" color="primary" onClick={() => setConfirmationDialogOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>

  </Box>
);
};


export default TabAccount;

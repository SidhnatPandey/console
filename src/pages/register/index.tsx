import { ReactNode, useState } from "react"; // ** React Imports
import { useRouter } from "next/router"; //**the useRouter hook */
import Link from "next/link"; // ** Next Import
import Button from "@mui/material/Button"; // ** MUI Components
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box, { BoxProps } from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import { FormControl } from "@mui/material";
import CustomTextField from "src/@core/components/mui/text-field"; // ** Custom Component Import
import Icon from "src/@core/components/icon"; // ** Icon Imports
import BlankLayout from "src/@core/layouts/BlankLayout"; // ** Layout Import
import { useSettings } from "src/@core/hooks/useSettings"; // ** Hooks
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2"; // ** Demo Imports
import { signUp, checkUsername } from "src/services/authService";
const RegisterIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxHeight: 500,
  },
}));

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 450,
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: 600,
  },
  [theme.breakpoints.up("xl")]: {
    maxWidth: 750,
  },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.primary.main} !important`,
}));

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.75),
    "& .MuiFormControlLabel-label": {
      color: theme.palette.text.secondary,
    },
  })
);

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false); // ** States
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    org: "",
    agreeToTerms: false,
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    org: false,
  });
  const [submit, setSubmit] = useState(false);
  const [userNameExist, setUserNameExist] = useState(false);

  const theme = useTheme(); // ** Hooks
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const { skin } = settings; // ** Vars

  const imageSource =
    skin === "bordered"
      ? "auth-v2-register-illustration-bordered"
      : "auth-v2-register-illustration";

  const router = useRouter(); // ** Router instance
  // Helper function to validate email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Use a regular expression or any other email validation logic
    return emailRegex.test(email);
  };

  const MIN_PASSWORD_LENGTH = 5;
  const MAX_PASSWORD_LENGTH = 20;

  // ** Handle form submission
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // debugger;
    setSubmit(true);
    // ** Form validation
    if (
      formData.username.trim() === "" ||
      formData.email.trim() === "" ||
      formData.password.trim() === "" ||
      formData.org.trim() === "" ||
      !isValidEmail(formData.email)
    ) {
      setError("Please fill in all the fields.");
      return; // Exit early if the form is not valid
    }
    // Validate password length
    if (
      formData.password.length < MIN_PASSWORD_LENGTH ||
      formData.password.length > MAX_PASSWORD_LENGTH
    ) {
      setError(
        `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters long.`
      );
      return; // Exit early if password length is not valid
    }
    // Validate "agree to terms" checkbox
    if (!formData.agreeToTerms) {
      alert("Please agree to the Terms and Conditions.");
      return; // Exit early if "agree to terms" checkbox is not checked
    }
    const user = {
      type: "organisation",
      role: "Admin",
      org: formData.org,
      email: formData.email,
      password: formData.password,
      username: formData.username
    }

    setError(null);
    console.log("User Info:", user);
    signUp(user)
      .then((response) => {
        console.log(response);
        router.push("/login");
      })
      .catch((error) => {
        console.log(error);
        throw error;
      })
  };

  const checkUserExists = (username: string) => {
    if (username) {
      checkUsername(username).then((response) => {
        console.log(response);
        setUserNameExist(false);
      }).catch((error) => {
        if (error.response.status === 302) {
          setUserNameExist(true);
        }
        console.log(error);
        throw error;
      })
    }
  }
  return (
    <Box className="content-right" sx={{ backgroundColor: "background.paper" }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            borderRadius: "20px",
            justifyContent: "center",
            backgroundColor: "customColors.bodyBg",
            margin: (theme) => theme.spacing(8, 0, 8, 8),
          }}
        >
          <RegisterIllustration
            alt="register-illustration"
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <img src="../images/logo.png" alt="logo" width="90" height="90" />
            <Box sx={{ my: 1.5 }}>
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                Adventure starts here 🚀
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Make your app management easy and secure!
              </Typography>
            </Box>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <CustomTextField
                autoFocus
                fullWidth
                sx={{ mb: 4 }}
                label="Username"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                onBlur={() => { setTouched({ ...touched, username: true }); checkUserExists(formData.username) }}
                error={
                  (touched.username || submit) &&
                  (formData.username.trim() === "" || userNameExist)
                }
                helperText={
                  (touched.username || submit) && formData.username.trim() === ""
                    ? "Username cannot be empty."
                    : (userNameExist ? 'Username Already exists' : '')
                }
              />
              <CustomTextField
                fullWidth
                label="Email"
                sx={{ mb: 4 }}
                placeholder="user@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onBlur={() => setTouched({ ...touched, email: true })}
                error={
                  (touched.email || submit) &&
                  (formData.email.trim() === "" ||
                    !isValidEmail(formData.email))
                }
                helperText={
                  (touched.email || submit) &&
                  (formData.email.trim() === ""
                    ? "Email cannot be empty."
                    : !isValidEmail(formData.email)
                      ? "Please enter a valid email address."
                      : "")
                }
              />
              <CustomTextField
                fullWidth
                label="Password"
                sx={{ mb: 4 }}
                id="auth-login-v2-password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon
                          fontSize="1.25rem"
                          icon={showPassword ? "tabler:eye" : "tabler:eye-off"}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                onBlur={() => setTouched({ ...touched, password: true })}
                error={
                  (touched.password || submit) &&
                  (formData.password.trim() === "" ||
                    formData.password.length < MIN_PASSWORD_LENGTH ||
                    formData.password.length > MAX_PASSWORD_LENGTH)
                }
                helperText={
                  (touched.password || submit) &&
                  (formData.password.trim() === ""
                    ? "Password cannot be empty."
                    : formData.password.length < MIN_PASSWORD_LENGTH ||
                      formData.password.length > MAX_PASSWORD_LENGTH
                      ? `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters long.`
                      : "")
                }
              />
              <CustomTextField
                fullWidth
                label="Organization"
                placeholder="Initializ Inc."
                value={formData.org}
                onChange={(e) =>
                  setFormData({ ...formData, org: e.target.value })
                }
                onBlur={() => setTouched({ ...touched, org: true })}
                error={(touched.org || submit) && formData.org.trim() === ""}
                helperText={
                  (touched.org || submit) && formData.org.trim() === ""
                    ? "Organization cannot be empty."
                    : ""
                }
              />
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agreeToTerms: e.target.checked,
                        })
                      }
                    />
                  }
                  sx={{
                    mb: 4,
                    mt: 1.5,
                    "& .MuiFormControlLabel-label": {
                      fontSize: theme.typography.body2.fontSize,
                    },
                  }}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <Typography sx={{ color: "text.secondary" }}>
                        I agree to
                      </Typography>
                      <Typography
                        component={LinkStyled}
                        href="/"
                        onClick={(e) => e.preventDefault()}
                        sx={{ ml: 1 }}
                      >
                        privacy policy & terms
                      </Typography>
                    </Box>
                  }
                />
              </FormControl>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mb: 4 }}
              >
                Sign up
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "text.secondary", mr: 2 }}>
                  Already have an account?
                </Typography>
                <Typography component={LinkStyled} href="/login">
                  Sign in instead
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  );
};

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

Register.guestGuard = true;

export default Register;

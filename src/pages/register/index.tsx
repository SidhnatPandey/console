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
import "react-toastify/dist/ReactToastify.css";
import { FormControl } from "@mui/material";
import CustomTextField from "src/@core/components/mui/text-field"; // ** Custom Component Import
import Icon from "src/@core/components/icon"; // ** Icon Imports
import BlankLayout from "src/@core/layouts/BlankLayout"; // ** Layout Import
import { useSettings } from "src/@core/hooks/useSettings"; // ** Hooks
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2"; // ** Demo Imports
import { signUp, checkUsername, checkEmail } from "src/services/authService";
import { errorToast, successToast } from "src/lib/react-taostify";
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

const validationRules = [
  {
    regex: /^(?=.*[A-Z])/,
    message: "At least one uppercase letter",
  },
  {
    regex: /^(?=.*[a-z])/,
    message: "At least one lowercase letter",
  },
  {
    regex: /^(?=.*\d)/,
    message: "At least one number",
  },
  {
    regex: /^(?=.*[@$!%*?&])/,
    message: "At least one special character (@, $, !, %, *, ?, or &)",
  },
  {
    regex: /^.{8,}$/,
    message: "Minimum length of 8 characters",
  },
];

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
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const theme = useTheme(); // ** Hooks
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const { skin } = settings; // ** Vars

  const imageSource =
    skin === "bordered"
      ? "auth-v2-register-illustration-bordered"
      : "auth-v2-register-illustration";

  const router = useRouter(); // ** Router instance
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Use a regular expression or any other email validation logic
    return emailRegex.test(email);
  };
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSubmit(true);
    if (
      formData.username.trim() === "" ||
      formData.email.trim() === "" ||
      formData.password.trim() === "" ||
      formData.org.trim() === "" ||
      !isValidEmail(formData.email) || userNameExist || emailExist
    ) {
      setError("Please fill in all the fields.");
      return; // Exit early if the form is not valid
    }
    if (!formData.agreeToTerms) {
      errorToast("Please agree to the Terms and Conditions.");
      return; // Exit early if "agree to terms" checkbox is not checked
    }
    const user = {
      type: "organisation",
      role: "Admin",
      org: formData.org,
      email: formData.email,
      password: formData.password,
      username: formData.username,
    };

    setError(null);
    signUp(user)
      .then((response) => {
        successToast("Registered successfully")
        router.push("/login");
      })
      .catch((error) => {
        //throw error;
      });
  };

  const checkUserExists = (username: string) => {
    if (username) {
      checkUsername(username)
        .then((response) => {
          setUserNameExist(false);
        })
        .catch((error) => {
          if (error.response.status === 302) {
            setUserNameExist(true);
          }
          //throw error;
        });
    }
  };
  const handleChange = (e: { target: { value: any } }) => {
    const inputUsername = e.target.value;
    const truncatedUsername = inputUsername.slice(0, 15); // Truncate the input to a maximum length of 15 characters

    setFormData({ ...formData, username: truncatedUsername });
    setTouched({ ...touched, username: true });
    checkUserExists(truncatedUsername);

    if (truncatedUsername.length < 3 || truncatedUsername.length > 15) {
      setUsernameError("Username must be between 3 and 15 characters long.");
    } else {
      setUsernameError(null);
    }
  };

  const validatePassword = (password: string) => {
    const isValid =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g.test(
        password
      );
    setIsValidPassword(isValid);
  };

  const renderChecklistItems = () => {
    return validationRules.map((rule, index) => {
      const isValid = rule.regex.test(formData.password);
      return (
        <li key={index} className={isValid ? "valid" : "invalid"}>
          {rule.message}
        </li>
      );
    });
  };

  const checkEmailExists = (email: string) => {
    if (email) {
      checkEmail(email)
        .then((response) => {
          setEmailExist(false);
        })
        .catch((error) => {
          if (error.response.status === 302) {
            setEmailExist(true);
          }
          //throw error;
        });
    }
  };
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
                onChange={handleChange}
                name="username"
                error={
                  (touched.username || submit) &&
                  (formData.username.trim() === "" ||
                    userNameExist ||
                    !!usernameError)
                }
                helperText={
                  (touched.username || submit) &&
                  ((formData.username.trim() === "" &&
                    "Username cannot be empty.") ||
                    (userNameExist && "Username Already exists") ||
                    usernameError)
                }
              />
              <CustomTextField
                fullWidth
                label="Email"
                sx={{ mb: 4 }}
                placeholder="user@email.com"
                value={formData.email}
                name="email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onBlur={() => {
                  setTouched({ ...touched, email: true });
                  checkEmailExists(formData.email);
                }}
                error={
                  (touched.email || submit) &&
                  (formData.email.trim() === "" ||
                    !isValidEmail(formData.email) ||
                    emailExist)
                }
                helperText={
                  (touched.email || submit) &&
                    (formData.email.trim() === ""
                      ? "Email cannot be empty."
                      : !isValidEmail(formData.email))
                    ? "Please enter a valid email address."
                    : emailExist
                      ? "Email Already exists"
                      : ""
                }
              />
              <CustomTextField
                fullWidth
                label="Password"
                sx={{ mb: 4 }}
                id="auth-login-v2-password"
                type={showPassword ? "text" : "password"}
                name="password"
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
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  validatePassword(e.target.value);
                }}
                onBlur={() => setTouched({ ...touched, password: true })}
                error={touched.password && !isValidPassword}
                helperText={
                  touched.password && !isValidPassword
                    ? "Password does not meet the requirements"
                    : ""
                }
              />
              <ul className="password-checklist">{renderChecklistItems()}</ul>
              <CustomTextField
                fullWidth
                label="Organization"
                placeholder="Initializ Inc."
                value={formData.org}
                name="org"
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
                      name="checkbox"
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

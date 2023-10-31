// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stepper from "@mui/material/Stepper";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MuiStep, { StepProps } from "@mui/material/Step";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CardContent, { CardContentProps } from "@mui/material/CardContent";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// ** Third Party Imports
import toast from "react-hot-toast";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Custom Components Imports
import StepperCustomDot from "./StepperCustomDot";
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Util Import
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";

// ** Styled Component
import StepperWrapper from "src/@core/styles/mui/stepper";

import {
  sendCode,
  getGitOwner,
  getBranch,
  getRepositories,
  saveApp,
  appNameExists,
} from "src/services/appService";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { env } from 'next-runtime-env';


type FormValues = {
  application_name: string;
  git_repo: string;
  git_branch: string;
  src_code_path: string;
};

type ConfigurationValues = {
  port: number;
  http_path: string;
  env_variables: EnvironmentVariable[];
};

type EnvironmentVariable = {
  Key: string;
  Value: string;
};

const steps = [
  {
    title: "Source Code",
    icon: "tabler:users",
    subtitle: "Enter Details",
  },
  {
    title: "Configuration",
    icon: "tabler:credit-card",
    subtitle: "Environment Variables",
  },
  {
    icon: "tabler:checkbox",
    subtitle: "Review & Submit",
    title: "Review",
  },
];

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(
  ({ theme }) => ({
    borderRight: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down("md")]: {
      borderRight: 0,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  })
);

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  "& .MuiStepLabel-root": {
    paddingTop: 0,
  },
  "&:not(:last-of-type) .MuiStepLabel-root": {
    paddingBottom: theme.spacing(6),
  },
  "&:last-of-type .MuiStepLabel-root": {
    paddingBottom: 0,
  },
  "& .MuiStepLabel-iconContainer": {
    display: "none",
  },
  "& .step-subtitle": {
    color: `${theme.palette.text.disabled} !important`,
  },
  "& + svg": {
    color: theme.palette.text.disabled,
  },
  "&.Mui-completed .step-title": {
    color: theme.palette.text.disabled,
  },
}));

const defaultSourceCodeValues = {
  appNameExist: "",
  application_name: "",
  git_repo: "",
  git_branch: "",
  src_code_path: "",
};

const sourceCodeSchema = yup.object().shape({
  application_name: yup.string().required(),
  git_repo: yup.string().required(),
  git_branch: yup.string().required(),
  src_code_path: yup.string(),
});

const LoaderComponent = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
};

const defaultConfigurationValues = {
  port: 8080,
  http_path: "/",
  env_variables: [{ Key: "", Value: "" }],
};

const ConfigurationSchema = yup.object().shape({
  port: yup.number().required(),
  http_path: yup.string().required(),
  env_variables: yup.array().of(
    yup.object({
      Key: yup.string(),
      Value: yup.string(),
    })
  ),
});

const githubUrl = env('NEXT_PUBLIC_GITHUB_URL');

const StepperCustomVertical = () => {
  // ** States

  const [activeStep, setActiveStep] = useState<number>(0);
  const [repoSelected, setRepoSelected] = useState<boolean>(false);
  const [isLoadingRepositories, setLoadingRepositories] =
    useState<boolean>(false);
  const [isLoadingBranches, setLoadingBranches] = useState<boolean>(false);
  const [appNameExist, setAppNameExist] = useState(false);

  // Handle Stepper
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep === 1) {
      const sourceCodeValue = getSoruceCodeValue();
      //setSourceCodeValue();
    }
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      toast.success("Form Submitted");
    }
  };

  // Source Code
  const [repo, setRepo] = useState<string>("");
  const [gitUser, setGitUser] = useState<string>("");
  const [repositories, setRepositories] = useState<string[]>(["No Repository"]);
  const [branches, setBranches] = useState<string[]>(["No Branch"]);

  useEffect(() => {
    if (!gitUser) {
      fetchGitOwner();
    }
  }, [gitUser]);

  // react hook form
  const {
    control: sourceCodeControl,
    handleSubmit: handleSourceCodeSubmit,
    register: sourceCodeRegister,
    getValues: getSoruceCodeValue,
    formState: { errors: sourceCodeErrors },
  } = useForm({
    defaultValues: defaultSourceCodeValues,
    resolver: yupResolver(sourceCodeSchema),
  });

  const {
    control: configurationControl,
    handleSubmit: handleConfigurationSubmit,
    register: configurationRegister,
    getValues: getConfigurationValue,
    setValue: setConfigurationValue,
    formState: {
      errors: ConfigurationErrors,
      isValid: isConfigurationFormValid,
    },
  } = useForm({
    defaultValues: defaultConfigurationValues,
    resolver: yupResolver(ConfigurationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "env_variables",
    control: configurationControl,
  });

  const router = useRouter();
  if (router.query?.code && !gitUser) {
    sendCode(router.query?.code as string)
      .then((response) => {
        if (response?.git_user) {
          setGitUser(response.git_user);
          fetchUserRepositories(response.git_user as string);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  const isNextButtonDisabled = appNameExist || !isConfigurationFormValid;

  // Function to check if the application name exists
  /*   useEffect(() => {
      checkAppNameExists(appName);
    }, [appName]); */

  const checkAppNameExists = (appName: string) => {
    if (appName) {
      appNameExists(appName)
        .then((response) => {
          if (response) {
            response.status === 409
              ? setAppNameExist(true)
              : setAppNameExist(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const fetchGitOwner = async () => {
    try {
      const response = await getGitOwner();
      if (response.data) {
        setGitUser(response.data.gitUser);
        await fetchUserRepositories(response.data.gitUser as string);
      }
    } catch (error) {
      //toast.error("Could not fetch git user.");
    }
  };

  const fetchUserRepositories = async (user: string) => {
    try {
      setLoadingRepositories(true);
      const response = await getRepositories(user);
      if (response.data) {
        setRepositories(response.data);
      } else {
        toast.error("Some Error Occurred. Please try again.");
      }
    } catch (error) {
      toast.error("Could not fetch repositories.");
    } finally {
      setLoadingRepositories(false);
    }
  };

  const fetchBranch = async (repo: string) => {
    try {
      setLoadingBranches(true);
      const response = await getBranch(repo, gitUser);
      if (response.data) {
        setBranches(response.data);
      } else {
        toast.error("Some Error Occurred. Please try again.");
      }
    } catch (error) {
      toast.error("Could not fetch branches.");
    } finally {
      setLoadingBranches(false); // Set isLoadingBranches to false here
    }
  };

  const handleChange = (event: SelectChangeEvent<typeof repo>) => {
    const repo = event.target.value;
    if (repo != "No Repository") {
      setRepo(repo);
      setRepoSelected(true);
      fetchBranch(repo);
    }
  };

  const onSubmit = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      toast.success("Form Submitted");
    }
  };

  // configuration
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (getConfigurationValue("env_variables").length === 0) {
      setConfigurationValue("env_variables", [{ Key: "", Value: "" }]);
    }
    setOpen(true);
  };
  const handleClose = () => {
    const environmentVariables = getConfigurationValue("env_variables").filter(
      (variable) => variable.Key && variable.Value
    );
    setConfigurationValue("env_variables", environmentVariables);
    setOpen(false);
  };
  //configuration page environment variable
  const environmentVariables = getConfigurationValue("env_variables");
  const environmentVariablesCount = environmentVariables.filter(
    (variable) => variable.Key && variable.Value
  ).length;

  const onConfigurationSubmit = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      toast.success("Form Submitted");
    }
  };

  const handleFinalSubmit = () => {
    const data: any = { ...getSoruceCodeValue(), ...getConfigurationValue() };
    data["git_user"] = gitUser;
    console.log(data);
    saveApp(data)
      .then((response) => {
        toast.success("App Created Successfully");
        router.push({ pathname: '/apps/app-dashboard', query: { appId: response.data.app_id } });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleSourceCodeSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <Controller
                    name="application_name"
                    control={sourceCodeControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label="Application Name"
                        onChange={(e) => {
                          onChange(e);
                          setAppNameExist(false);
                        }}
                        onBlur={() => {
                          checkAppNameExists(value);
                        }}
                        placeholder="carterLeonard"
                        error={
                          (Boolean(sourceCodeErrors.application_name) || appNameExist) &&
                          !(sourceCodeErrors.application_name === undefined && !appNameExist)
                        }
                        aria-describedby="stepper-linear-account-username"
                      />

                    )}
                  />
                  {sourceCodeErrors.application_name && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-account-username"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                  {appNameExist && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="app-exists-error"
                    >
                      This application name already exists
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <h3 style={{ margin: 0 }}>Source Code Provider</h3>
                <RadioGroup
                  row
                  aria-label="colored"
                  name="colored"
                  defaultValue="primary"
                >
                  <FormControlLabel
                    value="primary"
                    control={<Radio />}
                    label="Github"
                  />
                </RadioGroup>
              </Grid>

              <Grid item xs={12} sm={12}>
                <h3 style={{ margin: "0 0 10px 0" }}>Repository</h3>
                {isLoadingRepositories ? (
                  <LoaderComponent />
                ) : (
                  <FormControl fullWidth>
                    <InputLabel
                      id="git_repo"
                      error={Boolean(sourceCodeErrors.git_repo)}
                    >
                      Repository
                    </InputLabel>

                    <Controller
                      name="git_repo"
                      control={sourceCodeControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={value}
                          label="Repository"
                          onChange={(e) => {
                            onChange(e);
                            handleChange(e);
                          }}
                          error={Boolean(sourceCodeErrors.git_repo)}
                          labelId="stepper-linear-personal-country"
                          aria-describedby="stepper-linear-personal-country-helper"
                        >
                          {repositories.map((reg) => (
                            <MenuItem key={reg} value={reg}>
                              {reg}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {sourceCodeErrors.git_repo && (
                      <FormHelperText
                        sx={{ color: "error.main" }}
                        id="stepper-linear-account-username"
                      >
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              </Grid>

              <Grid item xs={12} sm={12}>
                <p style={{ margin: 0 }}>
                  Not seeing the repositories you expected here?{" "}
                  <strong style={{ cursor: "pointer" }}>
                    <Link href={githubUrl || ""}>
                      Edit Your Github Permissions
                    </Link>
                  </strong>{" "}
                </p>
              </Grid>

              {repoSelected && (
                <>
                  <Grid item xs={12} sm={12}>
                    <h3 style={{ margin: "0 0 10px 0" }}>Branch</h3>
                    {isLoadingBranches ? (
                      <LoaderComponent />
                    ) : (
                      <FormControl fullWidth>
                        <InputLabel
                          id="git-branch"
                          error={Boolean(sourceCodeErrors.git_branch)} // Use git_branch here
                        >
                          Branch
                        </InputLabel>
                        <Controller
                          name="git_branch"
                          control={sourceCodeControl}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              value={value}
                              label="Branch"
                              onChange={onChange}
                              error={Boolean(sourceCodeErrors.git_branch)} // Use git_branch here
                              labelId="stepper-linear-personal-country"
                              aria-describedby="stepper-linear-personal-country-helper"
                            >
                              {branches.map((branch) => (
                                <MenuItem key={branch} value={branch}>
                                  {branch}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {sourceCodeErrors.git_branch && (
                          <FormHelperText
                            sx={{ color: "error.main" }}
                            id="stepper-linear-account-username"
                          >
                            This field is required
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <h3 style={{ margin: "0 0 10px 0" }}>
                      Source Directory (optional)
                    </h3>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        label="Source Directory"
                        placeholder="Source Directory"
                        {...sourceCodeRegister("src_code_path")}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  type="submit"
                  onClick={handleSourceCodeSubmit(onSubmit)}
                  disabled={isNextButtonDisabled}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 1:
        return (
          <>
            <form onSubmit={handleConfigurationSubmit(onConfigurationSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <h2>Configuration</h2>
                  <h3>Environment Variables</h3>
                </Grid>

                {/* environment variables */}
                <Grid item xs={4} sm={4}>
                  <div>{getSoruceCodeValue("application_name")}</div>
                </Grid>
                <Grid item xs={8} sm={8}>
                  <span>{environmentVariablesCount} Environment Variable</span>
                  <Button
                    aria-describedby="popover"
                    variant="contained"
                    style={{ float: "right" }}
                    onClick={handleClickOpen}
                  >
                    {" "}
                    Edit
                  </Button>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <h2>Resource Settings</h2>
                </Grid>

                {/* HTTP Port */}
                <Grid item xs={4} sm={4}>
                  <div style={{ alignItems: "center" }}>HTTP Port:</div>
                </Grid>
                <Grid item xs={8} sm={8}>
                  <TextField
                    label="HTTP Port"
                    type="number"
                    sx={{ width: 325 }}
                    error={Boolean(ConfigurationErrors.port)}
                    {...configurationRegister("port", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  {ConfigurationErrors.port && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-account-username"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </Grid>

                {/* HTTP Path */}

                <Grid item xs={4} sm={4}>
                  <div>HTTP Path:</div>
                </Grid>
                <Grid item xs={8} sm={8}>
                  <TextField
                    label="HTTP Path"
                    sx={{ width: 325 }}
                    error={Boolean(ConfigurationErrors.http_path)}
                    {...configurationRegister("http_path", { required: true })}
                  />
                  {ConfigurationErrors.http_path && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-account-username"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </Grid>

                {/* Environment Variable Dialog */}
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  style={{ zIndex: 100 }}
                  fullWidth
                >
                  <DialogTitle
                    id="max-width-dialog-title"
                    style={{ fontSize: "24px", textAlign: "center" }}
                  >
                    Edit Environment Variables
                  </DialogTitle>
                  <DialogContent>
                    <div>
                      {fields.map((field, index) => {
                        return (
                          <Grid
                            container
                            spacing={5}
                            key={field.id}
                            style={{ marginBottom: "10px" }}
                          >
                            <Grid item xs={5.5} sm={5.5}>
                              <FormControl>
                                <TextField
                                  label="Key"
                                  sx={{ width: 315 }}
                                  {...configurationRegister(
                                    `env_variables.${index}.Key` as const
                                  )}
                                ></TextField>
                              </FormControl>
                            </Grid>
                            <Grid item xs={5.5} sm={5.5}>
                              <FormControl>
                                <TextField
                                  label="Value"
                                  sx={{ width: 325 }}
                                  {...configurationRegister(
                                    `env_variables.${index}.Value` as const
                                  )}
                                ></TextField>
                              </FormControl>
                            </Grid>
                            <Grid item xs={1} sm={1}>
                              {index === fields.length - 1 && (
                                <IconButton
                                  aria-label="delete"
                                  size="large"
                                  onClick={() => append({ Key: "", Value: "" })}
                                >
                                  <AddIcon fontSize="inherit" />
                                </IconButton>
                              )}
                              {index < fields.length - 1 && (
                                <IconButton
                                  aria-label="delete"
                                  size="large"
                                  onClick={() => remove(index)}
                                >
                                  <DeleteIcon fontSize="inherit" />
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
                        );
                      })}
                    </div>
                  </DialogContent>

                  <DialogActions
                    className="dialog-actions-dense"
                    sx={{ justifyContent: "center" }}
                    style={{ marginBottom: "15px" }}
                  >
                    <Button variant="contained" onClick={handleClose}>
                      Save
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                  </DialogActions>
                </Dialog>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  type="submit"
                  onClick={handleConfigurationSubmit(onConfigurationSubmit)}
                >
                  Next
                </Button>
              </Grid>
            </form>
          </>
        );
      case 2:
        return (
          <Grid container spacing={6}>
            <Grid item xs={12} lg={6} xl={7}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ mb: 4 }}>
                    Almost done! 🚀
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Confirm your deal details information and submit to create
                    it.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableBody
                        sx={{
                          "& .MuiTableCell-root": {
                            borderBottom: 0,
                            verticalAlign: "top",
                            "&:last-of-type": { px: "0 !important" },
                            "&:first-of-type": { pl: "0 !important" },
                            py: (theme: { spacing: (arg0: number) => any }) =>
                              `${theme.spacing(0.75)} !important`,
                          },
                        }}
                      >
                        <TableRow>
                          <TableCell>
                            <Typography
                              noWrap
                              sx={{ fontWeight: 500, color: "text.secondary" }}
                            >
                              App Name
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: "text.secondary" }}>
                              {getSoruceCodeValue("application_name")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              noWrap
                              sx={{ fontWeight: 500, color: "text.secondary" }}
                            >
                              Repository
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: "text.secondary" }}>
                              {getSoruceCodeValue("git_repo")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              noWrap
                              sx={{ fontWeight: 500, color: "text.secondary" }}
                            >
                              Branch
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: "text.secondary" }}>
                              {getSoruceCodeValue("git_branch")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              noWrap
                              sx={{ fontWeight: 500, color: "text.secondary" }}
                            >
                              Env Variables
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: "text.secondary" }}>
                              {environmentVariablesCount}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              noWrap
                              sx={{ fontWeight: 500, color: "text.secondary" }}
                            >
                              HTTP Port
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: "text.secondary" }}>
                              {getConfigurationValue("port")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              noWrap
                              sx={{ fontWeight: 500, color: "text.secondary" }}
                            >
                              HTTP Path
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: "text.secondary" }}>
                              {getConfigurationValue("http_path")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              lg={6}
              xl={5}
              xs={12}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                "& img": { maxWidth: "100%" },
              }}
            >
              <Box
                sx={{
                  pt: 5,
                  px: 5,
                  width: "100%",
                  display: "flex",
                  borderRadius: 1,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  border: (theme: { palette: { divider: any } }) =>
                    `1px solid ${theme.palette.divider}`,
                  marginLeft: "20px", // You can adjust the value as needed
                }}
              >
                <img
                  height={230}
                  alt="App-Review-illustration"
                  src="/images/pages/create-deal-review-complete.png"
                />
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                size="large"
                variant="outlined"
                color="secondary"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                size="large"
                variant="contained"
                type="submit"
                color={activeStep === steps.length - 1 ? "success" : "primary"}
                {...(!(activeStep === steps.length - 1)
                  ? { endIcon: <Icon icon="tabler:chevron-right" /> }
                  : {})}
                onClick={handleFinalSubmit}
              >
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Grid>
          </Grid>
        );
      default:
        return "Unknown Step";
    }
  };

  const renderContent = () => {
    return (
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h1>Create App From Source Code</h1>
          <p>Provide data with this form to create your app.</p>
          {getStepContent(activeStep)}
        </Grid>
      </Grid>
    );
  };

  return (
    <Card sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
      <StepperHeaderContainer>
        <StepperWrapper sx={{ height: "100%" }}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            connector={<></>}
            sx={{ height: "100%", minWidth: "15rem" }}
          >
            {steps.map((step, index) => {
              const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar;

              return (
                <Step key={index}>
                  <StepLabel StepIconComponent={StepperCustomDot}>
                    <div className="step-label">
                      <RenderAvatar
                        variant="rounded"
                        {...(activeStep >= index && { skin: "light" })}
                        {...(activeStep === index && { skin: "filled" })}
                        {...(activeStep >= index && { color: "primary" })}
                        sx={{
                          ...(activeStep === index && {
                            boxShadow: (theme: { shadows: any[] }) =>
                              theme.shadows[3],
                          }),
                          ...(activeStep > index && {
                            color: (theme: {
                              palette: { primary: { main: string } };
                            }) => hexToRGBA(theme.palette.primary.main, 0.4),
                          }),
                        }}
                      >
                        <Icon icon={step.icon} />
                      </RenderAvatar>
                      <div>
                        <Typography className="step-title">
                          {step.title}
                        </Typography>
                        <Typography className="step-subtitle">
                          {step.subtitle}
                        </Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </StepperWrapper>
      </StepperHeaderContainer>
      <Divider sx={{ m: "0 !important" }} />
      <CardContent sx={{ width: "100%" }}>{renderContent()}</CardContent>
    </Card>
  );
};

export default StepperCustomVertical;

// ** React Imports
import React, { useContext, useEffect, useState } from "react";

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
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MuiStep, { StepProps } from "@mui/material/Step";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CardContent, { CardContentProps } from "@mui/material/CardContent";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import usePlan from "src/hooks/plan";


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
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  OutlinedInput,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { env } from "next-runtime-env";
import {
  LOCALSTORAGE_CONSTANTS,
  PERMISSION_CONSTANTS,
  SESSIONSTORAGE_CONSTANTS
} from "src/@core/static/app.constant";
import { AuthContext } from "src/context/AuthContext";
import { getItemFromSessionStorage, removeItemFromSessionStorage, setItemToSessionStorage } from "src/services/sessionstorageService";
import { getItemFromLocalstorage, removeItemFromLocalstorage, setItemToLocalstorage } from "src/services/locastorageService";
import useLoading from "src/hooks/loading";
import { APP_API } from "src/@core/static/api.constant"
import EnvVariables from "./envVariables";

type EnvironmentVariable = {
  key: string;
  value: string;
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

const Step = styled(MuiStep)<StepProps>(({ theme }: any) => ({
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
};

const ConfigurationSchema = yup.object().shape({
  port: yup.number().required(),
  http_path: yup.string().required()
});

const githubUrl = env("NEXT_PUBLIC_GITHUB_URL");

const CreateApp = () => {
  // ** States

  const defaultSourceCodeValues = {
    appNameExist: "",
    application_name: getItemFromSessionStorage(SESSIONSTORAGE_CONSTANTS.creatAppName),
    git_repo: "",
    git_branch: "",
    src_code_path: "",
    workspace_id: "",
  };

  const sourceCodeSchema = yup.object().shape({
    application_name: yup.string().required(),
    workspace_id: yup.string().required(),
    git_repo: yup.string().required(),
    git_branch: yup.string().required(),
    src_code_path: yup.string(),
  });

  const { isDeveloperPlan } = usePlan();

  const storedWorkspace = localStorage.getItem(
    LOCALSTORAGE_CONSTANTS.workspace
  )!;
  const [workspaceId, setWorkspaceId] = useState<string>(storedWorkspace);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [repoSelected, setRepoSelected] = useState<boolean>(false);
  const [isLoadingRepositories, setLoadingRepositories] =
    useState<boolean>(false);
  const [isLoadingBranches, setLoadingBranches] = useState<boolean>(false);
  const [appNameExist, setAppNameExist] = useState(false);
  const authContext = useContext(AuthContext);
  const { loading, startLoading, stopLoading } = useLoading();
  const [instanceSize, setInstanceSize] = useState(!isDeveloperPlan ? APP_API.instanceSizes[0] : APP_API.instanceSizes[3]);
  const [isChecked, setIsChecked] = useState(false);
  const [minValue, setMinValue] = useState('1');
  const [maxValue, setMaxValue] = useState('1');
  const [error, setError] = useState('');

  // Handle Stepper
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep === 1) {
      // const sourceCodeValue = getSoruceCodeValue();
      //setSourceCodeValue();
    }
  };

  // Source Code
  const [repo, setRepo] = useState<string>("");
  const [gitUser, setGitUser] = useState<string>("");
  const [repositories, setRepositories] = useState<string[]>(["No Repository"]);
  const [branches, setBranches] = useState<string[]>(["No Branch"]);
  const [repoError, setRepoError] = useState(false);



  useEffect(() => {
    if (!gitUser) {
      fetchGitOwner();
    }
  }, [gitUser]);

  useEffect(() => {
    setSourceCodeValue("workspace_id", workspaceId);
  }, [authContext.workspaces, workspaceId]);

  // react hook form
  const {
    control: sourceCodeControl,
    handleSubmit: handleSourceCodeSubmit,
    register: sourceCodeRegister,
    getValues: getSoruceCodeValue,
    setValue: setSourceCodeValue,
    reset: resetSourceCodeForm,
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

  const router = useRouter();

  useEffect(() => {
    if (router.query?.code) {
      sendCode(router.query?.code as string, workspaceId).then((response) => {
        if (response?.data.git_user) {
          router.replace('/create-app')
          setGitUser(response.git_user);
          fetchUserRepositories(response.git_user as string);
        }
      })
    }
  }, [router.query.code])

  const isNextButtonDisabled =
    appNameExist || !isConfigurationFormValid || repoError;

  const checkAppNameExists = (appName: string | null) => {
    if (appName) {
      appNameExists(appName).then((response) => {
        if (response) {
          response.status === 409
            ? setAppNameExist(true)
            : setAppNameExist(false);
        }
      });
    }
  };

  const fetchGitOwner = async (id: string = workspaceId) => {
    try {
      const response = await getGitOwner(id);
      if (response.data.gitUser) {
        setGitUser(response.data.gitUser);
        await fetchUserRepositories(
          response.data.gitUser as string,
          workspaceId
        );
      }
    } catch (error) {
      //toast.error("Could not fetch git user.");
    }
  };

  const fetchUserRepositories = async (user: string, id = workspaceId) => {
    if (user) {
      try {
        setLoadingRepositories(true);
        const response = await getRepositories(user, id);
        if (response.data) {
          setRepositories(response.data);
        }
      } catch (error) {
        toast.error("Could not fetch repositories.");
      } finally {
        setLoadingRepositories(false);
      }
    }
  };

  const fetchBranch = async (repo: string) => {
    resetSourceCodeForm(getSoruceCodeValue());
    try {
      setLoadingBranches(true);
      const response = await getBranch(repo, gitUser, workspaceId);
      if (response.data) {
        setBranches(response.data);
      } else {
        setBranches([]);
        setSourceCodeValue('git_branch', '');
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
      setRepoError(false);
    } else {
      setRepoError(true);
    }
  };

  //handled events
  const handleInstanceChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    const selectedInstance = (APP_API.instanceSizes).find((instance: { type: any; }) => instance.type === value);
    if (selectedInstance != null) {
      setInstanceSize(selectedInstance);
    }
  };

  const handleMinChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value.trim();
    if (!value || (Number(value) >= 1 && Number(value) <= 25)) {
      setMinValue(value);
      if (maxValue && Number(value) > Number(maxValue)) {
        setError('Min must be less than or equal to Max');
      } else {
        setError('');
      }
    } else {
      setError('Min value must be in between 1 and 25');
    }
  };

  const handleMaxChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value.trim();
    if (!value || (Number(value) >= 1 && Number(value) <= 25)) {
      setMaxValue(value);
      if (minValue && Number(value) < Number(minValue)) {
        setError('Max must be greater than or equal to Min');
      } else {
        setError('');
      }
    } else {
      setError('Max value must be in between 1 and 25');
    }
  };

  const handleverticalScalling = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIsChecked(event.target.checked);
    console.log("vertical Scalling : ", event.target.checked)
  };

  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    const workspace_id = event.target.value;
    // const workspace = authContext.workspaces.filter(workspace => workspace.id === workspace_id)[0];
    setWorkspaceId(workspace_id);
    setItemToLocalstorage(LOCALSTORAGE_CONSTANTS.workspace, workspace_id);
    setRepoSelected(false);
    setRepositories(["No Repository"]);
    fetchGitOwner(workspace_id);
  };

  const onSubmit = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      toast.success("Form Submitted");

    }

  };
  // configuration environment dialog
  const [open, setOpen] = useState(false);
  const [environmentVariables, setEnvironmentVariables] = useState<any>();
  const [envCount, setEnvCount] = useState<number>(0);

  const handleEnvDialogOpen = () => {
    setOpen(true);
  };

  const handleEnvDialogClose = (envVariables: any, count: number) => {
    setEnvironmentVariables(envVariables);
    setEnvCount(count);
    setOpen(false);
  };

  const onConfigurationSubmit = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      toast.success("Form Submitted");
    }
  };

  const handleFinalSubmit = () => {
    startLoading();

    const data: any = { ...getSoruceCodeValue(), ...getConfigurationValue() };
    data["git_user"] = gitUser;
    data.env_variables = environmentVariables;
    data.application_name = data.application_name?.trim();
    if (getItemFromSessionStorage(SESSIONSTORAGE_CONSTANTS.creatAppName)) {
      removeItemFromSessionStorage(SESSIONSTORAGE_CONSTANTS.creatAppName);
    }
    const obj = {
      instance_type: instanceSize.type,
      vertical_auto_scale: isChecked,
      max: Number(maxValue),
      min: Number(minValue)
    }
    data.instance_details = obj;

    saveApp(data)
      .then((response) => {
        console.log(data)
        toast.success("App Created Successfully");
        router.push({
          pathname: "/workspace/app-dashboard",
          query: { appId: response.data.app_id },
        });
        setTimeout(() => {
          authContext.fetchOrg();
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        stopLoading();
      })
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleSourceCodeSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="application_name"
                    control={sourceCodeControl}
                    rules={{ required: true }}
                    render={({ field: { onChange } }) => (
                      <TextField
                        value={getItemFromSessionStorage(SESSIONSTORAGE_CONSTANTS.creatAppName)}
                        label="Application Name"
                        onChange={(e: any) => {
                          onChange(e);
                          setAppNameExist(false);
                          setItemToSessionStorage(SESSIONSTORAGE_CONSTANTS.creatAppName, e.target.value)
                        }}
                        onBlur={() => {
                          checkAppNameExists(getItemFromSessionStorage(SESSIONSTORAGE_CONSTANTS.creatAppName));
                        }}
                        placeholder="Name your app"
                        error={
                          (Boolean(sourceCodeErrors.application_name) ||
                            appNameExist) &&
                          !(
                            sourceCodeErrors.application_name === undefined &&
                            !appNameExist
                          )
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
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    id="workspace_id"
                    error={Boolean(sourceCodeErrors.workspace_id)}
                  >
                    Workspaces
                  </InputLabel>

                  <Controller
                    name="workspace_id"
                    control={sourceCodeControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={value}
                        label="Workspaces"
                        onChange={(e) => {
                          onChange(e);
                          handleWorkspaceChange(e);
                        }}
                        error={Boolean(sourceCodeErrors.workspace_id)}
                        labelId="stepper-linear-personal-country"
                        aria-describedby="stepper-linear-personal-country-helper"
                      >
                        {authContext.workspaces?.map((reg) => (
                          <MenuItem key={reg.id} value={reg.id}>
                            {reg.name}
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
                        <InputLabel id="git-branch">
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
                              onChange={(e) =>
                                onChange(e)
                              }
                              error={Boolean(sourceCodeErrors.git_branch)}
                              labelId="stepper-linear-personal-country"
                              aria-describedby="stepper-linear-personal-country-helper"
                            >
                              {branches.length === 0 && <MenuItem disabled>No Branch</MenuItem>}
                              {branches.length > 0 && branches.map((branch) => (
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
                  <span>{envCount} Environment Variable</span>
                  <Button
                    aria-describedby="popover"
                    variant="contained"
                    style={{ float: "right" }}
                    onClick={handleEnvDialogOpen}
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
                  <div style={{ alignItems: "center" }}><Typography variant="body1" component="span" fontWeight="bold">HTTP Port</Typography></div>
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
                  <div><Typography variant="body1" component="span" fontWeight="bold">HTTP Path</Typography></div>
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

                {/* App Instance */}
                <Grid item xs={4} sm={4}>
                  <div><Typography variant="body1" component="span" fontWeight="bold">App Instance (AI)Size</Typography></div>
                </Grid>
                <Grid item xs={8} sm={8} style={{ marginTop: "-0.9rem" }}>
                  <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                    <Select
                      id="no_of_Instances"
                      displayEmpty
                      value={instanceSize}
                      sx={{ width: 325 }}
                      // {...configurationRegister("no_of_Instances.0.")}
                      onChange={handleInstanceChange}
                      input={<OutlinedInput />}
                      renderValue={() => {
                        return (
                          <Typography>
                            <Typography variant="body2" component="span" fontWeight="bold">
                              {instanceSize.type + "-"}
                            </Typography>
                            {instanceSize.ram + " RAM | " + instanceSize.vcpu + " vCPU"}
                          </Typography>
                        );
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                            width: 250,
                          },
                        },
                      }}
                      inputProps={{ 'aria-label': 'Without label' }}
                      disabled={!!isDeveloperPlan}
                    >
                      {APP_API.instanceSizes.map((instance, index) => (
                        <MenuItem key={index} value={instance.type}>
                          <Typography variant="body1" component="span" fontWeight="bold">
                            {instance.type + "-"}
                          </Typography>
                          {instance.ram + " RAM | " + instance.vcpu + " vCPU"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Select Instances */}
                <Grid item xs={4} sm={4}>
                  <div></div>
                </Grid>
                <Grid item xs={8} sm={8} style={{ paddingTop: '0px' }}>
                  <FormGroup style={{ display: "block" }}>
                    <FormControlLabel
                      control={<Checkbox checked={isChecked} onChange={handleverticalScalling} />}
                      label='Enable Vertical Auto-Scaling'
                      disabled={!!isDeveloperPlan}
                    />
                    <Tooltip title={"Vertical Auto-Scaling allows the App to use resources beyond the request when needed"} arrow>
                      <InfoOutlinedIcon style={{ marginBottom: '-7px', marginLeft: '-12px', padding: 0 }} id="vertical_auto_scale" />
                    </Tooltip>
                  </FormGroup>
                </Grid>

                {/* Numebr of instances */}
                <Grid item xs={4} sm={4}>
                  <div><Typography variant="body1" component="span" fontWeight="bold">Number of Instances</Typography></div>
                </Grid>
                <Grid item xs={8} sm={8}>
                  <FormGroup>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
                      <label htmlFor="min">Min</label>
                      <TextField type="text" id="min" value={minValue} onChange={handleMinChange} placeholder="1" style={{ width: "3rem" }} disabled={!!isDeveloperPlan} />
                      <label htmlFor="max">Max</label>
                      <TextField type="text" id="max" value={maxValue} onChange={handleMaxChange} placeholder="1" style={{ width: "3rem" }} disabled={!!isDeveloperPlan} />
                    </Box>
                  </FormGroup>
                </Grid>

                {/* Error */}
                <Grid xs={8} sm={8} item> <Box sx={{ marginLeft: "16rem" }}>
                  {error && <span style={{ color: 'red' }}>{error}</span>} </Box>
                </Grid>
                {/* </Grid> */}

                {/* Environment Variable Dialog */}
                <EnvVariables open={open} handleEnvDialogClose={handleEnvDialogClose} handleEnvClose={() => setOpen(false)} />
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
                  disabled={!!error}
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
                              Source Code Path
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: "text.secondary" }}>
                              {getSoruceCodeValue("src_code_path")}
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
                              {envCount}
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
                          {/* <TableRow>
                          <TableCell>
                            <Typography
                              noWrap
                              sx={{ fontWeight: 500, color: "text.secondary" }}
                            >
                              Number of Instances
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: "text.secondary" }}>
                              {getConfigurationValue("no_of_Instances")}
                            </Typography>
                          </TableCell>
                        </TableRow> */}
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
                  src="/images/pages/launch.png"
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
                disabled={loading}
                color={activeStep === steps.length - 1 ? "success" : "primary"}
                {...(!(activeStep === steps.length - 1)
                  ? { endIcon: <Icon icon="tabler:chevron-right" /> }
                  : {})}
                onClick={handleFinalSubmit}
              >
                {/* {activeStep === steps.length - 1 ? "Submit" : "Next"} */}
                {loading ? <><CircularProgress size="1.2rem" color='secondary' style={{ marginRight: '5px' }} />Submitting</> : 'Submit'}
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

CreateApp.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.createApp,
};

export default CreateApp;

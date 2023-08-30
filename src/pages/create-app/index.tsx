// ** React Imports
import { ChangeEvent, Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import MuiStep, { StepProps } from '@mui/material/Step'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CardContent, { CardContentProps } from '@mui/material/CardContent'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper';

import { sendCode, getGitOwner, getBranch, getRepositories } from '../../services/appService';
import { errorToast } from 'src/lib/react-taostify';
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Dialog, FormControlLabel, FormHelperText, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { Container } from '@mui/system';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type FormValues = {
    application_name: string
    git_repo: string
    git_branch: string
    src_code_path: string
}

const steps = [
    {
        title: 'Source Code',
        icon: 'tabler:users',
        subtitle: 'Enter Details'
    },
    {
        title: 'Configuration',
        icon: 'tabler:credit-card',
        subtitle: 'Environment Variables'
    },
    {
        icon: 'tabler:checkbox',
        subtitle: 'Review & Submit',
        title: 'Review'
    }
]

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
    borderRight: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('md')]: {
        borderRight: 0,
        borderBottom: `1px solid ${theme.palette.divider}`
    }
}))

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
    '& .MuiStepLabel-root': {
        paddingTop: 0
    },
    '&:not(:last-of-type) .MuiStepLabel-root': {
        paddingBottom: theme.spacing(6)
    },
    '&:last-of-type .MuiStepLabel-root': {
        paddingBottom: 0
    },
    '& .MuiStepLabel-iconContainer': {
        display: 'none'
    },
    '& .step-subtitle': {
        color: `${theme.palette.text.disabled} !important`
    },
    '& + svg': {
        color: theme.palette.text.disabled
    },
    '&.Mui-completed .step-title': {
        color: theme.palette.text.disabled
    }
}))

const defaultSourceCodeValues = {
    application_name: '',
    git_repo: '',
    git_branch: '',
    src_code_path: ''
}

const sourceCodeSchema = yup.object().shape({
    application_name: yup.string().required(),
    git_repo: yup.string().required(),
    git_branch: yup.string().required(),
    src_code_path: yup.string()
})

const StepperCustomVertical = () => {
    // ** States

    const [activeStep, setActiveStep] = useState<number>(0)

    // Handle Stepper
    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }
    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
        if (activeStep === steps.length - 1) {
            toast.success('Form Submitted')
        }
    }

    // Source Code
    const [repo, setRepo] = useState<string>('')
    const [gitUser, setGitUser] = useState<string>('');
    const [repositories, setRepositories] = useState<string[]>([]);
    const [branches, setBranches] = useState<string[]>([]);

    useEffect(() => {
        if (!gitUser) {
            fetchGitOwner()
        }
    }, [gitUser])

    // react hook form
    const form = useForm<FormValues>();
    const { register, control, handleSubmit } = form;

    const {
        reset: accountReset,
        control: accountControl,
        handleSubmit: handleAccountSubmit,
        register: sourceCodeRegister,
        formState: { errors: accountErrors }
    } = useForm({
        defaultValues: defaultSourceCodeValues,
        resolver: yupResolver(sourceCodeSchema)
    })

    const router = useRouter()
    if (router.query?.code && !gitUser) {
        sendCode(router.query?.code as string)
            .then(response => {
                setGitUser(response.git_user);
                fetchUserRepositories(response.git_user as string);
            })
            .catch(error => {
                errorToast(error.message);
            })
    }

    const fetchGitOwner = () => {
        getGitOwner().then(response => {
            console.log();
            setGitUser(response.data.gitUser);
            fetchUserRepositories(response.data.gitUser as string);
        }).catch(error => {
            console.log(error);
        })
    }

    const fetchUserRepositories = (user: string) => {
        console.log(user);
        getRepositories(user).then(response => {
            console.log(response);
            setRepositories(response.data);
        })
    }

    const fetchBranch = (repo: string) => {
        console.log(gitUser);
        getBranch(repo, gitUser).then(response => {
            console.log(response);
            setBranches(response.data);
        })
    }

    const handleChange = (event: SelectChangeEvent<typeof repo>) => {
        const repo = event.target.value
        setRepo(repo);
        fetchBranch(repo);
    }

    const onSubmit = (data: FormValues) => {
        console.log(data);
        alert("called ")
        setActiveStep(prevActiveStep => prevActiveStep + 1)
        if (activeStep === steps.length - 1) {
            toast.success('Form Submitted')
        }
    }

    // configuration
    const [environmentVariables, setEnvironmentVariables] = useState<any>();
    const [httpPort, setHttpPort] = useState('');
    const [httpPath, setHttpPath] = useState('');
    const [editingEnvironmentVariables, setEditingEnvironmentVariables] = useState(false);
    const [newKey, setNewKey] = useState('');
    const [open, setOpen] = useState(false);
    const [newValue, setNewValue] = useState('');
    const [keyValuePairs, setKeyValuePairs] = useState([{ key: '', value: '' }]);

    const handleAddKeyValuePair = () => {
        setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
        setEnvironmentVariables([environmentVariables, { key: newKey, value: newValue }]);
        setNewKey('');
        setNewValue('');
    };

    const updateEnvironmentVariables = (pairs: any) => {
        const newEnvironmentVariables = pairs.map((pair: { key: any; value: any; }) => ({
            key: pair.key,
            value: pair.value,
        }));
        setEnvironmentVariables(newEnvironmentVariables);
    };

    const handleKeyValuePairChange = (index: any, key: any, value: any) => {
        const updatedPairs = [...keyValuePairs];
        updatedPairs[index] = { key, value };
        setKeyValuePairs(updatedPairs);
        updateEnvironmentVariables(updatedPairs);
    };

    const handleDeleteKeyValuePair = (index: any) => {
        const updatedPairs = keyValuePairs.filter((_, i) => i !== index);
        setKeyValuePairs(updatedPairs);
        updateEnvironmentVariables(updatedPairs);
    };

    const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("HTTP Port Value:", event.target.value); // Check if the value is being captured
        setHttpPort(event.target.value);
    };

    const handlePathChange = (event: any) => {
        console.log("HTTP Path Value:", event.target.value); // Check if the value is being captured
        setHttpPath(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const logData = () => {
        console.log("Configuration Data:");
        console.log("Environment Variables:", keyValuePairs);
        console.log("HTTP Port:", httpPort);
        console.log("HTTP Path:", httpPath);
    };


    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <form onSubmit={handleAccountSubmit(onSubmit)}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={12}>
                                {/* <FormControl fullWidth>
                                    <TextField type='text' label='Application Name' id='application_name' {...register("application_name")} placeholder='Application Name' />
                                </FormControl> */}
                                <FormControl fullWidth>
                                    <Controller
                                        name='application_name'
                                        control={accountControl}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='Application Name'
                                                onChange={onChange}
                                                placeholder='carterLeonard'
                                                error={Boolean(accountErrors.application_name)}
                                                aria-describedby='stepper-linear-account-username'
                                            />
                                        )}
                                    />
                                    {accountErrors.application_name && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                                            This field is required
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <h3 style={{ margin: 0 }}>Source Code Provider</h3>
                                <RadioGroup row aria-label='colored' name='colored' defaultValue='primary'>
                                    <FormControlLabel value='primary' control={<Radio />} label='Github' />
                                    {/* <FormControlLabel value='secondary' control={<Radio />} label='Bitbucket' /> */}
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <h3 style={{ margin: '0 0 10px 0' }}>Repository</h3>
                                <FormControl fullWidth >
                                    <InputLabel id='git_repo'>Repository</InputLabel>
                                    <Select
                                        labelId='git_repo'
                                        input={<OutlinedInput label='Region' />}
                                        id='git_repo'
                                        error={Boolean(accountErrors.git_repo)}
                                        {...sourceCodeRegister("git_repo", {
                                            onChange: handleChange
                                        })}
                                    >
                                        {repositories.map(reg => (
                                            <MenuItem key={reg} value={reg}>
                                                {reg}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {accountErrors.git_repo && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                                            This field is required
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <p style={{ margin: 0 }}>Not seeing the repositories you expected here? <strong style={{ cursor: 'pointer' }}><Link href='https://github.com/apps/testApp21/installations/new'>Edit Your Github Permissions</Link></strong> </p>
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <h3 style={{ margin: '0 0 10px 0' }}>Branch</h3>
                                <FormControl fullWidth>
                                    <InputLabel
                                        id='git-branch'>
                                        Branch
                                    </InputLabel>
                                    <Select
                                        labelId='git_branch'
                                        input={<OutlinedInput label='Branch' />}
                                        id='git_branch'
                                        error={Boolean(accountErrors.git_repo)}
                                        {...sourceCodeRegister("git_branch")}
                                    >
                                        {branches.map(branch => (
                                            <MenuItem key={branch} value={branch}>
                                                {branch}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {accountErrors.git_branch && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                                            This field is required
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <h3 style={{ margin: '0 0 10px 0' }}>Source Directory (optional)</h3>
                                <FormControl fullWidth>
                                    <TextField type='text' label='Source Directory' placeholder='Application Name' />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button size='large' variant='outlined' color='secondary' disabled={activeStep === 0} onClick={handleBack}>
                                    Back
                                </Button>
                                <Button size='large' variant='contained' type='submit' onClick={handleAccountSubmit(onSubmit)}>
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )
            case 1:
                return (
                    <Container>
                        <Grid container spacing={5}>

                            <div style={{ width: "100%" }}>
                                <h2>Configuration</h2>
                                <div className="section">
                                    <h3>Environment Variables</h3>

                                    <div className="section" >
                                        <h3 style={{ display: "flex", width: '100%', justifyContent: 'space-between', fontWeight: 'normal' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <span style={{ marginLeft: '10px' }}>api</span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span>

                                                    {environmentVariables?.length ? environmentVariables?.length : 0} Environment Variable{environmentVariables?.length !== 1 && 's'}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {editingEnvironmentVariables ? (
                                                    <button style={{ marginRight: '2rem' }} onClick={() => setEditingEnvironmentVariables(false)}>Cancel</button>
                                                ) : (
                                                    <Button aria-describedby="popover" variant="contained" onClick={handleClickOpen}>
                                                        Edit
                                                    </Button>)}

                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                    style={{ zIndex: 100 }}
                                                >
                                                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <h3 style={{ marginBottom: '1rem' }}>Edit Environment Variables</h3>
                                                        <Box
                                                            component="form"
                                                            sx={{
                                                                '& .MuiTextField-root': { m: 1, width: '25ch' },
                                                            }}
                                                            noValidate
                                                            autoComplete="off"
                                                        >
                                                            {keyValuePairs.map((pair, index) => (
                                                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>

                                                                    <TextField
                                                                        label="Key"
                                                                        placeholder="Key"
                                                                        value={pair.key}
                                                                        onChange={(e) => handleKeyValuePairChange(index, e.target.value, pair.value)}

                                                                    />

                                                                    <TextField
                                                                        label="Value"
                                                                        placeholder="Value"
                                                                        value={pair.value}
                                                                        onChange={(e) => handleKeyValuePairChange(index, pair.key, e.target.value)}
                                                                    />
                                                                    <IconButton
                                                                        aria-label="delete"
                                                                        onClick={() => handleDeleteKeyValuePair(index)}
                                                                        style={{ marginLeft: '1rem' }}
                                                                    >

                                                                    </IconButton>
                                                                </div>
                                                            ))}
                                                        </Box>
                                                        <button onClick={handleAddKeyValuePair} style={{ alignSelf: 'flex-end' }}>+</button>
                                                        <Button variant="contained" onClick={handleClose}>Save</Button>
                                                    </div>
                                                </Dialog>


                                            </div>
                                        </h3>
                                    </div>
                                </div>
                            </div>

                        </Grid>

                        <h2>Resource Settings</h2>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>HTTP Port:</span>
                            <span style={{ marginRight: '375px' }}></span> {/* Add space */}
                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': { m: 1, width: '30ch' },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <div>
                                    <TextField
                                        label="HTTP Port"
                                        id="http-port"
                                        defaultValue={httpPort}
                                    />
                                </div>
                            </Box>
                        </div>


                        <br />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>HTTP Path:</span>
                            <span style={{ marginRight: '375px' }}></span> {/* Add space */}
                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': { m: 1, width: '30ch' },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <div>
                                    <TextField
                                        label="HTTP Path"
                                        id="http-path"
                                        value={httpPath}
                                        onChange={(e) => setHttpPath(e.target.value)}

                                    />
                                </div>
                            </Box>
                        </div>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button size='large' variant='outlined' color='secondary' disabled={activeStep === 0} onClick={handleBack}>
                                Back
                            </Button>
                            <Button size='large' variant='contained' type='submit' onClick={handleNext}>
                                Next
                            </Button>
                        </Grid>
                    </Container>
                )
            case 2:
                return (
                    <Container>
                        <Grid container spacing={6}>
                            <Grid item xs={12} lg={6} xl={7}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" sx={{ mb: 4 }}>
                                            Almost done! 🚀
                                        </Typography>
                                        <Typography sx={{ color: "text.secondary" }}>
                                            Confirm your deal details information and submit to create it.
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
                                                            py: (theme) => `${theme.spacing(0.75)} !important`,
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
                                                                api
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
                                                                initializ/api
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
                                                                main
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
                                                                2
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
                                                                8080
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
                                                                /
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
                                        border: (theme) => `1px solid ${theme.palette.divider}`,
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

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button size='large' variant='outlined' color='secondary' disabled={activeStep === 0} onClick={handleBack}>
                                    Back
                                </Button>
                                <Button size='large' variant='contained' type='submit' onClick={handleNext}>
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                )
            default:
                return 'Unknown Step'
        }
    }

    const renderContent = () => {
        return (
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <h1>Create App From Source Code</h1>
                    <p>Provide data with this form to create your app.</p>
                    {getStepContent(activeStep)}
                </Grid>
                {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            size='large'
                            variant='outlined'
                            color='secondary'
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <Button size='large' variant='contained' type='submit' onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                        </Button>
                    </Grid> */}
            </Grid>
        )
    }

    return (
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <StepperHeaderContainer>
                <StepperWrapper sx={{ height: '100%' }}>
                    <Stepper
                        activeStep={activeStep}
                        orientation='vertical'
                        connector={<></>}
                        sx={{ height: '100%', minWidth: '15rem' }}
                    >
                        {steps.map((step, index) => {
                            const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

                            return (
                                <Step key={index}>
                                    <StepLabel StepIconComponent={StepperCustomDot}>
                                        <div className='step-label'>
                                            <RenderAvatar
                                                variant='rounded'
                                                {...(activeStep >= index && { skin: 'light' })}
                                                {...(activeStep === index && { skin: 'filled' })}
                                                {...(activeStep >= index && { color: 'primary' })}
                                                sx={{
                                                    ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                                                    ...(activeStep > index && { color: theme => hexToRGBA(theme.palette.primary.main, 0.4) })
                                                }}
                                            >
                                                <Icon icon={step.icon} />
                                            </RenderAvatar>
                                            <div>
                                                <Typography className='step-title'>{step.title}</Typography>
                                                <Typography className='step-subtitle'>{step.subtitle}</Typography>
                                            </div>
                                        </div>
                                    </StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>
                </StepperWrapper>
            </StepperHeaderContainer>
            <Divider sx={{ m: '0 !important' }} />
            <CardContent sx={{ width: '100%' }}>{renderContent()}</CardContent>
        </Card>
    )
}

export default StepperCustomVertical

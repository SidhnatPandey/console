// ** React Imports
import { useEffect, useState } from 'react'

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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormHelperText, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type FormValues = {
    application_name: string
    git_repo: string
    git_branch: string
    src_code_path: string
}

type ConfigurationValues = {
    port: number
    http_path: string
    env_variables: EnvironmentVariable[]
}

type EnvironmentVariable = {
    Key: string
    Value: string
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

const defaultConfigurationValues = {
    port: 8080,
    http_path: '/',
    env_variables: [{ Key: '', Value: '' }]
}

const ConfigurationSchema = yup.object().shape({
    port: yup.number().required(),
    http_path: yup.string().required(),
    git_branch: yup.string().required(),
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
    const {
        reset: accountReset,
        control: accountControl,
        handleSubmit: handleAccountSubmit,
        register: sourceCodeRegister,
        getValues: getSoruceCodeValue,
        formState: { errors: accountErrors }
    } = useForm({
        defaultValues: defaultSourceCodeValues,
        resolver: yupResolver(sourceCodeSchema)
    })

    const {
        control: configurationControl,
        handleSubmit: handleConfigurationSubmit,
        register: configurationRegister,
        getValues: getConfigurationValue,
        formState: { errors: ConfigurationErrors }
    } = useForm({
        defaultValues: defaultConfigurationValues,
        resolver: yupResolver(ConfigurationSchema)
    })

    const { fields, append, remove } = useFieldArray({
        name: 'env_variables',
        control: configurationControl
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
            setGitUser(response.data.gitUser);
            fetchUserRepositories(response.data.gitUser as string);
        }).catch(error => {
        })
    }

    const fetchUserRepositories = (user: string) => {
        getRepositories(user).then(response => {
            setRepositories(response.data);
        })
    }

    const fetchBranch = (repo: string) => {
        getBranch(repo, gitUser).then(response => {
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
        setActiveStep(prevActiveStep => prevActiveStep + 1)
        if (activeStep === steps.length - 1) {
            toast.success('Form Submitted')
        }
    }

    // configuration
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };
    const onConfigurationSubmit = (data: ConfigurationValues) => {
        console.log(data);
        setActiveStep(prevActiveStep => prevActiveStep + 1)
        if (activeStep === steps.length - 1) {
            toast.success('Form Submitted')
        }
    }

    const handleFinalSubmit = () => {
        const data = { ...getSoruceCodeValue(), ...getConfigurationValue() }
        console.log(data);

    }

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <form onSubmit={handleAccountSubmit(onSubmit)}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={12}>
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
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <h3 style={{ margin: '0 0 10px 0' }}>Repository</h3>
                                <FormControl fullWidth >
                                    <InputLabel id='git_repo' error={Boolean(accountErrors.git_repo)}>Repository</InputLabel>
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
                                        id='git-branch' error={Boolean(accountErrors.git_repo)}>
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
                    <form onSubmit={handleConfigurationSubmit(onConfigurationSubmit)}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={12}>
                                <h2>Configuration</h2>
                                <h3>Environment Variables</h3>
                            </Grid>

                            {/* environment variables */}
                            <Grid item xs={4} sm={4}>
                                <div >{getSoruceCodeValue('application_name')}</div>
                            </Grid>
                            <Grid item xs={8} sm={8}>
                                <span>{getConfigurationValue('env_variables').length} Environment Variable</span>
                                <Button aria-describedby="popover" variant="contained" style={{ float: 'right' }} onClick={handleClickOpen}> Edit</Button>
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <h2>Resource Settings</h2>
                            </Grid>



                            {/* HTTP Port */}
                            <Grid item xs={4} sm={4}>
                                <div style={{ alignItems: 'center' }}>HTTP Port:</div>
                            </Grid>
                            <Grid item xs={8} sm={8}>
                                <TextField label="HTTP Port" type='number' sx={{ width: 325 }} {...configurationRegister('port')} />
                            </Grid>

                            {/* HTTP Path */}

                            <Grid item xs={4} sm={4}>
                                <div >HTTP Path:</div>
                            </Grid>
                            <Grid item xs={8} sm={8}>
                                <TextField label="HTTP Path" sx={{ width: 325 }} {...configurationRegister('http_path')} />
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
                                <DialogTitle id='max-width-dialog-title' style={{ fontSize: '24px', textAlign: 'center' }}>Edit Environment Variables</DialogTitle>
                                <DialogContent>
                                    <div>
                                        {
                                            fields.map((field, index) => {
                                                return (
                                                    <Grid container spacing={5} key={field.id} style={{ marginBottom: '10px' }}>
                                                        <Grid item xs={5.5} sm={5.5}>
                                                            <FormControl>
                                                                <TextField
                                                                    label='Key'
                                                                    sx={{ width: 315 }}
                                                                    {...configurationRegister(`env_variables.${index}.Key` as const)}
                                                                ></TextField>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={5.5} sm={5.5}>
                                                            <FormControl>
                                                                <TextField
                                                                    label='Value'
                                                                    sx={{ width: 325 }}
                                                                    {...configurationRegister(`env_variables.${index}.Value` as const)}
                                                                ></TextField>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={1} sm={1}>
                                                            {index === (fields.length - 1) && (
                                                                <IconButton aria-label="delete" size="large" onClick={() => append({ Key: '', Value: '' })} >
                                                                    <AddIcon fontSize="inherit" />
                                                                </IconButton>

                                                            )}
                                                            {index < (fields.length - 1) && (
                                                                <IconButton aria-label="delete" size="large" onClick={() => remove(index)}>
                                                                    <DeleteIcon fontSize="inherit" />
                                                                </IconButton>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </div>
                                </DialogContent>

                                <DialogActions className='dialog-actions-dense' sx={{ justifyContent: "center" }} style={{ marginBottom: '15px' }}>
                                    <Button variant="contained" onClick={handleClose}>Save</Button>
                                    <Button onClick={handleClose}>Close</Button>
                                </DialogActions>
                            </Dialog>
                        </Grid >

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button size='large' variant='outlined' color='secondary' disabled={activeStep === 0} onClick={handleBack}>
                                Back
                            </Button>
                            <Button size='large' variant='contained' type='submit' onClick={handleNext}>
                                Next
                            </Button>
                        </Grid>
                    </form >
                )
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
                                                            {getSoruceCodeValue('application_name')}
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
                                                            {getSoruceCodeValue('git_repo')}
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
                                                            {getSoruceCodeValue('git_branch')}
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
                                                            {getConfigurationValue('env_variables').length}
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
                                                            {getConfigurationValue('port')}
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
                                                            {getConfigurationValue('http_path')}
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
                            <Button size='large' variant='contained' type='submit'
                                color={(activeStep === steps.length - 1) ? 'success' : 'primary'}
                                {...(!(activeStep === steps.length - 1) ? { endIcon: <Icon icon='tabler:chevron-right' /> } : {})}
                                onClick={handleFinalSubmit}
                            >
                                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                            </Button>

                        </Grid>
                    </Grid>
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

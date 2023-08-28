// ** React Imports
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import { FormControlLabel, Link, Radio, RadioGroup } from '@mui/material'
import { useRouter } from 'next/router'


//service
import { sendCode, getGitOwner, getBranch, getRepositories } from '../../services/appService';
import { errorToast } from 'src/lib/react-taostify';
import { useForm } from 'react-hook-form'

type FormValues = {
  application_name: string
  git_repo: string
  git_branch: string
  src_code_path: string
}


const SourceCode = (props: any) => {

  // ** States
  const [repo, setRepo] = useState<string>('')
  const [gitUser, setGitUser] = useState<string>('');
  const [repositories, setRepositories] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);

  // ** Hook
  const theme = useTheme()

  useEffect(() => {
    if (!gitUser) {
      fetchGitOwner()
    }
  }, [gitUser])

  /* useImperativeHandle(ref, () => ({
    showAlert() {
      console.log(form.getValues());
      alert("Hello from Child Component")
    }
  })) */

  // react hook form
  const form = useForm<FormValues>();
  const { register, control, handleSubmit } = form;

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
    console.log("Form Submitted", data)
  }

  return (
    <div>
      <h1>Create App From Source Code</h1>
      <p>Provide data with this form to create your app.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <TextField type='text' label='Application Name' id='application_name' {...register("application_name")} placeholder='Application Name' />
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
              <InputLabel id='select-region'>Repository</InputLabel>
              <Select
                value={repo}
                labelId='git_repo'
                input={<OutlinedInput label='Region' />}
                id='git_repo'
                {...register("git_repo", {
                  onChange: handleChange
                })}
              >
                {repositories.map(reg => (
                  <MenuItem key={reg} value={reg}>
                    {reg}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <p style={{ margin: 0 }}>Not seeing the repositories you expected here? <strong style={{ cursor: 'pointer' }}><Link href='https://github.com/apps/testApp21/installations/new'>Edit Your Github Permissions</Link></strong> </p>
          </Grid>

          <Grid item xs={12} sm={12}>
            <h3 style={{ margin: '0 0 10px 0' }}>Branch</h3>
            <FormControl fullWidth>
              <InputLabel id='select-region'>Branch</InputLabel>
              <Select
                value={repo}
                labelId='select-region'
                onChange={handleChange}
                placeholder='main'
                input={<OutlinedInput label='Region' />}
              >
                {branches.map(branch => (
                  <MenuItem key={branch} value={branch}>
                    {branch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <h3 style={{ margin: '0 0 10px 0' }}>Source Directory (optional)</h3>
            <FormControl fullWidth>
              <TextField type='text' label='Source Directory' placeholder='Application Name' />
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default SourceCode

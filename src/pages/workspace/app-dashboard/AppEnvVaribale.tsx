import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { height } from '@mui/system';
import React, { useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EnvVariables from 'src/pages/create-app/envVariables';
import CreateApp from 'src/pages/create-app';
import {App} from './index'
import { string } from 'yup';
interface EnvVariableArrayProp {
    key: string,
    type: string,
    stg: string,
    test: string,
    prod: string
}[];

interface AppEnvVaribaleProp{
    Data : App
}

const AppEnvVaribale = (Prop: any) => {

    const [passwordVisible, setPasswordVisible] = useState<boolean[]>(Array(10).fill(true));
    const [open,setOpen]=useState<boolean>(false)
    const [environmentVariables, setEnvironmentVariables] = useState<any>();
    const {Data} = Prop ;
    const EnvData= Data.env_variables;
    console.log("new", Prop);


   


    const EnvVariableArray = Object.keys(EnvData?.test).map(index => {
        const key = EnvData.test[index].key.trim();
        const type= EnvData.test[index].type.trim();
        return {
            key,
            type,
            stg: EnvData.stg[index].value,
            test: EnvData.test[index].value,
            prod: EnvData.prod[index].value,
            //  isSecret:  EnvData.stg[index].is_secret
        };
    });
    // const EnvVariableArray = (EnvData?.test || []).map((item, index) => {
    //     const key = item.key.trim();

    //     return {
    //         key,
    //         stg: (EnvData?.stg || [])[index]?.value,
    //         test: item.value,
    //         prod: (EnvData?.prod || [])[index]?.value,
    //         //  isSecret:  (EnvData?.stg || [])[index]?.is_secret
    //     };
    // });

    console.log("val", EnvVariableArray);





    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        setPasswordVisible((prevState) => {
            const updatedVisible = [...prevState]; // Create a copy of the array
            updatedVisible[index] = !updatedVisible[index]; // Toggle the visibility of the clicked item
            return updatedVisible;
        });
    }
    const handleEnvDialogClose=()=>{
        setEnvironmentVariables(EnvData);
        setOpen(false);
     }
    const handleClickOpen=(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
       console.log("hello");
    //  handleEnvDialogOpen()
     setOpen(true);
     
   
    }

    return (



        <Grid container spacing={1}>
            <Grid item xs={6} sm={6}><Typography variant="h4">
                Environment Variables
            </Typography></Grid>

            <Grid item xs={6} sm={6}><Typography variant="h4">
                <Box display="flex" justifyContent="flex-end" alignItems="center"   >
                    <Button
                        aria-describedby="popover"
                        variant="contained"
                        color="inherit"
                    onClick={handleClickOpen}
                    >
                        {" "}
                        Edit
                    </Button>
                </Box>
            </Typography></Grid>
            <EnvVariables open={open} handleEnvDialogClose={handleEnvDialogClose} handleEnvClose={() => setOpen(false)} />

            <Grid item xs={3} sm={3}><Typography variant="h4">
                Environments
            </Typography></Grid>
            <Grid item xs={3} sm={3}><Typography variant="h4">
                Test
            </Typography></Grid>
            <Grid item xs={3} sm={3}><Typography variant="h4">
                Stage
            </Typography></Grid>
            <Grid item xs={3} sm={3}><Typography variant="h4">
                Production
            </Typography></Grid>

            {

                EnvVariableArray.map((item, index) => (
                    <>
                        {/* <Grid item xs={3} sm={3} sx={{ display: 'flex', alignItems: 'center' ,marginBottom: 1 }}>
                            <CustomChip sx={{ height: 20, marginRight: 0.5 }} rounded label={"secret"} skin='light' color={"secondary"} />
                            <TextField
                                variant="standard"
                                type="text"
                                value={item.key}
                                InputProps={{ readOnly: true, disableUnderline: true }}

                            />
                        </Grid>
                        <Grid item xs={3} sm={3} sx={{marginBottom: 1 }}> <TextField
                            variant="standard"
                            type="text"
                            value={item.test}
                            InputProps={{ readOnly: true, disableUnderline: true }}

                        /></Grid>
                        <Grid item xs={3} sm={3}sx={{marginBottom: 1 }}> <TextField
                            variant="standard"
                            type={index == 2 ? "password" : "text"}
                            value={item.stg}
                            InputProps={{ readOnly: true, disableUnderline: true }}

                        /></Grid>
                        <Grid item xs={3} sm={3} sx={{marginBottom: 1 }}> <TextField
                            variant="standard"
                            type="text"
                            value={item.prod}
                            InputProps={{ readOnly: true, disableUnderline: true }}

                        />
                            <IconButton
                                aria-label="toggle password visibility"
                                //onClick={(e) => (togglePasswordVisibility(e, index))}
                                // onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {index==2?<VisibilityOffIcon /> :<VisibilityIcon/> }
                            </IconButton>
                        </Grid> */}
                        <Grid container spacing={1} sx={{ marginBottom: 1 }}>
                            <Grid item xs={3} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
                                <CustomChip sx={{ height: 20, marginRight: 0.5 }} rounded label={"secret"} skin='light' color={"secondary"} />
                                <TextField
                                    variant="standard"
                                    type="text"
                                    value={item.key}
                                    InputProps={{ readOnly: true, disableUnderline: true }}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3}>
                                <TextField
                                    variant="standard"
                                    type={passwordVisible[index] ? "password" : "text"}
                                    value={item.test}
                                    InputProps={{ readOnly: true, disableUnderline: true }}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3}>
                                <TextField
                                    variant="standard"
                                    type={passwordVisible[index] ? "password" : "text"}
                                    value={item.stg}
                                    InputProps={{ readOnly: true, disableUnderline: true }}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3}>
                                <TextField
                                    variant="standard"
                                    type={passwordVisible[index] ? "password" : "text"}
                                    value={item.prod}
                                    InputProps={{ readOnly: true, disableUnderline: true }}
                                />
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={(e) => (togglePasswordVisibility(e, index))}
                                    // onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {passwordVisible[index] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </Grid>
                        </Grid>



                    </>

                ))
            }



        </Grid>
    )
}

export default AppEnvVaribale





import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EnvVariables from 'src/pages/create-app/envVariables';
import { editApp } from 'src/services/appService';
import Toaster from 'src/utils/toaster';
interface EnvFormType {
    key: string;
    KeyType: string;
    prod: string;
    stg: string;
    test: string;
    Checked: boolean;
}

interface AppEnvVaribaleProps {
    Data: any;
    showEdit: boolean,
    setHideEdit(state: boolean): void
}
const AppEnvVaribale = (props: AppEnvVaribaleProps) => {
    const [passwordVisible, setPasswordVisible] = useState<boolean[]>(Array(10).fill(true));
    const [open, setOpen] = useState<boolean>(false)
    const { showEdit, Data, setHideEdit } = props;
    const EnvData = Data.env_variables
    const envArr: any[] = [];
    const [dataArr, setDataArr] = useState<any[]>([]);

    const checkIfKeyExists = (key: string) => {
        const existingValues = envArr;
        const index = existingValues.map(e => e.key).indexOf(key);
        return index;
    }
    const pushToArr = (node: string, ele: any) => {
        const obj = {
            key: ele.key,
            KeyType: ele.type,
            prod: '',
            test: '',
            stg: '',
            Checked: false
        }
        switch (node) {
            case 'prod':
                obj.prod = ele.value
                break;
            case 'stg':
                obj.stg = ele.value
                break;
            case 'test':
                obj.test = ele.value;
                break;
        }
        envArr.push(obj);
    }
    for (const node in EnvData) {
        const arr = [...EnvData[node]];
        arr.forEach((element: any) => {
            const index = checkIfKeyExists(element.key);
            if (index >= 0) {
                envArr[index][node] = element.value;
            } else {
                pushToArr(node, element);
            }
        });
    }

    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        setPasswordVisible((prevState) => {
            const updatedVisible = [...prevState]; // Create a copy of the array
            updatedVisible[index] = !updatedVisible[index]; // Toggle the visibility of the clicked item
            return updatedVisible;
        });
    }

    const handleEnvDialogClose = (envVariables: any, count: number, editData: any) => {
        if (count > 0) {
            setDataArr(editData);
            updateAppData(envVariables);
        }
        setOpen(false);
    };

    const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(true);
    }

    const updateAppData = (envVariables: any) => {
        setHideEdit(true);
        const updatedAppData = { ...Data, env_variables: envVariables }
        const appId = Data.id;
        editApp(updatedAppData, appId)
            .then((response) => {
                setTimeout(() => {
                    setHideEdit(false);
                }, 60000)
                Toaster.successToast("Updating Environment Variables. Please wait!");
            })
            .catch((error) => {
                Toaster.errorToast(error);
            });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={6} sm={6}><Typography variant="h4">
                Environment Variables
            </Typography></Grid>

            <Grid item xs={6} sm={6}><Typography variant="h4">
                {
                    showEdit &&
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
                }
            </Typography></Grid>
            <EnvVariables open={open} handleEnvDialogClose={handleEnvDialogClose} handleEnvClose={() => setOpen(false)} envArr={[...envArr]} />

            <Grid item xs={3} sm={3}>
                <Typography variant="h4">Environments</Typography>
            </Grid>
            <Grid item xs={3} sm={3}>
                <Typography variant="h4">Test</Typography>
            </Grid>
            <Grid item xs={3} sm={3}>
                <Typography variant="h4">Stage</Typography>
            </Grid>
            <Grid item xs={3} sm={3}>
                <Typography variant="h4">Production</Typography>
            </Grid>

            {dataArr.length > 0 ? dataArr.map((item, index) => (
                <Grid container spacing={1} sx={{ marginBottom: 1 }} key={index}>
                    <Grid item xs={3} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>

                        {item.KeyType === 'secret' ?
                            <CustomChip sx={{ height: 20, marginRight: 0.5, paddingBottom: '2px' }} rounded label={"secret"} skin='light' color={"primary"} /> :
                            (item.KeyType === 'secret_ref' ?
                                <CustomChip sx={{ height: 20, marginRight: 0.5, paddingBottom: '2px' }} rounded label={"secret_ref"} skin='light' color={"secondary"} /> : null)
                        }
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
                            edge="end"
                            style={{ float: 'right' }}
                        >
                            {passwordVisible[index] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
            )) : envArr.map((item, index) => (
                <Grid container spacing={1} sx={{ marginBottom: 1 }} key={index}>
                    <Grid item xs={3} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.KeyType === 'secret' ?
                            <CustomChip sx={{ height: 20, marginRight: 0.5, paddingBottom: '2px' }} rounded label={"secret"} skin='light' color={"primary"} /> :
                            (item.KeyType === 'secret_ref' ?
                                <CustomChip sx={{ height: 20, marginRight: 0.5, paddingBottom: '2px' }} rounded label={"secret_ref"} skin='light' color={"secondary"} /> : null)
                        }
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
                            edge="end"
                        >
                            {passwordVisible[index] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
            ))
            }
        </Grid>
    )
}
export default AppEnvVaribale






import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CustomTextField from "src/@core/components/mui/text-field";
import Icon from 'src/@core/components/icon'
import DragDropFile, { FileData } from "./dragdropfile";

const defaultEnvVariableValues = {
    env_variables: [{ key: "", KeyType: "", stg: "", test: "", prod: "", Checked: false }],
};

const EnvVariableSchema = yup.object().shape({
    env_variables: yup.array().of(
        yup.object({
            key: yup.string(),
            KeyType: yup.string(),
            stg: yup.string(),
            test: yup.string(),
            prod: yup.string(),
            Checked: yup.boolean(),
        })
    ),
});

export interface envArray {
    key: string,
    value: string,
    type: boolean
}

interface EnvVariablesProps {
    open: boolean,
    handleEnvDialogClose(env: any, count: number): void;
    handleEnvClose(): void;
}

const EnvVariables = (props: EnvVariablesProps) => {

    const { open, handleEnvDialogClose, handleEnvClose } = props;

    const {
        control: EnvVariableControl,
        handleSubmit: handleConfigurationSubmit,
        register: EnvVariableRegister,
        getValues: getEnvVariableValue,
        setValue: setEnvVariableValue,
        formState: {
            errors: EnvVariableErrors,
            isValid: isEnvVariableFormValid,
        },
    } = useForm({
        defaultValues: defaultEnvVariableValues,
        resolver: yupResolver(EnvVariableSchema),
    });

    const { fields, append, remove } = useFieldArray({
        name: "env_variables",
        control: EnvVariableControl,
    });

    const initialItems = fields.length;
    const [passwordVisibletest, setPasswordVisibletest] = useState<boolean[]>(Array(initialItems).fill(false));
    const [passwordVisiblestg, setPasswordVisiblestg] = useState<boolean[]>(Array(initialItems).fill(false));
    const [passwordVisibleprod, setPasswordVisibleprod] = useState<boolean[]>(Array(initialItems).fill(false));
    const [showPass, setShowPass] = useState<boolean>(false)

    const handleClose = () => {
        handleEnvClose();
    };

    const handleCheckboxChange = (index: number, event: React.ChangeEvent<HTMLInputElement>,) => {

        const checkboxValue = getEnvVariableValue('env_variables')[index].Checked as boolean;

        if (checkboxValue) {
            const currentValues = getEnvVariableValue();
            const { test, stg, prod } = currentValues.env_variables[index];

            if ((!test && !stg && prod) || (!test && stg && prod) || (test && !stg && prod) || (test && stg && prod)) {
                setEnvVariableValue(`env_variables.${index}.test`, prod);
                setEnvVariableValue(`env_variables.${index}.stg`, prod);
            }
            if ((!test && stg && (!prod || prod === '')) || (test && stg && (!prod || prod === ''))) {
                setEnvVariableValue(`env_variables.${index}.prod`, stg);
                setEnvVariableValue(`env_variables.${index}.test`, stg);
            }
            if (test && (!stg || stg === '') && (!prod || prod === '')) {
                setEnvVariableValue(`env_variables.${index}.prod`, test);
                setEnvVariableValue(`env_variables.${index}.stg`, test);
            }
        }
    };

    const togglePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>, index: number,type:string) => { 
       
       if(type=='test'){
        setPasswordVisibletest((prevState) => {
            const updatedVisible = [...prevState]; // Create a copy of the array
            updatedVisible[index] = !updatedVisible[index]; // Toggle the visibility of the clicked item
            return updatedVisible;
        });
       }
       else if(type=='stg'){
        setPasswordVisiblestg((prevState) => {
            const updatedVisible = [...prevState]; // Create a copy of the array
            updatedVisible[index] = !updatedVisible[index]; // Toggle the visibility of the clicked item
            return updatedVisible;
        });
       }
       else{
        setPasswordVisibleprod((prevState) => {
            const updatedVisible = [...prevState]; // Create a copy of the array
            updatedVisible[index] = !updatedVisible[index]; // Toggle the visibility of the clicked item
            return updatedVisible;
        });
       }
       

    };

    const handleAllInputChange = (e: any, i: number) => {
        const value = e.target.value;
        setEnvVariableValue(`env_variables.${i}.test`, value);
        setEnvVariableValue(`env_variables.${i}.stg`, value);
        setEnvVariableValue(`env_variables.${i}.prod`, value);
    }

    const handleSave = () => {
        const env = convertData(getEnvVariableValue('env_variables'));
        handleEnvDialogClose(env, getEnvVariableValue('env_variables').length);
    }

    const handleChange = (event: SelectChangeEvent<string>) => {
        setShowPass(!showPass);
    };

    const getKeyTypeofIndex = (index: number) => {
        return getEnvVariableValue('env_variables')[index].KeyType as string;
    }

    const handleUpdateForm = (data: FileData[], isTest: boolean, isStg: boolean, isProd: boolean,) => {
        if (isTest) {
            data.forEach((ele: FileData) => {
                const index = checkIfKeyExists(ele.key);
                if (index >= 0) {
                    setEnvVariableValue(`env_variables.${index}.test`, ele.value.toString());
                } else {
                    append({ key: ele.key, KeyType: 'env', test: ele.value.toString(), prod: '', stg: '', Checked: false })
                }
            });
        }
        if (isProd) {
            data.forEach((ele: FileData) => {
                const index = checkIfKeyExists(ele.key);
                if (index >= 0) {
                    setEnvVariableValue(`env_variables.${index}.prod`, ele.value.toString());
                } else {
                    append({ key: ele.key, KeyType: 'env', test: '', prod: ele.value.toString(), stg: '', Checked: false })
                }
            });
        }
        if (isStg) {
            data.forEach((ele: FileData) => {
                const index = checkIfKeyExists(ele.key);
                if (index >= 0) {
                    setEnvVariableValue(`env_variables.${index}.stg`, ele.value.toString());
                } else {
                    append({ key: ele.key, KeyType: 'env', test: '', prod: '', stg: ele.value.toString(), Checked: false })
                }
            });
        }
    }

    const convertData = (envVariables: any[]) => {
        const nData: {
            test: envArray[];
            stg: envArray[];
            prod: envArray[];
        } = { test: [], stg: [], prod: [] };
        envVariables.forEach((ele: any) => {
            if (ele.test) {
                nData.test.push({ key: ele.key, value: ele.test, type: ele.KeyType });
            }
            if (ele.stg) {
                nData.stg.push({ key: ele.key, value: ele.stg, type: ele.KeyType });
            }
            if (ele.prod) {
                nData.prod.push({ key: ele.key, value: ele.prod, type: ele.KeyType });
            }
        });
        return nData;
    };

    const checkIfKeyExists = (key: string) => {
        const existingValues = getEnvVariableValue().env_variables;
        const index = existingValues.map(e => e.key).indexOf(key);
        return index;
    }

    return (


        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ zIndex: 1200 }}
            maxWidth={'lg'}
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

                    <Grid
                        container
                        spacing={5}

                        style={{ marginBottom: "10px" }}
                    >
                        <Grid item xs={2.75} sm={2.75}>
                            <h3>Key</h3>
                        </Grid>
                        <Grid item xs={2.75} sm={2.75}>
                            <h3>Test</h3>
                        </Grid>
                        <Grid item xs={2.75} sm={2.75}>
                            <h3>Stage</h3>
                        </Grid>
                        <Grid item xs={2.75} sm={2.75}>
                            <h3>PROD</h3>
                        </Grid>
                        <Grid item xs={1} sm={1}>
                            <h3>ALL</h3>
                        </Grid>
                    </Grid>

                    {fields.map((field, index) => {
                        return (
                            <Grid
                                container
                                spacing={5}
                                key={field.id}
                                style={{ marginBottom: "10px" }}
                            >
                                <Grid item xs={1.375} sm={1.375}>
                                    <Controller
                                        name={`env_variables.${index}.key`}
                                        control={EnvVariableControl}
                                        rules={{ required: true }}

                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <CustomTextField
                                                fullWidth
                                                autoFocus
                                                sx={{ height: '50px' }}
                                                id='user-email-input'
                                                value={value}
                                                variant="outlined"
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                placeholder='Key'
                                                error={Boolean(EnvVariableErrors.env_variables)}
                                                {...(EnvVariableErrors.env_variables && { helperText: "this is wrong" })}
                                            />
                                        )}
                                    />
                                </Grid>


                                <Grid item xs={1.3} sm={1.3}>
                                    <Controller
                                        name={`env_variables.${index}.KeyType`}
                                        control={EnvVariableControl}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <Select
                                                value={value}
                                                label="Key Type"
                                                //defaultValue="KEYTYPE"
                                                sx={{ width: "100%", maxHeight: '38px' }}
                                                onChange={(e) => {
                                                    onChange(e);
                                                    handleChange(e);

                                                }}
                                                error={Boolean(EnvVariableErrors.env_variables)}
                                                labelId="stepper-linear-personal-country"
                                                aria-describedby="stepper-linear-personal-country-helper"
                                            >
                                                <MenuItem value='secret_ref'>Secret_ref</MenuItem>
                                                <MenuItem value='secret'>Secret</MenuItem>
                                                <MenuItem value='env'>env</MenuItem>
                                            </Select>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={2.75} sm={2.75}>

                                    {getKeyTypeofIndex(index) !== 'secret' ?
                                        <Controller
                                            name={`env_variables.${index}.test`}
                                            control={EnvVariableControl}
                                            rules={{ required: 'This field is required' }}
                                            render={({ field: { value, onChange, onBlur } }) => (

                                                <CustomTextField
                                                    fullWidth
                                                    autoFocus
                                                    id={`env-variable-key-${index}`}
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={e => {
                                                        onChange(e);
                                                        if (getEnvVariableValue().env_variables[index].Checked) handleAllInputChange(e, index)
                                                    }}
                                                    variant="outlined"
                                                    placeholder='TEST'
                                                /* error={Boolean(error)}
                                                helperText={error ? error.message : null} */
                                                />)
                                            }
                                        />

                                        :
                                        <Controller
                                            name={`env_variables.${index}.test`}
                                            control={EnvVariableControl}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <CustomTextField
                                                    fullWidth
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={e => {
                                                        onChange(e);
                                                        if (getEnvVariableValue().env_variables[index].Checked) handleAllInputChange(e, index)
                                                    }}
                                                    id='auth-login-v2-password'
                                                    // error={Boolean(EnvVariableErrors.test)}
                                                    // {...(EnvVariableErrors. && { helperText: "Error" })}
                                                    type={passwordVisibletest[index] ? 'text' : 'password'}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    edge='end'
                                                                    onMouseDown={(e: { preventDefault: () => any; }) => {
                                                                        return e.preventDefault();
                                                                    }}
                                                                    onClick={(e) => togglePasswordVisibility(e, index,"test")}
                                                                >
                                                                    <Icon fontSize='1.25rem' icon={passwordVisibletest[index] ? 'tabler:eye' : 'tabler:eye-off'} />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    }
                                </Grid>

                                <Grid item xs={2.75} sm={2.75}>
                                    {getKeyTypeofIndex(index) !== 'secret' ?
                                        <Controller
                                            name={`env_variables.${index}.stg`}
                                            control={EnvVariableControl}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <CustomTextField
                                                    fullWidth
                                                    autoFocus
                                                    id='user-email-input'
                                                    value={value}
                                                    variant="outlined"
                                                    onBlur={onBlur}
                                                    onChange={e => {
                                                        onChange(e);
                                                        if (getEnvVariableValue().env_variables[index].Checked) handleAllInputChange(e, index)
                                                    }}
                                                    placeholder='STAGE'
                                                    error={Boolean(EnvVariableErrors.env_variables)}
                                                    {...(EnvVariableErrors.env_variables && { helperText: "this is wrong" })}
                                                />
                                            )}
                                        /> :
                                        <Controller
                                            name={`env_variables.${index}.stg`}
                                            control={EnvVariableControl}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <CustomTextField
                                                    fullWidth
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={e => {
                                                        onChange(e);
                                                        if (getEnvVariableValue().env_variables[index].Checked) handleAllInputChange(e, index)
                                                    }}
                                                    id='auth-login-v2-password'
                                                    // error={Boolean(EnvVariableErrors.test)}
                                                    // {...(EnvVariableErrors. && { helperText: "Error" })}
                                                    type={passwordVisiblestg[index] ? 'text' : 'password'}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    edge='end'
                                                                    onMouseDown={(e: { preventDefault: () => any; }) => {
                                                                        return e.preventDefault();
                                                                    }}
                                                                    onClick={(e) => togglePasswordVisibility(e, index, "stg")}
                                                                >
                                                                    <Icon fontSize='1.25rem' icon={passwordVisiblestg[index] ? 'tabler:eye' : 'tabler:eye-off'} />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    }
                                </Grid>

                                <Grid item xs={2.75} sm={2.75}>
                                    {getKeyTypeofIndex(index) !== 'secret' ?
                                        <Controller
                                            name={`env_variables.${index}.prod`}
                                            control={EnvVariableControl}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <CustomTextField
                                                    fullWidth
                                                    autoFocus
                                                    id='user-email-input'
                                                    value={value}
                                                    variant="outlined"
                                                    onBlur={onBlur}
                                                    onChange={e => {
                                                        onChange(e);
                                                        if (getEnvVariableValue().env_variables[index].Checked) handleAllInputChange(e, index)
                                                    }}
                                                    placeholder='PROD'
                                                    error={Boolean(EnvVariableErrors.env_variables)}
                                                    {...(EnvVariableErrors.env_variables && { helperText: "this is wrong" })}
                                                />
                                            )}
                                        />
                                        :
                                        <Controller
                                            name={`env_variables.${index}.prod`}
                                            control={EnvVariableControl}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <CustomTextField
                                                    fullWidth
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={e => {
                                                        onChange(e);
                                                        if (getEnvVariableValue().env_variables[index].Checked) handleAllInputChange(e, index)
                                                    }}
                                                    id='auth-login-v2-password'
                                                    // error={Boolean(EnvVariableErrors.test)}
                                                    // {...(EnvVariableErrors. && { helperText: "Error" })}
                                                    type={passwordVisibleprod[index] ? 'text' : 'password'}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    edge='end'
                                                                    onMouseDown={(e: { preventDefault: () => any; }) => {
                                                                        return e.preventDefault();
                                                                    }}
                                                                    onClick={(e) => togglePasswordVisibility(e, index,"prod")}
                                                                >
                                                                    <Icon fontSize='1.25rem' icon={passwordVisibleprod[index] ? 'tabler:eye' : 'tabler:eye-off'} />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    }

                                </Grid>


                                <Grid item xs={0.5} sm={0.5}>
                                    <Controller
                                        name={`env_variables.${index}.Checked`}
                                        control={EnvVariableControl}
                                        defaultValue={false}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e.target.checked),
                                                        handleCheckboxChange(index, e)

                                                }
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={0.5} sm={0.5}>
                                    {index === fields.length - 1 && (
                                        <IconButton
                                            aria-label="add"
                                            size='medium'
                                            onClick={() =>
                                                append({
                                                    key: "",
                                                    KeyType: "",
                                                    stg: "",
                                                    test: "",
                                                    prod: "",
                                                    Checked: false
                                                })
                                            }
                                        >
                                            <AddIcon fontSize="inherit" />
                                        </IconButton>
                                    )}
                                    {index < fields.length - 1 && (
                                        <IconButton
                                            aria-label="delete"
                                            size="medium"
                                            onClick={() => remove(index)}
                                        >
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    )}
                                </Grid>
                            </Grid>
                        );
                    })}
                    <Grid item xs={12} sm={12}>
                        <DragDropFile updateForm={handleUpdateForm} />
                    </Grid>
                </div>
            </DialogContent>

            <DialogActions
                className="dialog-actions-dense"
                sx={{ justifyContent: "center" }}
                style={{ marginBottom: "15px" }}
            >
                <Button variant="contained" onClick={handleSave}>
                    Save
                </Button>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog >
    )
}

export default EnvVariables;




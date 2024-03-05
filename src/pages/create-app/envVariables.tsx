import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CustomTextField from "src/@core/components/mui/text-field";
import Icon from 'src/@core/components/icon'

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


interface EnvVariablesProps {
    open: boolean,
    handleEnvDialogClose(): void
}

const EnvVariables = (props: EnvVariablesProps) => {

    const { open, handleEnvDialogClose } = props;


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
    const [checkedItems, setCheckedItems] = useState<boolean[]>(Array(initialItems).fill(false));
    const [isSelectedSecret, setSelectedSecret] = useState<boolean[]>(Array(initialItems).fill(false));
    const [dropDownValue, setDropDownValue] = useState<string[]>([]);
    const [passwordVisible, setPasswordVisible] = useState<boolean[]>(Array(initialItems).fill(false));
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showPass, setShowPass] = useState<boolean>(false)

    const handleClose = () => {
        handleEnvDialogClose();
    };

    const handleCheckboxChange = (index: number, event: React.ChangeEvent<HTMLInputElement>,) => {

        const checkboxValue = getEnvVariableValue('env_variables')[index].Checked as boolean;
        if (checkboxValue) {
            console.log("i did it");
            const currentValues = getEnvVariableValue();
            const { test, stg, prod } = currentValues.env_variables[index];
            console.log("fvalue", getEnvVariableValue());

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
        else {
            console.log("i couldn't")
            setEnvVariableValue(`env_variables.${index}.test`, "hiiii");
            setEnvVariableValue(`env_variables.${index}.stg`, "hiiii");
            setEnvVariableValue(`env_variables.${index}.prod`, "hiiii");
        }





        //  setEnvVariableValue("env_variables", currentValues.env_variables);

    };

    const [toggle, settoggle] = useState<boolean>(false);
    // Function to toggle password visibility
    const togglePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        // const check = getEnvVariableValue().env_variables[index].passwordVisible
        // //  setEnvVariableValue(`env_variables.${index}.passwordVisible`,!check);

        // if (check) {
        //     setEnvVariableValue(`env_variables.${index}.passwordVisible`, false);
        // }
        // else {
        //     setEnvVariableValue(`env_variables.${index}.passwordVisible`, true);
        // }
        // settoggle(!check);
        setPasswordVisible((prevState) => {
            const updatedVisible = [...prevState]; // Create a copy of the array
            updatedVisible[index] = !updatedVisible[index]; // Toggle the visibility of the clicked item
            return updatedVisible;
        });

    };


    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (event: SelectChangeEvent<string>) => {
        //console.log(event.target.value)

        setShowPass(!showPass);


    };

    const handleProdstgChange = (index: number, newValue: string) => {
        const checkboxValue = getEnvVariableValue(`env_variables.${index}.Checked`);

        if (checkboxValue) {
            setEnvVariableValue(`env_variables.${index}.stg`, newValue); // Update prod field
            setEnvVariableValue(`env_variables.${index}.prod`, newValue);
        }

    };
    const getKeyTypeofIndex = (index: number) => {
        const val = getEnvVariableValue('env_variables')[index].KeyType as string;
        // console.log(val);
        return val;
    }
    return (


        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ zIndex: 100 }}
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
                                                label="Repository"
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
                                            render={({ field, fieldState: { error } }) => (

                                                <CustomTextField
                                                    fullWidth
                                                    autoFocus
                                                    id={`env-variable-key-${index}`}
                                                    {...field}
                                                    variant="outlined"
                                                    placeholder='TEST'
                                                    error={Boolean(error)}
                                                    helperText={error ? error.message : null}
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
                                                        onChange(e),
                                                            handleProdstgChange(index, e.target.value);
                                                    }
                                                    }
                                                    id='auth-login-v2-password'
                                                    // error={Boolean(EnvVariableErrors.test)}
                                                    // {...(EnvVariableErrors. && { helperText: "Error" })}
                                                    type={passwordVisible[index] ? 'text' : 'password'}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    edge='end'
                                                                    onMouseDown={(e: { preventDefault: () => any; }) => {
                                                                        return e.preventDefault();
                                                                    }}
                                                                    onClick={(e) => togglePasswordVisibility(e, index)}
                                                                >
                                                                    <Icon fontSize='1.25rem' icon={passwordVisible[index] ? 'tabler:eye' : 'tabler:eye-off'} />
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
                                                    onChange={onChange}
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

                                                    onChange={onChange}
                                                    id='auth-login-v2-password'
                                                    // error={Boolean(EnvVariableErrors.test)}
                                                    // {...(EnvVariableErrors. && { helperText: "Error" })}
                                                    type={passwordVisible[index] ? 'text' : 'password'}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    edge='end'
                                                                    onMouseDown={(e: { preventDefault: () => any; }) => {
                                                                        return e.preventDefault();
                                                                    }}
                                                                    onClick={(e) => togglePasswordVisibility(e, index)}
                                                                >
                                                                    <Icon fontSize='1.25rem' icon={passwordVisible[index] ? 'tabler:eye' : 'tabler:eye-off'} />
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
                                                    onChange={onChange}
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

                                                    onChange={onChange}
                                                    id='auth-login-v2-password'
                                                    // error={Boolean(EnvVariableErrors.test)}
                                                    // {...(EnvVariableErrors. && { helperText: "Error" })}
                                                    type={passwordVisible[index] ? 'text' : 'password'}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    edge='end'
                                                                    onMouseDown={(e: { preventDefault: () => any; }) => {
                                                                        return e.preventDefault();
                                                                    }}
                                                                    onClick={(e) => togglePasswordVisibility(e, index)}
                                                                >
                                                                    <Icon fontSize='1.25rem' icon={passwordVisible[index] ? 'tabler:eye' : 'tabler:eye-off'} />
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
                                    {/* <FormControlLabel
                                        label=""
                                        labelPlacement="top"
                                        control={
                                            <Checkbox
                                                checked={checkedItems[index]}
                                                onChange={(e) =>
                                                    handleCheckboxChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                            />
                                        }
                                    /> */}
                                    <Controller
                                        name={`env_variables.${index}.Checked`}
                                        control={EnvVariableControl}
                                        defaultValue={false} // Set the initial value
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                checked={field.value} // Set the checked prop to the field value
                                                onChange={(e) => {
                                                    field.onChange(e.target.checked),
                                                        handleCheckboxChange(index, e)

                                                }
                                                } // Update the field value on change
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
    )
}

export default EnvVariables;




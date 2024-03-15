import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import React, { use, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CustomTextField from "src/@core/components/mui/text-field";
import Icon from 'src/@core/components/icon'
import DragDropFile, { FileData } from "./dragdropfile";
import { ENV_TYPE } from "src/@core/static/app.constant";
import { getItemFromLocalstorage } from "src/services/locastorageService";
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
    handleEnvDialogClose(env: any, count: number, editData?: any): void;
    handleEnvClose(): void;
    envArr?: any[],
    isEdit?: boolean
}

const EnvVariables = (props: EnvVariablesProps) => {
    const { open, handleEnvDialogClose, handleEnvClose, envArr, isEdit } = props;
    const {
        control: EnvVariableControl,
        getValues: getEnvVariableValue,
        setValue: setEnvVariableValue,
        setError: setEnvError,
        handleSubmit: handleEnvVariableSubmit,
        clearErrors: clearEnvError,
        reset: resetEnvVariableForm,
        formState: {
            errors: EnvVariableErrors,
            isDirty: EnvVariableChanged,
            isValid: isEnvVeriableFormValid,
            dirtyFields

        },
    } = useForm({
        mode: "onBlur",
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
    const [prevData, setPrevData] = useState<any[]>([]);
    const [duplicateKey, setDuplicateKey] = useState<boolean>(false);
    const [duplicateKeyIndex, setDuplicateKeyIndex] = useState<number>(-1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [envValuePresentArr, setEnvValuePresentArr] = useState<boolean[]>(Array(initialItems).fill(false));
    const [envValueNotPresentArr, setEnvValueNotPresentArr] = useState<boolean[]>(Array(initialItems).fill(false));
    console.log("env1", envArr)

    const setting = JSON.parse(getItemFromLocalstorage("settings")!);
    const theme = setting?.mode;

    const [borderColor, setBorderColor] = useState<string>(theme === 'light' ? 'rgba(47, 43, 61, 0.2)' : 'rgba(208, 212, 241, 0.2)');
    const handleClose = () => {
        resetEnvVariableForm();
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

    const togglePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>, index: number, type: string) => {

        if (type == 'test') {
            setPasswordVisibletest((prevState) => {
                const updatedVisible = [...prevState]; // Create a copy of the array
                updatedVisible[index] = !updatedVisible[index]; // Toggle the visibility of the clicked item
                return updatedVisible;
            });
        }
        else if (type == 'stg') {
            setPasswordVisiblestg((prevState) => {
                const updatedVisible = [...prevState]; // Create a copy of the array
                updatedVisible[index] = !updatedVisible[index]; // Toggle the visibility of the clicked item
                return updatedVisible;
            });
        }
        else {
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
        console.log(EnvVariableChanged, isEnvVeriableFormValid, EnvVariableErrors, isSubmitted);
        setIsSubmitted(true);
        if (EnvVariableChanged && isEnvVeriableFormValid && !duplicateKey && !envValueNotPresentArr.includes(true)) {

            const env = convertData(getEnvVariableValue('env_variables'));
            console.log("apisendingdata", env)
            const filterdata: any = getEnvVariableValue('env_variables').filter((item: any) => item.key.trim() !== '');
            console.log("filterdata", filterdata)
            handleEnvDialogClose(env, filterdata.length, getEnvVariableValue("env_variables"));
        }
    }

    const handleChange = (event: SelectChangeEvent<string>) => {
        setShowPass(!showPass);
    };

    const getKeyTypeofIndex = (index: number) => {
        return getEnvVariableValue('env_variables')[index]?.KeyType as string;
    }


    const handleUpdateForm = (data: FileData[], isTest: boolean, isStg: boolean, isProd: boolean,) => {
        console.log("data", data)
        if (isTest) {
            data.forEach((ele: FileData) => {
                const index = checkIfKeyExists(ele.key);
                if (index >= 0) {
                    setEnvVariableValue(`env_variables.${index}.test`, ele.value.toString());
                } else {
                    console.log("ele-test", ele.key)
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
                    console.log("ele-test", ele.key)
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
                    console.log("ele-test", ele.key)
                    append({ key: ele.key, KeyType: 'env', test: '', prod: '', stg: ele.value.toString(), Checked: false })
                }
            });
        }
    }

    useEffect(() => {
        console.log("envUseeffect", envArr)
        const currentDataList = getEnvVariableValue(`env_variables`);
        if (!currentDataList[0]?.key && envArr) {
            remove(0);
        }
        if (envArr) {
            envArr.map((item, index) => {
                const ispresent = checkIfKeyExists(item.key);
                if (ispresent < 0) {
                    append(item);
                }
            })
        }
    }, [envArr])


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

    const checkDuplicateKey = (value: string, index: number) => {
        const existingValues = getEnvVariableValue();
        const arrayofKeys = existingValues.env_variables.map((ele: any) => ele.key);
        const filteredArray = arrayofKeys.filter((_, arrindex) => arrindex !== index);
        const isPresent = filteredArray.includes(value);
        console.log("isPresent", isPresent)

        //const num = existingValues.map(e => e.key).indexOf(value);
        if (isPresent) {
            setDuplicateKey(true);
            setEnvError(`env_variables.${index}.key`, { type: 'custom', message: 'Key is required' })
            console.log(duplicateKey)
            console.log("error", EnvVariableErrors)
            console.log("customcase", EnvVariableErrors?.env_variables?.[index]?.key?.type === "custom" && duplicateKey)
            setDuplicateKeyIndex(index);
        }
        else if (!isPresent && duplicateKeyIndex === index) {
            setDuplicateKey(false);
            clearEnvError(`env_variables.${index}.key`);
        }

    }

    const handleClick = () => {
        setBorderColor('rgba(115, 83, 229, 1)');
    };
    const handleOutSideClick = () => {
        setBorderColor(theme === 'light' ? 'rgba(47, 43, 61, 0.2)' : 'rgba(208, 212, 241, 0.2)');
    }



    const envValueRequire = (index: number, value: string) => {

        const { key, prod, stg, test } = getEnvVariableValue().env_variables[index];

        if (key && (!prod && !stg && !test)) {
            setEnvValueNotPresentArr((prevState) => {
                const updatedVisible = [...prevState]; // Create a copy of the array
                updatedVisible[index] = true; // Toggle the visibility of the clicked item
                return updatedVisible;
            });
        }
        else if (key && (prod || stg || test)) {
            setEnvValueNotPresentArr((prevState) => {
                const updatedVisible = [...prevState]; // Create a copy of the array
                updatedVisible[index] = false; // Toggle the visibility of the clicked item
                return updatedVisible;
            });
        }
    }

    return (
        <form onSubmit={handleEnvVariableSubmit(handleSave)}>
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
                        >
                            <Grid item xs={2.75} sm={2.75} style={{}}>
                                <h3>KEY</h3>
                            </Grid>
                            <Grid item xs={2.75} sm={2.75}>
                                <h3>TEST</h3>
                            </Grid>
                            <Grid item xs={2.75} sm={2.75}>
                                <h3>STAGE</h3>
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
                                >
                                    <Grid item xs={2.75} sm={2.75}>
                                        {/* <Grid item xs={1.375} sm={1.375}> */}
                                        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', display: 'flex', marginBottom: '10px', paddingLeft: '5px' }} onClick={handleClick} onBlur={handleOutSideClick}>
                                            <Controller
                                                name={`env_variables.${index}.key`}
                                                control={EnvVariableControl}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange, onBlur } }) => (
                                                    <TextField
                                                        fullWidth
                                                        autoFocus
                                                        sx={{ maxWidth: '130px', border: "none" }}
                                                        style={{ padding: '0px', border: 'none', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                        value={value}
                                                        onBlur={(e) => {
                                                            onBlur();
                                                            if (value !== "") checkDuplicateKey(value, index);
                                                        }
                                                        }
                                                        onChange={(e) => {
                                                            onChange(e);
                                                            if (e.target.value !== '') {
                                                                envValueRequire(index, e.target.value);
                                                                setEnvValuePresentArr((prevState) => {
                                                                    const updatedVisible = [...prevState]; // Create a copy of the array
                                                                    updatedVisible[index] = false; // Toggle the visibility of the clicked item
                                                                    return updatedVisible;
                                                                });
                                                            }
                                                            if (e.target.value !== '') {
                                                                setEnvValuePresentArr((prevState) => {
                                                                    const updatedVisible = [...prevState]; // Create a copy of the array
                                                                    updatedVisible[index] = true; // Toggle the visibility of the clicked item
                                                                    return updatedVisible;
                                                                });
                                                            }
                                                            {

                                                            }
                                                        }}
                                                        placeholder='Key'
                                                        variant="standard"
                                                        InputProps={{
                                                            disableUnderline: true,
                                                        }}
                                                        error={Boolean(EnvVariableErrors?.env_variables?.[index]?.key)}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name={`env_variables.${index}.KeyType`}
                                                control={EnvVariableControl}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <Select key={index}
                                                        value={value}
                                                        style={{ border: '0px', boxShadow: 'none' }}
                                                        sx={{
                                                            maxWidth: '100px', maxHeight: '38px', boxShadow: 'none',
                                                            '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                                            "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                                            {
                                                                border: 0,
                                                            },
                                                            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                            {
                                                                border: 0,
                                                            },
                                                        }}
                                                        onChange={(e) => {
                                                            onChange(e);
                                                            handleChange(e);

                                                        }}
                                                        error={Boolean(EnvVariableErrors.env_variables)}
                                                        labelId="stepper-linear-personal-country"
                                                        aria-describedby="stepper-linear-personal-country-helper"
                                                    >
                                                        {ENV_TYPE.map((envVar, index) => (
                                                            <MenuItem value={envVar.value} key={index}>{envVar.displauValue}</MenuItem>
                                                        ))
                                                        }
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        {(!getEnvVariableValue('env_variables')[index].key && isSubmitted && envValuePresentArr[index]) && (
                                            <FormHelperText
                                                sx={{ color: "error.main", marginTop: '-10px' }}
                                                id="key-field"
                                            >
                                                This field is required
                                            </FormHelperText>
                                        )}
                                        {(index === duplicateKeyIndex && duplicateKey) && (
                                            <FormHelperText
                                                sx={{ color: "error.main", marginTop: '-10px' }}
                                                id="key-field"
                                            >
                                                This key Exists
                                            </FormHelperText>
                                        )}

                                    </Grid>

                                    <Grid item xs={2.75} sm={2.75}>

                                        {getKeyTypeofIndex(index) !== 'secret' ?
                                            <Controller
                                                name={`env_variables.${index}.test`}
                                                control={EnvVariableControl}
                                                render={({ field: { value, onChange, onBlur } }) => (
                                                    <CustomTextField
                                                        fullWidth
                                                        autoFocus
                                                        id={`env-variable-key-${index}`}
                                                        value={value}
                                                        onBlur={onBlur}
                                                        onChange={e => {
                                                            onChange(e);
                                                            envValueRequire(index, e.target.value);
                                                            if (e.target.value !== '') {

                                                                setEnvValuePresentArr((prevState) => {
                                                                    const updatedVisible = [...prevState]; // Create a copy of the array
                                                                    updatedVisible[index] = true; // Toggle the visibility of the clicked item
                                                                    return updatedVisible;
                                                                });
                                                            }

                                                            if (getEnvVariableValue().env_variables[index].Checked) handleAllInputChange(e, index)
                                                        }}
                                                        variant="outlined"
                                                        placeholder='TEST'
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
                                                        id='test-password'
                                                        type={passwordVisibletest[index] ? 'text' : 'password'}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position='end'>
                                                                    <IconButton
                                                                        edge='end'
                                                                        onMouseDown={(e: { preventDefault: () => any; }) => {
                                                                            return e.preventDefault();
                                                                        }}
                                                                        onClick={(e) => togglePasswordVisibility(e, index, "test")}
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
                                        {(isSubmitted && envValueNotPresentArr[index]) && (
                                            <FormHelperText
                                                sx={{ color: "error.main", marginTop: '0px' }}
                                                id="key-field"
                                            >
                                                Atleast one value is required
                                            </FormHelperText>
                                        )}
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
                                                            envValueRequire(index, e.target.value);
                                                            if (e.target.value !== '') {
                                                                setEnvValuePresentArr((prevState) => {
                                                                    const updatedVisible = [...prevState]; // Create a copy of the array
                                                                    updatedVisible[index] = true; // Toggle the visibility of the clicked item
                                                                    return updatedVisible;
                                                                });
                                                            }

                                                            if (getEnvVariableValue().env_variables[index].Checked) handleAllInputChange(e, index)
                                                        }}
                                                        placeholder='STAGE'
                                                    /* error={Boolean(EnvVariableErrors.env_variables)} */
                                                    /* {...(EnvVariableErrors.env_variables && { helperText: "this is wrong" })} */
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
                                                        id='stg-password'
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
                                                            envValueRequire(index, e.target.value);
                                                            if (e.target.value !== '') {
                                                                setEnvValuePresentArr((prevState) => {
                                                                    const updatedVisible = [...prevState]; // Create a copy of the array
                                                                    updatedVisible[index] = true; // Toggle the visibility of the clicked item
                                                                    return updatedVisible;
                                                                });
                                                            }

                                                            if (getEnvVariableValue().env_variables[index].Checked) handleAllInputChange(e, index)
                                                        }}
                                                        placeholder='PROD'
                                                    /* error={Boolean(EnvVariableErrors.env_variables)}
                                                    {...(EnvVariableErrors.env_variables && { helperText: "this is wrong" })} */
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
                                                        id='prod-password'
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
                                                                        onClick={(e) => togglePasswordVisibility(e, index, "prod")}
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
                                                onClick={() => {
                                                    append({
                                                        key: "",
                                                        KeyType: "env",
                                                        stg: "",
                                                        test: "",
                                                        prod: "",
                                                        Checked: false
                                                    })
                                                    // setIsSubmitted(false);
                                                }
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
        </form >


    )
}

export default EnvVariables;




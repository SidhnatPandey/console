import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, TextField } from "@mui/material";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DropzoneWrapper from "src/@core/styles/libs/react-dropzone";
import DropZone from "src/component/DropZone";

const defaultConfigurationValues = {
    env_variables: [{ key: "", KeyType: "", stg: "", test: "", prod: "" }],
};

const ConfigurationSchema = yup.object().shape({
    env_variables: yup.array().of(
        yup.object({
            key: yup.string(),
            KeyType: yup.string(),
            stg: yup.string(),
            test: yup.string(),
            prod: yup.string()
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

    const handleClose = () => {
        /* const environmentVariables = getConfigurationValue("env_variables").filter(
            (variable) => variable.key && variable.KeyType
        );
        setConfigurationValue("env_variables", environmentVariables); */
        handleEnvDialogClose();
    };

    const handleCheckboxChange = (
        index: number,
        checked: boolean,
        type: string
    ) => {
        const currentValues = getConfigurationValue();
        /* switch (type) {
          case "test":
            currentValues.env_variables[index].test = checked;
            break;
          case "stg":
            currentValues.env_variables[index].stg = checked;
            break;
          case "prod":
            currentValues.env_variables[index].prod = checked;
            break;
        } */
        setConfigurationValue("env_variables", currentValues.env_variables);
    };

    return (
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
                                <Grid item xs={4} sm={4}>
                                    <FormControl>
                                        <TextField
                                            label="Key"
                                            sx={{ width: "110%" }}
                                            {...configurationRegister(
                                                `env_variables.${index}.key` as const
                                            )}
                                        ></TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4} sm={4}>
                                    <FormControl>
                                        <TextField
                                            label="Value"
                                            sx={{ width: "120%" }}
                                            {...configurationRegister(
                                                `env_variables.${index}.KeyType` as const
                                            )}
                                        ></TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1} sm={1}>
                                    <FormControlLabel
                                        label="Test"
                                        labelPlacement="top"
                                        control={
                                            <Checkbox
                                                // checked={field.test}
                                                onChange={(e) =>
                                                    handleCheckboxChange(
                                                        index,
                                                        e.target.checked,
                                                        "test"
                                                    )
                                                }
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={1} sm={1}>
                                    <FormControlLabel
                                        label="Stg"
                                        labelPlacement="top"
                                        control={
                                            <Checkbox
                                                //checked={field.stg}
                                                onChange={(e) =>
                                                    handleCheckboxChange(
                                                        index,
                                                        e.target.checked,
                                                        "stg"
                                                    )
                                                }
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={1} sm={1}>
                                    <FormControlLabel
                                        label="Prod"
                                        labelPlacement="top"
                                        control={
                                            <Checkbox
                                                //checked={field.prod}
                                                onChange={(e) =>
                                                    handleCheckboxChange(
                                                        index,
                                                        e.target.checked,
                                                        "prod"
                                                    )
                                                }
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={1} sm={1}>
                                    {index === fields.length - 1 && (
                                        <IconButton
                                            aria-label="add"
                                            size="large"
                                            onClick={() =>
                                                append({
                                                    key: "",
                                                    KeyType: "",
                                                    stg: "",
                                                    test: "",
                                                    prod: "",
                                                })
                                            }
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
                                <Grid item xs={12} sm={12} >
                                    <DropzoneWrapper>
                                        <DropZone type={["json", "yml", "env"]} dropText={"Drag and drop a .env, .json or .yml file here to upload bulk variables"} />
                                    </DropzoneWrapper>
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
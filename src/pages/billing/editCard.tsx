import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { CardType } from ".";
import { useEffect, useState } from "react";
import { Countries } from "src/@core/static/countries";
import { updateCard } from "src/services/billingService";
import Toaster from "src/utils/toaster";
import useLoading from "src/hooks/loading";
import { CircularProgress } from '@mui/material';
import { clearNumber } from "src/@core/utils/format";

const currentYear = new Date().getFullYear();
const defaultFormValues = {
    month: 1,
    year: currentYear,
    name: '',
    line1: '',
    line2: '',
    city: '',
    postal_code: '',
    country: '',
    state: ''
};

const formSchema = yup.object().shape({
    month: yup.number().required(),
    year: yup.number().required(),
    name: yup.string().required(),
    line1: yup.string().required(),
    line2: yup.string(),
    city: yup.string().required(),
    postal_code: yup.string().required(),
    country: yup.string().required(),
    state: yup.string().required()
});

interface Props {
    open: boolean,
    handleClose(): void,
    item: CardType
}

const EditCard = (props: Props) => {

    const { open, handleClose, item } = props;
    const [originalValue, setOriginalValue] = useState<CardType>(item);
    const { loading, startLoading, stopLoading } = useLoading();

    // Generate the next 20 years
    const years: number[] = [];
    for (let i = 0; i < 20; i++) {
        years.push(currentYear + i);
    }

    const close = () => {
        reset();
        handleClose();
    }

    const months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    const {
        control: formControl,
        handleSubmit: handleFormSubmit,
        register,
        reset,
        setValue,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: defaultFormValues,
        resolver: yupResolver(formSchema),
    });

    const onSubmit = (data: any) => {
        startLoading();
        const updatedCard = { ...originalValue };
        updatedCard.billing_details.address.city = data.city;
        updatedCard.billing_details.address.line1 = data.line1;
        updatedCard.billing_details.address.line2 = data.line2;
        updatedCard.billing_details.address.postal_code = data.postal_code;
        updatedCard.billing_details.address.country = data.country;
        updatedCard.billing_details.name = data.name;
        updatedCard.card.exp_month = data.month;
        updatedCard.card.exp_year = data.year;
        updateCard(updatedCard).then(() => {
            Toaster.successToast('Card updated Successfully')
        }).catch(() => {
            Toaster.errorToast('Some error ocurred.')
        }).finally(() => {
            stopLoading();
            close();
        })
    }

    useEffect(() => {
        if (item) {
            setOriginalValue(item);
            setValueToForm(item);
        }
    }, [item])

    const setValueToForm = (card: CardType) => {
        const obj = {
            month: card.card.exp_month,
            year: card.card.exp_year,
            name: card.billing_details.name,
            line1: card.billing_details.address.line1,
            line2: card.billing_details.address.line2,
            city: card.billing_details.address.city,
            postal_code: card.billing_details.address.postal_code,
            country: card.billing_details.address.country,
            state: card.billing_details.address.state
        }
        reset(obj);
    }

    const handleZipcodeChange = (event: any) => {
        const value = clearNumber(event.target.value);
        setValue('postal_code', value);
    }

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            maxWidth={'xs'}
        >
            <form onSubmit={handleFormSubmit(onSubmit)} noValidate>
                <DialogContent>
                    <DialogTitle
                        id='user-view-billing-edit-card'
                        sx={{
                            textAlign: 'center',
                            fontSize: '1.5rem !important',
                            paddingTop: 0
                        }} >
                        Edit Card
                    </DialogTitle>
                    <DialogContentText
                        variant='body2'
                        id='user-view-billing-edit-card-description'
                        sx={{ textAlign: 'center', mb: 3 }} >
                        Edit your saved card details
                    </DialogContentText>

                    {loading && <div data-testid="loading-indicator">Loading...</div>}

                    <Grid container spacing={5}>
                        <Grid item xs={6} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="month-label" error={Boolean(formErrors.month)}>
                                    Expiry month
                                </InputLabel>
                                <Controller
                                    name="month"
                                    control={formControl}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            label="Expiry month"
                                            labelId="month-label"  // Add this line
                                            value={value}
                                            onChange={(e) => onChange(e)}
                                            error={Boolean(formErrors.month)}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 350,
                                                    },
                                                },
                                            }}
                                        >
                                            {months.map((month: number, index: number) => (
                                                <MenuItem value={month} key={index}>
                                                    {month}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {formErrors.month && (
                                    <FormHelperText
                                        sx={{ color: "error.main" }}
                                        id="stepper-linear-account-username"
                                    >
                                        This field is required
                                    </FormHelperText>
                                )}
                            </FormControl>

                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="year" error={Boolean(formErrors.year)}> Expiry year </InputLabel>
                                <Controller
                                    name="year"
                                    control={formControl}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            value={value}
                                            label="Expiry year"
                                            onChange={(e) => { onChange(e) }}
                                            error={Boolean(formErrors.year)}
                                            labelId="stepper-linear-personal-country"
                                            aria-describedby="stepper-linear-personal-country-helper"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 350,
                                                    },
                                                },
                                            }} >
                                            {years.map((year: number, index: number) => {
                                                return (<MenuItem value={year} key={index}>{year}</MenuItem>)
                                            })}
                                        </Select>
                                    )} />
                                {formErrors.name && (
                                    <FormHelperText
                                        sx={{ color: "error.main" }}
                                        id="stepper-linear-account-username">
                                        This field is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField className="full-width" label="Cardholder Name" {...register("name", {
                                required: 'Cardholder Name is required'
                            })}
                                error={!!formErrors.name}
                                helperText={formErrors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField className="full-width" label="Street" {...register("line1", {
                                required: 'Street is required'
                            })}
                                error={!!formErrors.line1}
                                helperText={formErrors.line1?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField className="full-width" label="Street (line 2)" {...register("line2")} />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField className="full-width" label="City" {...register("city", {
                                required: {
                                    value: true,
                                    message: 'City is required'
                                }
                            })}
                                error={!!formErrors.city}
                                helperText={formErrors.city?.message} />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField className="full-width" label="Zip/Postal" {...register("postal_code", {
                                required: 'Zip/Postal Code is required'
                            })}
                                inputProps={{ maxLength: 6 }}
                                onChange={(event) => {
                                    setValue('postal_code', event.target.value);
                                    handleZipcodeChange(event);
                                }}

                                error={!!formErrors.postal_code}
                                helperText={formErrors.postal_code?.message} />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField className="full-width" label="State/Province" {...register("state", {
                                required: 'State is required'
                            })}
                                error={!!formErrors.state}
                                helperText={formErrors.state?.message} />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                                <InputLabel id="year" error={Boolean(formErrors.year)}> Country </InputLabel>
                                <Controller
                                    name="country"
                                    control={formControl}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            value={value}
                                            label="Country"
                                            onChange={(e) => { onChange(e) }}
                                            error={Boolean(formErrors.country)}
                                            labelId="stepper-linear-personal-country"
                                            aria-describedby="stepper-linear-personal-country-helper"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 350,
                                                    },
                                                },
                                            }} >
                                            {Countries.map((country) => (
                                                <MenuItem key={country.code} value={country.code}>
                                                    {country.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )} />
                                {formErrors.name && (
                                    <FormHelperText
                                        sx={{ color: "error.main" }}
                                        id="stepper-linear-account-username">
                                        This field is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className='dialog-actions-dense' style={{ justifyContent: 'center', paddingBottom: '20px   ' }}>
                    <Button onClick={close}>Close</Button>
                    <Button variant="contained" type="submit" onClick={handleFormSubmit(onSubmit)} >
                        {loading && <CircularProgress size="1.2rem" color='secondary' style={{ marginRight: '5px' }} />}
                        Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default EditCard;
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, Grid, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import Payment from 'payment'
import { formatCVC, formatCreditCardNumber, formatExpirationDate } from "src/@core/utils/format";
import { useRouter } from "next/router";

const defaultFormValues = {
    cardNumber: "",
    cvc: "",
    expire: "",
    cardName: ""
};

const formSchema = yup.object().shape({
    cardNumber: yup.number().required(),
    cvc: yup.number().required(),
    expire: yup.number().required(),
    cardName: yup.string().required(),
});

const PaymentMethod = () => {

    const {
        control: formControl,
        handleSubmit: handleFormSubmit,
        register: formRegister,
        getValues: getFormValue,
        setValue: setFormValue,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: defaultFormValues,
        resolver: yupResolver(formSchema),
    });

    const [open, setOpen] = useState<boolean>(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const router = useRouter();

    const onSubmit = (data: any) => {
        console.log(data);
    }

    const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === 'cardNumber') {
            target.value = formatCreditCardNumber(target.value, Payment)
            setFormValue('cardNumber', target.value)
        } else if (target.name === 'expire') {
            target.value = formatExpirationDate(target.value)
            setFormValue('expire', target.value)
        } else if (target.name === 'cvc') {
            target.value = formatCVC(target.value, getFormValue('cardNumber'), Payment)
            setFormValue('cvc', target.value)
        }
    }

    const openStripePayment = () => {
        router.push('/payment');
    }

    return (
        <Card>
            <CardContent>
                <h3 style={{ marginTop: '-10px' }}> Payment Method </h3>
                <Button variant="contained" color="primary" onClick={openStripePayment}> Add New Card</Button>
            </CardContent>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <form onSubmit={handleFormSubmit(onSubmit)}>
                    <DialogContent>
                        <DialogTitle
                            id='user-view-billing-edit-card'
                            sx={{
                                textAlign: 'center',
                                fontSize: '1.5rem !important'
                            }} >
                            Edit Card
                        </DialogTitle>
                        <DialogContentText
                            variant='body2'
                            id='user-view-billing-edit-card-description'
                            sx={{ textAlign: 'center', mb: 7 }} >
                            Edit your saved card details
                        </DialogContentText>


                        <Grid container spacing={5}>
                            <Grid item xs={6} sm={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="cardNumber"
                                        control={formControl}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                name='cardNumber'
                                                label="Card Number"
                                                onChange={(e: any) => {
                                                    onChange(e);
                                                    handleInputChange(e)
                                                }}
                                                placeholder="9999 9999 9999 9999"
                                                maxlength="12"
                                                error={
                                                    (Boolean(formErrors.cardNumber))
                                                }
                                                aria-describedby="stepper-linear-account-username"
                                            />

                                        )}
                                    />
                                    {formErrors.cardNumber && (
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
                                    <Controller
                                        name="cvc"
                                        control={formControl}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label="CVC"
                                                name='cvc'
                                                onChange={(e: any) => {
                                                    onChange(e);
                                                    handleInputChange(e)
                                                }}
                                                placeholder="999"
                                                error={
                                                    (Boolean(formErrors.cvc))
                                                }
                                                aria-describedby="stepper-linear-account-username"
                                            />

                                        )}
                                    />
                                    {formErrors.cvc && (
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
                                    <Controller
                                        name="cardName"
                                        control={formControl}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label="Card Holder Name"
                                                onChange={onChange}
                                                placeholder="Jhon Deo"
                                                error={
                                                    (Boolean(formErrors.cardName))
                                                }
                                                aria-describedby="stepper-linear-account-username"
                                            />

                                        )}
                                    />
                                    {formErrors.cardName && (
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
                                    <Controller
                                        name="expire"
                                        control={formControl}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label="Expire On"
                                                name='expire'
                                                onChange={(e: any) => {
                                                    onChange(e);
                                                    handleInputChange(e)
                                                }}
                                                placeholder="07/27"
                                                maxlength="12"
                                                error={
                                                    (Boolean(formErrors.expire))
                                                }
                                                aria-describedby="stepper-linear-account-username"
                                            />

                                        )}
                                    />
                                    {formErrors.expire && (
                                        <FormHelperText
                                            sx={{ color: "error.main" }}
                                            id="stepper-linear-account-username"
                                        >
                                            This field is required
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>


                    </DialogContent>
                    <DialogActions className='dialog-actions-dense' style={{ justifyContent: 'center', paddingBottom: '20px   ' }}>
                        <Button onClick={handleClose}>Close</Button>
                        <Button variant="contained" type="submit" onClick={handleFormSubmit(onSubmit)} >Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Card>
    )
}

export default PaymentMethod
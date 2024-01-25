import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, Grid, TextField } from "@mui/material"
import { ChangeEvent, useContext, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import Payment from 'payment'
import { formatCVC, formatCreditCardNumber, formatExpirationDate } from "src/@core/utils/format";
import { deleteCard, makeCardDefault } from "src/services/billingService";
import PaymentCard from "./card";

import ConfirmationDialog from "src/component/ConfirmationDialog";
import { AuthContext } from "src/context/AuthContext";
import { CardType } from ".";
import PaymentDialog from "../payment";

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

interface Props {
    cards: CardType[],
    fetchCards: any
}
const PaymentMethod = (props: Props) => {

    const { cards, fetchCards } = props;

    const {
        control: formControl,
        handleSubmit: handleFormSubmit,
        getValues: getFormValue,
        setValue: setFormValue,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: defaultFormValues,
        resolver: yupResolver(formSchema),
    });

    const [open, setOpen] = useState<boolean>(false)

    const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [selectedCardId, setSelectedCardId] = useState<string>('');
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const authContext = useContext(AuthContext);

    const onSubmit = (data: any) => {
        console.log(data);
    }
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

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

    const removeCard = () => {
        deleteCard(selectedCardId).then(
            () => {
                fetchCards();
                setConfirmDialog(false);
            }
        )
    }

    const handleClickOpenPayment = () => setOpenPaymentDialog(true)
    const handlePaymentClose = () => setOpenPaymentDialog(false);

    const setAsDefault = () => {
        const customerId = authContext.org.customer_id;
        makeCardDefault(selectedCardId, customerId).then(
            () => {
                fetchCards();
                setConfirmDialog(false);
            }
        )
    }

    const handleConfirm = () => {
        isDelete ? removeCard() : setAsDefault();
    }

    const openConfirmation = (card: CardType, isDelete: boolean) => {
        setIsDelete(isDelete);
        setSelectedCardId(card.id);
        if (isDelete) {
            setMessage(`Are you sure you want to delete card ending with ${card.card.last4} ?`)
        } else {
            setMessage(`Are you sure you want to make card ending with ${card.card.last4} as default card?`)
        }
        setConfirmDialog(true);
    }

    return (
        <Card>
            <CardContent>
                <h3 style={{ marginTop: '-10px' }}> Payment Method </h3>
                <Grid item xs={12} md={6}>
                    {cards?.map((item: CardType, index: number) => (
                        <PaymentCard key={index} index={index} item={item} cardsLength={cards.length} openConfirmation={openConfirmation} openEdit={handleClickOpen} ></PaymentCard>
                    ))}
                </Grid>
                <Button variant="contained" color="primary" onClick={handleClickOpenPayment} style={{ marginTop: '20px' }}> Add New Card</Button>
                <PaymentDialog openDialog={openPaymentDialog} handleClose={handlePaymentClose}></PaymentDialog>
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

            <ConfirmationDialog open={confirmDialog} onConfirm={handleConfirm} onCancel={() => setConfirmDialog(false)} message={message} />
        </Card>
    )
}

export default PaymentMethod
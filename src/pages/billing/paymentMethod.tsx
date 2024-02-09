import { Button, Card, CardContent, Grid } from "@mui/material"
import { useState } from "react"
import { deleteCard, makeCardDefault } from "src/services/billingService";
import PaymentCard from "./card";
import ConfirmationDialog from "src/component/ConfirmationDialog";
import { CardType } from ".";
import PaymentDialog from "../payment";

interface Props {
    cards: CardType[],
    fetchCards(): void,
    customerId: string | undefined
}
const PaymentMethod = (props: Props) => {

    const { cards, fetchCards, customerId } = props;

    //states
    const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [selectedCardId, setSelectedCardId] = useState<string>('');
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);

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
        if (customerId) {
            makeCardDefault(selectedCardId, customerId).then(
                () => {
                    fetchCards();
                    setConfirmDialog(false);
                }
            )
        }
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
                        <PaymentCard key={index} index={index} item={item} cardsLength={cards.length} openConfirmation={openConfirmation} ></PaymentCard>
                    ))}
                </Grid>
                <Button variant="contained" color="primary" onClick={handleClickOpenPayment} style={{ marginTop: '20px' }}> Add New Card</Button>
                <PaymentDialog openDialog={openPaymentDialog} handleClose={handlePaymentClose}></PaymentDialog>
            </CardContent>
            <ConfirmationDialog open={confirmDialog} onConfirm={handleConfirm} onCancel={() => setConfirmDialog(false)} message={message} />
        </Card>
    )
}

export default PaymentMethod
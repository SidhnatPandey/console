import { Box, Button, Typography } from "@mui/material";
import { CardType } from ".";
import CustomChip from 'src/@core/components/mui/chip'

interface Props {
    index: number;
    item: CardType,
    cardsLength: number,
    openConfirmation(item: CardType, isDelete: boolean): void,
    openEdit(open: boolean): void;
}

const Card = (props: Props) => {

    const { index, item, cardsLength, openConfirmation, openEdit } = props

    const getLastTwoDigits = (n: number) => {
        return (n % 100);
    }

    const getDate = (n: number) => {
        return n > 10 ? n.toString : '0' + n;
    }

    return (
        <Box
            key={index}
            sx={{
                p: 4,
                display: 'flex',
                borderRadius: 1,
                flexDirection: ['column', 'row'],
                justifyContent: ['space-between'],
                backgroundColor: 'action.hover',
                alignItems: ['flex-start', 'center'],
                mb: index !== cardsLength - 1 ? 4 : undefined
            }}
        >
            <div>
                {/* <img height='25' alt={item.imgAlt} src={item.imgSrc} /> */}
                <Typography sx={{ fontSize: '24px' }}><b><i>{item.card.brand.toUpperCase()}</i></b></Typography>
                <Box sx={{ mt: 4, mb: 2.5, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ color: 'text.secondary' }}>{item.billing_details.name}</Typography>
                    {item.Default ? (
                        <CustomChip
                            rounded
                            skin='light'
                            size='small'
                            sx={{ ml: 2.5 }}
                            label='Default'
                            color={'primary'}
                        />
                    ) : null}
                </Box>
                <Typography sx={{ color: 'text.secondary' }}>
                    **** **** **** {item.card.last4}
                </Typography>
            </div>

            <Box sx={{ mt: [4, 0], textAlign: ['start', 'end'] }}>
                {!item.Default && <Button variant='tonal' sx={{ mr: 2.5 }} onClick={() => openConfirmation(item, false)}>
                    Make as Default
                </Button>}
                <Button variant='tonal' sx={{ mr: 2.5 }} onClick={() => openEdit(true)}>
                    Edit
                </Button>
                {cardsLength > 1 && <Button variant='outlined' color='secondary' onClick={() => openConfirmation(item, true)} >
                    Delete
                </Button>}
                <Typography variant='body2' sx={{ mt: [6, 11] }}>
                    {`Card expires at ${getDate(item.card.exp_month)}/${getLastTwoDigits(item.card.exp_year)} `}
                </Typography>
            </Box>
        </Box>
    )
}

export default Card; 
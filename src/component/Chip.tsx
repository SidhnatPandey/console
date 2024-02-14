import CustomChip from 'src/@core/components/mui/chip'

interface IProps {
    label: string,
    color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

const ChipsRounded = (props: IProps) => {
    const { label, color } = props;
    return (
        <CustomChip rounded label={label} skin='light' color={color} />
    )
}

export default ChipsRounded
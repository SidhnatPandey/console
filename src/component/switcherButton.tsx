import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState, MouseEvent } from "react";

interface SwitcherButtonProps {
    handleBtnClick: any,
    btnNames: string[],
    defaultValue: string
}

const SwitcherButton = ({ handleBtnClick, btnNames, defaultValue }: SwitcherButtonProps) => {

    const [alignment, setAlignment] = useState<string | null>(defaultValue)
    const styles = { backgroundColor: '#655BD3', color: '#ffff', padding: '0px 15px', height: '35px' }

    const handleAlignment = (event: MouseEvent<HTMLElement>, newAlignment: string | null) => {
        setAlignment(newAlignment);
        handleBtnClick(newAlignment);
    }

    return (
        <ToggleButtonGroup exclusive color='primary' value={alignment} onChange={handleAlignment}>
            {btnNames.map((button, index) => (
                <ToggleButton value={button} style={alignment === button ? styles : { padding: '0px 15px', height: '35px' }} key={index}>{button.toUpperCase()}</ToggleButton>
            ))}
            {/* <ToggleButton value='prod' style={alignment === 'prod' ? styles : undefined}>PROD</ToggleButton>
            <ToggleButton value='current' style={alignment === 'current' ? styles : undefined}>CURRENT</ToggleButton> */}
            {/*  <ToggleButton value='ios' style={alignment === 'ios' ? styles : undefined}>iOS</ToggleButton> */}
        </ToggleButtonGroup>
    )
}

export default SwitcherButton;
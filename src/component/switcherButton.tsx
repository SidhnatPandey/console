import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState, MouseEvent } from "react";

interface SwitcherButtonProps {
  handleBtnClick: any;
  btnNames: string[];
  defaultValue: string;
}

const SwitcherButton = ({
  handleBtnClick,
  btnNames,
  defaultValue,
}: SwitcherButtonProps) => {
  const [alignment, setAlignment] = useState<string | null>(defaultValue);
  const styles = {
    backgroundColor: "#655BD3",
    color: "#ffff",
    padding: "0px 15px",
    height: "34px",
  };

  const handleAlignment = (
    event: MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment) {
      setAlignment(newAlignment);
      handleBtnClick(newAlignment);
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      value={alignment}
      onChange={handleAlignment}
    >
      {btnNames.map((button, index) => (
        <ToggleButton
          value={button}
          style={
            alignment === button
              ? styles
              : { padding: "0px 15px", height: "34px" }
          }
          key={index}
        >
          {button.toUpperCase()}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default SwitcherButton;

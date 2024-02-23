import React, { useState } from 'react';
import { Button, Menu, MenuItem, Select } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
 
interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}
 
const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, label }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
 
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleClose = () => {
    setAnchorEl(null);
  };
 
  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    handleClose();
  };
 
  return (
    <div>
      <Button
        variant="contained"
        size="large"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{ backgroundColor: 'lightgray', '&:hover': { backgroundColor: 'lightgray' }, color: 'black' }}
      >
        {value}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem key={index} onClick={() => handleSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
 
export default CustomDropdown;
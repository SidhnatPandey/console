import { Button, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React, { useState } from 'react'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import DropZone from 'src/component/DropZone'

export default function DragDropFile() {

    const [open, setOpen] = useState<boolean>(false);
    const [selectedEnv, setSelectedEnv] = useState<string>('prod');

    const handleDrop = (file: File) => {
        console.log(file);
        hanldeUploadedFile(file);
        setOpen(true);
    }

    const hanldeUploadedFile = (file: File) => {
        const type = file.name.split('.').pop();
        switch (type) {
            case 'json':
                hanldeJsonFile(file);
                break;
        }

    }

    const hanldeJsonFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(file);
    }


    function onReaderLoad(event: any) {
        const obj = JSON.parse(event.target.result);
        console.log(obj);
    }

    const handleEnvChange = (e: any) => {
        setSelectedEnv(e.target.value);
    }

    const handleEnvClick = () => {
        setOpen(false);
    }
    return (
        <>
            <DropzoneWrapper>
                <DropZone type={[]} dropText={"Drag and drop a .emv, .json or .yml file here to add bulk variables"} onDrop={handleDrop} />
            </DropzoneWrapper>

            <Dialog open={open}>
                <DialogContent>
                    <FormControl>
                        <FormLabel id="env-radio-buttons-group-label">Select environment</FormLabel>
                        <RadioGroup
                            aria-labelledby="env-radio-buttons-group-label"
                            defaultValue="prod"
                            name="radio-buttons-group"
                            value={selectedEnv}
                            onChange={handleEnvChange}
                        >
                            <FormControlLabel value="prod" control={<Radio />} label="Prod" />
                            <FormControlLabel value="stg" control={<Radio />} label="Stage" />
                            <FormControlLabel value="test" control={<Radio />} label="Test" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button color='primary' variant="contained" onClick={handleEnvClick}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

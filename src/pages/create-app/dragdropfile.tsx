import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React, { useState } from 'react'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import DropZone from 'src/component/DropZone';

interface DragDropFilePorps {
    updateForm(data: FileData[], isTest: boolean, isStg: boolean, isProd: boolean): void
}

export interface FileData {
    key: string,
    value: string
}

export default function DragDropFile({ updateForm }: DragDropFilePorps) {

    const [open, setOpen] = useState<boolean>(false);
    const [fileData, setFileData] = useState<FileData[]>([]);
    const [isProd, setIsProd] = useState<boolean>(false);
    const [isStg, setIsStg] = useState<boolean>(false);
    const [isTest, setIsTest] = useState<boolean>(true);

    const handleDrop = (file: File) => {
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
        const arr = [];
        for (const key in obj) {
            arr.push({ 'key': key, 'value': obj[key] })
        }
        setFileData(arr);
    }

    const handleEnvClick = () => {
        updateForm(fileData, isTest, isStg, isProd);
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
                        <FormControlLabel control={<Checkbox checked={isTest} onChange={(e) => { setIsTest(e.target.checked) }} />} label="Test" />
                        <FormControlLabel control={<Checkbox checked={isStg} onChange={(e) => { setIsStg(e.target.checked) }} />} label="Stg" />
                        <FormControlLabel control={<Checkbox checked={isProd} onChange={(e) => { setIsProd(e.target.checked) }} />} label="Prod" />
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button color='primary' variant="contained" onClick={handleEnvClick}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

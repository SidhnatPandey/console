import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, FormLabel, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import DropZone from 'src/component/DropZone';
import jsyaml from 'js-yaml';

interface DragDropFileProps {
    updateForm(data: FileData[], isTest: boolean, isStg: boolean, isProd: boolean): void;
    isSecret?: boolean
}

export interface FileData {
    key: string,
    value: string,
}

export default function DragDropFile({ updateForm, isSecret }: DragDropFileProps) {

    const [open, setOpen] = useState<boolean>(false);
    const [fileData, setFileData] = useState<FileData[]>([]);
    const [isProd, setIsProd] = useState<boolean>(false);
    const [isStg, setIsStg] = useState<boolean>(false);
    const [isTest, setIsTest] = useState<boolean>(true);
    const [isAll, setIsAll] = useState(false);
    let type: string | undefined;
    const flattenJSON = (json: any, prefix = ''): Record<string, string> => {
        let result: Record<string, string> = {};

        for (const key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
                const newKey = prefix ? `${prefix}.${key}` : key;

                if (typeof json[key] === 'object') {
                    const flattened = flattenJSON(json[key], newKey);
                    result = { ...result, ...flattened };
                } else {
                    result[newKey] = json[key];
                }
            }
        }

        return result;
    };


    const handleAllCheckboxChange = (checked: boolean) => {
        setIsTest(checked);
        setIsStg(checked);
        setIsProd(checked);
    };

    const handleDrop = (file: File) => {
        hanldeUploadedFile(file);
        setOpen(true);
    }

    const hanldeUploadedFile = (file: File) => {
        type = file.name.split('.').pop();
        hanldeJsonFile(file);
    }

    const hanldeJsonFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(file);
    }


    function onReaderLoad(event: any) {

        let obj: any = {}
        const arr = [];
        let flattened;
        switch (type) {
            case 'json':
                obj = JSON.parse(event.target.result);
                for (const key in obj) {
                    if (typeof (obj[key]) !== 'object') arr.push({ 'key': key, 'value': obj[key] })
                }
                setFileData(arr);
                break;
            case 'yml':
                obj = jsyaml.load(event.target.result);
                flattened = flattenJSON(obj);
                for (const key in flattened) {
                    if (typeof (flattened[key]) !== 'object') arr.push({ 'key': key, 'value': String(flattened[key]) })
                }
                setFileData(arr);
                break;
        }
    }

    const handleEnvClick = () => {
        updateForm(fileData, isTest, isStg, isProd);
        setOpen(false);
    }

    return (
        <>
            <DropzoneWrapper>
                <DropZone type={[]} dropText={isSecret ? "Drag and drop a .env, .json or .yml file here to add bulk secrets" : "Drag and drop a .env, .json or .yml file here to add bulk variables"} onDrop={handleDrop} />
            </DropzoneWrapper>

            <Dialog open={open} fullWidth maxWidth='md'  >
                <DialogContent   >
                    <Box display="flex" justifyContent="center" alignContent="center"  >
                        <div>
                            <Typography variant='h3' sx={{ marginLeft: "4rem" }} >Confirmation</Typography>
                            <Typography variant='h4' sx={{ margin: "0.6rem", }} >Upload secrets from this file </Typography>
                        </div>
                    </Box>


                    <Grid container spacing={15}  >
                        <Grid item xs={4} sm={4} paddingLeft="20px" marginTop="30px">
                            <FormLabel id="env-radio-buttons-group-label" sx={{ marginLeft: "3rem" }}> Select the environment to upload</FormLabel>
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <FormControlLabel control={<Checkbox checked={isTest} onChange={(e) => { setIsTest(e.target.checked) }} />} label="Test" labelPlacement="top" />
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <FormControlLabel control={<Checkbox checked={isStg} onChange={(e) => { setIsStg(e.target.checked) }} />} label="Stg" labelPlacement="top" />
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <FormControlLabel control={<Checkbox checked={isProd} onChange={(e) => { setIsProd(e.target.checked) }} />} label="Prod" labelPlacement="top" />
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <FormControlLabel control={<Checkbox checked={isAll} onChange={(e) => { setIsAll(e.target.checked); handleAllCheckboxChange(e.target.checked) }} />} label="All" labelPlacement="top" />

                        </Grid>

                    </Grid>

                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button color='primary' variant="contained" onClick={handleEnvClick}>Upload</Button>
                    <Button color='inherit' variant="contained" onClick={handleEnvClick}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

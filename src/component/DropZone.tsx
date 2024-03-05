// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

interface FileProp {
    name?: string
    type: string[]
    size?: number,
    dropText: string
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
    width: 48,
    height: 48,
    marginBottom: theme.spacing(8.5)
}))

const DropZone = (props: FileProp) => {

    const { name, type, size, dropText } = props;
    // ** State
    const [files, setFiles] = useState<File[]>([])

    // ** Hooks
    const theme = useTheme()
    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: {
            'application/json': ['.json'],
            'text/plain': ['.env', '.yml'],
            'application/x-yaml': []
        },
        onDrop: (acceptedFiles: File[]) => {
            setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
        }
    })

    /*  const img = files.map((file: FileProp) => (
         <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
     )) */

    return (
        <Box {...getRootProps({ className: 'dropzone' })} sx={files.length ? { height: 150 } : {}}>
            <input {...getInputProps()} />
            {files.length ? (
                <Typography>File uploaded</Typography>
            ) : (
                <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Img alt='Upload img' src={`/images/misc/upload-${theme.palette.mode}.png`} />
                    <Typography variant='h5' sx={{ mb: 2.5 }}>
                        {dropText ?? 'Drop files here or click to upload.'}
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default DropZone

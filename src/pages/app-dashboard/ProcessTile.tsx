import { Card } from "@mui/material"
import GridViewIcon from '@mui/icons-material/GridView';

const ProcessTile = () => {
    return (
        <>
            <Card sx={{ width: '150px', height: '150px', margin: '20px', borderRadius: '30px', textAlign: 'center', paddingTop: '40px' }}>
                <GridViewIcon />
                <h3>Clone</h3>
            </Card>
        </>
    )
}

export default ProcessTile
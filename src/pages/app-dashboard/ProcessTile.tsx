import { Card } from "@mui/material"
import GridViewIcon from '@mui/icons-material/GridView';

const ProcessTile = () => {
    return (
        <>
            <Card sx={{ minWidth: '120px', height: '120px', margin: '20px', borderRadius: '30px', textAlign: 'center', padding: '30px 10px 10px 10px' }}>
                <GridViewIcon fontSize="large" />
                <h3 className="mt-0">Clone</h3>
            </Card>
        </>
    )
}

export default ProcessTile
import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
interface AppDomainprops {
    url: string
}

const AppDomain = (prop: AppDomainprops) => {
    const { url } = prop
    return (
        <>
            <Grid container spacing={5}>
                <Grid item xs={4} sm={4}>
                    <Typography variant='h4'>
                        Domain
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4}>
                    {url}
                </Grid>
                <Grid item xs={4} sm={4}>
                    <Box display="flex" justifyContent="flex-end" alignItems="center"   >
                        <Button
                            aria-describedby="popover"
                            variant="contained"
                            color="inherit"
                        // onClick={handleClickOpen}
                        >
                            {" "}
                            Edit
                        </Button>
                    </Box>
                </Grid>

            </Grid>
        </>
    )
}

export default AppDomain;

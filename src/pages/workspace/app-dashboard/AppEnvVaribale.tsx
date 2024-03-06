import { Box, Button, Grid, Typography } from '@mui/material';
import React from 'react'


const AppEnvVaribale = (Prop: any) => {


    const EnvData = Prop.data.env_variables;
    console.log("new", Prop);





    const EnvVariableArray = Object.keys(EnvData.test).map(index => {
        const key = EnvData.test[index].key.trim();

        return {
            key,
            stg: EnvData.stg[index].value,
            test: EnvData.test[index].value,
            prod: EnvData.prod[index].value,
            //  isSecret:  EnvData.stg[index].is_secret
        };
    });

    console.log("val", EnvVariableArray);





    return (



        <Grid container spacing={5}>
            <Grid item xs={6} sm={6}><Typography variant="h4">
                Environment Variables
            </Typography></Grid>

            <Grid item xs={6} sm={6}><Typography variant="h4">
            <Box display="flex" justifyContent="flex-end" alignItems="center"   >
                <Button
                    aria-describedby="popover"
                    variant="contained"
                     color="inherit"
                //onClick={handleClickOpen}
                >
                    {" "}
                    Edit
                </Button>
                </Box>
            </Typography></Grid>


            <Grid item xs={3} sm={3}><Typography variant="h4">
                Environments
            </Typography></Grid>
            <Grid item xs={3} sm={3}><Typography variant="h4">
                Test
            </Typography></Grid>
            <Grid item xs={3} sm={3}><Typography variant="h4">
                Stage
            </Typography></Grid>
            <Grid item xs={3} sm={3}><Typography variant="h4">
                Production
            </Typography></Grid>

            {

                EnvVariableArray.map((item, index) => (
                    <>
                        <Grid item xs={3} sm={3}><Typography  variant="body2">
                            {item.key}</Typography></Grid>
                        <Grid item xs={3} sm={3}><Typography variant="body2">
                            {item.test}
                        </Typography></Grid>
                        <Grid item xs={3} sm={3}><Typography variant="body2">
                            {item.stg}
                        </Typography></Grid>
                        <Grid item xs={3} sm={3}><Typography variant="body2">
                            {item.prod}
                        </Typography></Grid>


                    </>

                ))
            }



        </Grid>
    )
}

export default AppEnvVaribale
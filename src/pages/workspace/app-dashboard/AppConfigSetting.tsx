import { Box, Button, Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, MenuItem, OutlinedInput, Select, TextField, Tooltip, Typography } from '@mui/material'

import React, { useState } from 'react'
import { APP_API } from 'src/@core/static/api.constant';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


interface prop{
   val:any
}


const AppConfigSetting = (Prop:any) => {

  const {http_path,port,instance_details,} =Prop

  console.log(Prop.data)
 // console.log(port)
  const [instanceSize, setInstanceSize] = useState(APP_API.instanceSizes[0]);

  const [minValue, setMinValue] = useState('1');
  const [maxValue, setMaxValue] = useState('1');
  const [isChecked, setIsChecked] = useState(instance_details?.vertical_auto_scale);
  const [error, setError] = useState('');
  const handleInstanceChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    const selectedInstance = (APP_API.instanceSizes).find((instance: { type: any; }) => instance.type === value);
    if (selectedInstance != null) {
      setInstanceSize(selectedInstance);
    }
  };

  const handleMinChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value.trim();
    if (!value || (Number(value) >= 1 && Number(value) <= 25)) {
      setMinValue(value);
      if (maxValue && Number(value) > Number(maxValue)) {
        setError('Min must be less than or equal to Max');
      } else {
        setError('');
      }
    } else {
      setError('Min value must be in between 1 and 25');
    }
  };

  const handleMaxChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value.trim();
    if (!value || (Number(value) >= 1 && Number(value) <= 25)) {
      setMaxValue(value);
      if (minValue && Number(value) < Number(minValue)) {
        setError('Max must be greater than or equal to Min');
      } else {
        setError('');
      }
    } else {
      setError('Max value must be in between 1 and 25');
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const handleverticalScalling = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIsChecked(event.target.checked);
    console.log("vertical Scalling : ", event.target.checked)
  };








  return (
        <form>

      

        <Grid container spacing={5}>
          <Grid item xs={6} sm={6}>
            <Typography variant="h3">
              App Settings
            </Typography>
          </Grid>
            {/* Button */}
          <Grid item xs={6} sm={6} >
            <Box display="flex" justifyContent="flex-end" alignItems="center"   >
              <Button
                    aria-describedby="popover"
                    variant="contained"
                  
                    //onClick={handleClickOpen}
                  >
                    {" "}
                    Edit
                  </Button>

              {/* <Button
                aria-describedby="popover"
                variant="contained"

              //onClick={handleClickOpen}
              >
                {" "}
                save
              </Button>

              <Button
                aria-describedby="popover"
                variant="contained"
                color="inherit"
                style={{ margin: 10 }}
              //onClick={handleClickOpen}
              >
                {" "}
                Cancel
              </Button> */}
            </Box>
          </Grid>


            {/* HTTP Port*/}
          <Grid item xs={3} sm={3}>
            <Typography variant="body1" component="span" fontWeight="bold">HTTP Port</Typography>
            <br />
            <Typography  variant="body2" component="span" >Http port for the Application</Typography>
          </Grid>
          {/* <Grid item xs={3} sm={3}>
            <TextField variant="outlined" size="small"
              label="HTTP Port"
              type="number"
              sx={{ maxWidth: 150, height: 'auto', marginBottom: '10px' }}
            // error={Boolean(ConfigurationErrors.port)}
            // {...configurationRegister("port", {
            //   required: true,
            //   valueAsNumber: true,
            // })}
            />
            {ConfigurationErrors.port && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-account-username"
                    >
                      This field is required
                    </FormHelperText>
                  )}
          </Grid> */}
          <Grid item xs={3} sm={3}>
            <div style={{ alignItems: "center" }}><Typography variant="body1" component="span" >{Prop.data.port}</Typography></div>
          </Grid>


          {/* HTTP Path */}
          <Grid item xs={3} sm={3}>



            <Typography variant="body1" component="span" fontWeight="bold">HTTP Path</Typography>
            <br />
            <Typography variant="body2" component="span" >Http path for the Application</Typography>

          </Grid>
          {/* <Grid item xs={4} sm={4} >
            <TextField variant="outlined" size="small"
              label="HTTP Path"
              sx={{ maxWidth: 150 }}
            // error={Boolean(ConfigurationErrors.http_path)}
            // {...configurationRegister("http_path", { required: true })}
            />
            {ConfigurationErrors.http_path && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-account-username"
                    >
                      This field is required
                    </FormHelperText>
                  )}
          </Grid> */}
          <Grid item xs={3} sm={3}>
            <div style={{ alignItems: "center" }}><Typography variant="body1" component="span" >{Prop.data.http_path}</Typography></div>
          </Grid>

          {/* App Instance */}
          <Grid item xs={4} sm={4}>
            <div><Typography variant="body1" component="span" fontWeight="bold">App Instance (AI)Size</Typography></div>
          </Grid>
          <Grid item xs={4} sm={4} style={{ marginTop: "-0.9rem" }}>
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
              <Select variant="outlined" size="small"
                id="no_of_Instances"
                displayEmpty
                value={instanceSize}
                sx={{ maxWidth: 250 }}
                // {...configurationRegister("no_of_Instances.0.")}
                onChange={handleInstanceChange}
                input={<OutlinedInput />}
                renderValue={() => {
                  return (
                    <Typography>
                      <Typography variant="body2" component="span" fontWeight="bold">
                        {instanceSize.type + "-"}
                      </Typography>
                      {instanceSize.ram + " RAM | " + instanceSize.vcpu + " vCPU"}
                    </Typography>
                  );
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                      width: 270,
                    },
                  },
                }}
                inputProps={{ 'aria-label': 'Without label' }}
              // disabled={true}
              >
                {APP_API.instanceSizes.map((instance, index) => (
                  <MenuItem key={index} value={instance.type}>
                    <Typography variant="body1" component="span" fontWeight="bold">
                      {instance.type + "-"}
                    </Typography>
                    {instance.ram + " RAM | " + instance.vcpu + " vCPU"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Select Instances */}
          <Grid item xs={4} sm={4} style={{ paddingTop: '0px', marginTop: '12px' }}>
            <FormGroup style={{ display: "block" }}>
              <FormControlLabel
                control={<Checkbox checked={isChecked} onChange={handleverticalScalling} />}
                label='Enable Vertical Auto-Scaling'
              // disabled={true}
              />
              <Tooltip title={"Vertical Auto-Scaling allows the App to use resources beyond the request when needed"} arrow>
                <InfoOutlinedIcon style={{ marginBottom: '-7px', marginLeft: '-12px', padding: 0 }} id="vertical_auto_scale" />
              </Tooltip>
            </FormGroup>
          </Grid>

          {/* Numebr of instances */}
          <Grid item xs={4} sm={4}>
            <div><Typography variant="body1" component="span" fontWeight="bold">Number of Instances</Typography></div>
          </Grid>
          <Grid item xs={8} sm={8}>
            <FormGroup>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
                <label htmlFor="min">Min</label>
                <TextField variant="outlined" size="small" type="text" id="min" value={minValue} onChange={handleMinChange} placeholder="1" style={{ width: "3rem" }} disabled={true} />
                <label htmlFor="max">Max</label>
                <TextField  variant="outlined" size="small" type="text" id="max" value={maxValue} onChange={handleMaxChange} placeholder="1" style={{ width: "3rem" }} disabled={true}  />
              </Box>
            </FormGroup>
          </Grid>

          {/* Error */}
          <Grid xs={8} sm={8} item> <Box sx={{ marginLeft: "16rem" }}>
            {error && <span style={{ color: 'red' }}>{error}</span>} </Box>
          </Grid>
        


        </Grid>

      </form>
  )
}

export default AppConfigSetting
import React, { useState } from 'react';
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import { Container, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Slide, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';




const AppConfiguration = ({ onNext }: any) => {


  const [environmentVariables, setEnvironmentVariables] = useState<any>();
  const [httpPort, setHttpPort] = useState('');
  const [httpPath, setHttpPath] = useState('');
  const [editingEnvironmentVariables, setEditingEnvironmentVariables] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [open, setOpen] = React.useState(false);
  const [newValue, setNewValue] = useState('');
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: '', value: '' }]);

  const handleAddKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
    setEnvironmentVariables([environmentVariables, { key: newKey, value: newValue }]);
    setNewKey('');
    setNewValue('');
  };

  const updateEnvironmentVariables = (pairs: any) => {
    const newEnvironmentVariables = pairs.map((pair: { key: any; value: any; }) => ({
      key: pair.key,
      value: pair.value,
    }));
    setEnvironmentVariables(newEnvironmentVariables);
  };

  const handleKeyValuePairChange = (index: any, key: any, value: any) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs[index] = { key, value };
    setKeyValuePairs(updatedPairs);
    updateEnvironmentVariables(updatedPairs);
  };

  const handleDeleteKeyValuePair = (index: any) => {
    const updatedPairs = keyValuePairs.filter((_, i) => i !== index);
    setKeyValuePairs(updatedPairs);
    updateEnvironmentVariables(updatedPairs);
  };


  const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("HTTP Port Value:", event.target.value); // Check if the value is being captured
    setHttpPort(event.target.value);
  };


  const handlePathChange = (event: any) => {
    console.log("HTTP Path Value:", event.target.value); // Check if the value is being captured
    setHttpPath(event.target.value);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logData = () => {
    console.log("Configuration Data:");
    console.log("Environment Variables:", keyValuePairs);
    console.log("HTTP Port:", httpPort);
    console.log("HTTP Path:", httpPath);
  };


  // function logData(arg0: {
  //   application_name: string; git_repo: string; git_branch: string; src_code_path: string; env_variables: { key: string; value: string; }[]; // Use keyValuePairs instead of environmentVariables
  //   port: string; // Use httpPort directly
  //   http_path: string;
  // }) {
  //   throw new Error('Function not implemented.');
  // }

  // const handleNext = () => {
  //   // Collect and log the saved data to the console
  //   console.log("Environment Variables:", environmentVariables);
  //   console.log("HTTP Port:", httpPort);
  //   console.log("HTTP Path:", httpPath);

  return (

    <>
      <Container>
        {/* <Button variant="contained" onClick={handleNext}>  Next
          </Button> */}

        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
          Create App from Source Code
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Provide data with this form to create your app.
        </Typography>


        <Grid container spacing={5}>

          <div style={{ width: "100%" }}>
            <h2>Configuration</h2>
            <div className="section">
              <h3>Environment Variables</h3>

              <div className="section">
                <h3 style={{ display: "flex", width: '100%', justifyContent: 'space-between', fontWeight: 'normal' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <span style={{ marginLeft: '10px' }}>api</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>

                      {environmentVariables?.length ? environmentVariables?.length : 0} Environment Variable{environmentVariables?.length !== 1 && 's'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {editingEnvironmentVariables ? (
                      <button style={{ marginRight: '2rem' }} onClick={() => setEditingEnvironmentVariables(false)}>Cancel</button>
                    ) : (
                      <Button aria-describedby="popover" variant="contained" onClick={handleClickOpen}>
                        Edit
                      </Button>)}

                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      style={{ zIndex: 100 }}
                    >
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Edit Environment Variables</h3>
                        <Box
                          component="form"
                          sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          {keyValuePairs.map((pair, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <label >Key:</label>

                              <TextField
                                label="Key"
                                placeholder="Key"
                                value={pair.key}
                                onChange={(e) => handleKeyValuePairChange(index, e.target.value, pair.value)}

                              />
                              <label style={{ marginBottom: '0.5rem', display: 'block' }}>Value:</label>

                              <TextField
                                label="Value"
                                placeholder="Value"
                                value={pair.value}
                                onChange={(e) => handleKeyValuePairChange(index, pair.key, e.target.value)}
                              />
                              <IconButton
                                aria-label="delete"
                                onClick={() => handleDeleteKeyValuePair(index)}
                                style={{ marginLeft: '1rem' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          ))}
                        </Box>
                        <button onClick={handleAddKeyValuePair} style={{ alignSelf: 'flex-end' }}>+</button>
                        <Button variant="contained" onClick={handleClose}>Save</Button>
                      </div>
                    </Dialog>


                  </div>
                </h3>
              </div>
            </div>
          </div>

        </Grid>

        <h2>Resource Settings</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>HTTP Port:</span>
          <span style={{ marginRight: '375px' }}></span> {/* Add space */}
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                label="HTTP Port"
                id="http-port"
                defaultValue={httpPort}
                size="small"
              />
            </div>
          </Box>
        </div>


        <br />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>HTTP Path:</span>
          <span style={{ marginRight: '375px' }}></span> {/* Add space */}
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                label="HTTP Path"
                id="http-path"
                value={httpPath}
                onChange={(e) => setHttpPath(e.target.value)}
                size="small"
              />
            </div>
          </Box>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            onNext({ environmentVariables, httpPort, httpPath });
            logData();
          }}
        >
          Next
        </Button>

      </Container>
    </>
  )
}



export default AppConfiguration

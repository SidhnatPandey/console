import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { editApp } from "src/services/appService";
import { App } from "./index";
import usePlan from "src/hooks/plan";
import useLoading from "src/hooks/loading";
import { AI_SIZE } from "src/@core/static/app.constant";
import Toaster from "src/utils/toaster";

interface AppConfigSettingProps {
  data: App;
  showEdit: boolean,
  setHideEdit(state: boolean): void
}

const AppConfigSetting = (props: AppConfigSettingProps) => {
  const { data, showEdit, setHideEdit } = props;
  const { isDeveloperPlan } = usePlan();
  const { loading, startLoading, stopLoading } = useLoading();


  const [obj, setObj] = useState({
    port: data.port,
    http_path: data.http_path,
    type: data.instance_details.instance_type,
    vertical_auto_scale: data.instance_details.vertical_auto_scale,
    max: data.instance_details.max,
    min: data.instance_details.min,
  });

  const handleInstanceChange = (event: { target: { value: any } }) => {
    const { value } = event.target;
    const selectedInstance = AI_SIZE.find(
      (instance: { type: any }) => instance.type === value
    );
    if (selectedInstance != null) {
      setInstanceSize(selectedInstance);
    }
  };
  const handleMinChange = (event: { target: { value: string } }) => {
    const value = event.target.value.trim();
    if (!value || (Number(value) >= 1 && Number(value) <= 25)) {
      setMinValue(value);
      if (maxValue && Number(value) > Number(maxValue)) {
        setError("Min must be less than or equal to Max");
      } else {
        setError("");
      }
    } else {
      setError("Min value must be in between 1 and 25");
    }
  };
  const handleMaxChange = (event: { target: { value: string } }) => {
    const value = event.target.value.trim();
    if (!value || (Number(value) >= 1 && Number(value) <= 25)) {
      setMaxValue(value);
      if (minValue && Number(value) < Number(minValue)) {
        setError("Max must be greater than or equal to Min");
      } else {
        setError("");
      }
    } else {
      setError("Max value must be in between 1 and 25");
    }
  };
  const handlePortChange = (event: { target: { value: string } }) => {
    const value = event.target.value.trim();
    setPort(Number(value));
  };
  const handlePathChange = (event: { target: { value: string } }) => {
    const value = event.target.value.trim();
    setPath(value);
  };

  const handleClickOpen = () => {
    setEdit(!isEdit);
  };

  const handleCancel = () => {
    setPort(obj.port);
    setPath(obj.http_path);
    setMinValue(obj.min + "");
    setMaxValue(obj.max + "");
    setEdit(false);
    setError("");
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const handleverticalScalling = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIsChecked(event.target.checked);
  };

  const instance_details = data.instance_details;
  const aiSizeIndex = AI_SIZE.map(e => e.type).indexOf(instance_details.instance_type);
  const [instanceSize, setInstanceSize] = useState(AI_SIZE[aiSizeIndex]);

  const [minValue, setMinValue] = useState<string>(obj.min + "");
  const [maxValue, setMaxValue] = useState<string>(obj.max + "");
  const [isChecked, setIsChecked] = useState<boolean>(
    instance_details?.vertical_auto_scale
  );
  const [error, setError] = useState<string>("");
  const [isEdit, setEdit] = useState<boolean>(false);
  const [port, setPort] = useState<number>(obj.port);
  const [http_path, setPath] = useState<string>(obj.http_path);

  const handleSave = (appId: any) => {
    setHideEdit(true);
    if (Number(minValue) > 0 && Number(maxValue) > 0) {
      startLoading();
      setEdit(false);
      data.port = Number(port);
      data.http_path = http_path;
      const obj = {
        instance_type: instanceSize.type,
        vertical_auto_scale: isChecked,
        max: Number(maxValue),
        min: Number(minValue),
      };
      data.instance_details = obj;
      appId = data.id;
      editApp(data, appId)
        .then((response) => {
          setTimeout(() => {
            setHideEdit(false);
          }, 60000)
          if (response.status == 200) {
            Toaster.successToast("Applying updated settings. Please wait!");
          } else {
            Toaster.errorToast("App is not able to edit due to some error message");
          }
        })
        .catch((error) => {
          Toaster.errorToast(error);
        })
        .finally(() => {
          stopLoading();
        });
    } else {
      if (Number(minValue) == 0 && Number(maxValue) == 0) {
        setError("min and max is required");
      } else if (Number(minValue) == 0) {
        setError("min is required");
      } else {
        setError("max is required");
      }
    }
  };

  return (
    <form>
      <Grid container spacing={5} >
        <Grid item xs={6} sm={6} style={{paddingTop:'0px'}}>
          <Typography variant="h3" fontWeight='bold'>App Settings</Typography>
        </Grid>
        {/* Button */}

        <Grid item xs={6} sm={6} style={{paddingTop:'0px'}}>
          {(showEdit) && (
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              {!isEdit && !loading ? (
                <Button
                  aria-describedby="popover"
                  variant="contained"
                  onClick={handleClickOpen}
                  color="inherit"
                >
                  {" "}
                  Edit
                </Button>
              ) : (
                <>
                  {" "}
                  <Button
                    aria-describedby="popover"
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <CircularProgress
                          size="1.2rem"
                          color="secondary"
                          style={{ marginRight: "5px" }}
                        />
                        Saving
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    aria-describedby="popover"
                    variant="contained"
                    color="inherit"
                    style={{ margin: 10 }}
                    onClick={handleCancel}
                  >
                    {" "}
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          )}
        </Grid>

        {/* HTTP Port*/}
        <Grid item xs={3} sm={3}>
          <Typography variant="body1" component="span" fontWeight="bold">
            HTTP Port
          </Typography>
          <br />
          <Typography variant="body2" component="span">
            Http port for the Application
          </Typography>
        </Grid>
        {isEdit ? (
          <Grid item xs={3} sm={3}>
            <TextField
              required
              variant="outlined"
              size="small"
              label="HTTP Port"
              type="number"
              sx={{ maxWidth: 150, height: "auto", marginBottom: "10px" }}
              value={port}
              onChange={handlePortChange}
            />
          </Grid>
        ) : (
          <Grid item xs={3} sm={3}>
            <div style={{ alignItems: "center" }}>
              <Typography variant="body1" component="span">
                {port + ""}
              </Typography>
            </div>
          </Grid>
        )}

        {/* HTTP Path */}
        <Grid item xs={3} sm={3}>
          <Typography variant="body1" component="span" fontWeight="bold">
            HTTP Path
          </Typography>
          <br />
          <Typography variant="body2" component="span">
            Http path for the Application
          </Typography>
        </Grid>
        <Grid item xs={3} sm={3}>
          {isEdit ? (
            <TextField
              variant="outlined"
              size="small"
              label="HTTP Path"
              sx={{ maxWidth: 120 }}
              value={http_path}
              onChange={handlePathChange} // Fixed this line
            />
          ) : (
            <Grid item xs={3} sm={3}>
              <div style={{ alignItems: "center" }}>
                <Typography variant="body1" component="span">
                  {http_path + ""}
                </Typography>
              </div>
            </Grid>
          )}
        </Grid>

        {/* App Instance */}
        <Grid item xs={4} sm={4}>
          <div>
            <Typography variant="body1" component="span" fontWeight="bold">
              App Instance (AI)Size
            </Typography>
          </div>
        </Grid>
        <Grid item xs={4} sm={4} style={{ marginTop: "-0.9rem" }}>
          <FormControl sx={{ ml: "-5.3rem", width: 300, mt: 3 }}>
            <Select
              variant="outlined"
              size="small"
              id="no_of_Instances"
              displayEmpty
              value={instanceSize}
              sx={{ maxWidth: 250 }}
              onChange={handleInstanceChange}
              input={<OutlinedInput />}
              renderValue={() => {
                return (
                  <Typography>
                    <Typography
                      variant="body2"
                      component="span"
                      fontWeight="bold"
                    >
                      {instanceSize?.type + "-"}
                    </Typography>
                    {instanceSize?.ram + " RAM | " + instanceSize?.vcpu + " vCPU"}
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
              inputProps={{ "aria-label": "Without label" }}
              disabled={!isEdit || isDeveloperPlan()}
            >
              {AI_SIZE.map((instance, index) => (
                <MenuItem key={index} value={instance.type}>
                  <Typography
                    variant="body1"
                    component="span"
                    fontWeight="bold"
                  >
                    {instance.type + "-"}
                  </Typography>
                  {instance.ram + " RAM | " + instance.vcpu + " vCPU"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Select Instances */}
        <Grid
          item
          xs={4}
          sm={4}
          style={{ paddingTop: "0px", marginTop: "12px" }}
        >
          <FormGroup style={{ display: "block" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={handleverticalScalling}
                />
              }
              label="Enable Vertical Auto-Scaling"
              disabled={!isEdit || isDeveloperPlan()}
            />
            <Tooltip
              title={
                "Vertical Auto-Scaling allows the App to use resources beyond the request when needed"
              }
              arrow
            >
              <InfoOutlinedIcon
                style={{
                  marginBottom: "-7px",
                  marginLeft: "-12px",
                  padding: 0,
                }}
                id="vertical_auto_scale"
              />
            </Tooltip>
          </FormGroup>
        </Grid>

        {/* Numebr of instances */}
        <Grid item xs={4} sm={4}>
          <div>
            <Typography variant="body1" component="span" fontWeight="bold">
              Number of Instances
            </Typography>
          </div>
        </Grid>
        <Grid item xs={8} sm={8}>
          <FormGroup sx={{ ml: "-5.3rem", mt: "-0.2rem" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <label htmlFor="min">Min</label>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                id="min"
                value={minValue}
                onChange={handleMinChange}
                placeholder="1"
                style={{ width: "3rem" }}
                disabled={!isEdit || isDeveloperPlan()}
              />
              <label htmlFor="max">Max</label>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                id="max"
                value={maxValue}
                onChange={handleMaxChange}
                placeholder="1"
                style={{ width: "3rem" }}
                disabled={!isEdit || isDeveloperPlan()}
              />
            </Box>
          </FormGroup>
        </Grid>

        {/* Error */}
        <Grid xs={8} sm={8} item>
          {" "}
          <Box sx={{ marginLeft: "16rem" }}>
            {error && <span style={{ color: "red" }}>{error}</span>}{" "}
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default AppConfigSetting;

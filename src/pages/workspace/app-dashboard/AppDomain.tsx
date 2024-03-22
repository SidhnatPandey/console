import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import * as yup from "yup";

interface AppDomainprops {
  url: string;
}

type FormValues = {
  testDomain: string;
  stgDomain: string;
  prodDomain: string;
};

const domainSchema = yup.object().shape({
  testDomain: yup
    .string()
    .url("Test domain must be of url type")
    .required("This field is required"),
  stgDomain: yup
    .string()
    .url("stg domain must be of url type")
    .required("This field is required"),
  prodDomain: yup
    .string()
    .url("prod domain must be of url type")
    .required("This field is required"),
});

const AppDomain = (prop: AppDomainprops) => {
  const { url } = prop;
  const [openDialog, setOpenDialog] = React.useState(false);
  const { register, handleSubmit }: UseFormReturn<FormValues, any> = useForm({
    resolver: yupResolver(domainSchema),
  });

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onSubmit = (data: any) => {
    console.log(data);
    handleCloseDialog();
  };

  const commonStyles = {
    bgcolor: "background.paper",
    m: 1,
    border: 1,
    p: 2.5,
  };

  return (
    <>
      <Card sx={{ margin: "-25px" }}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={6} sm={6}>
              <Typography variant="h5" fontWeight="bold">
                Domain
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6}>
              <Box display="flex" justifyContent="flex-end" alignItems="right">
                <Button
                  aria-describedby="popover"
                  variant="contained"
                  color="inherit"
                  onClick={handleClickOpen}
                >
                  {" "}
                  Edit
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1" component="span" fontWeight="bold">
                Test
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1" component="span" fontWeight="bold">
                Stage
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1" component="span" fontWeight="bold">
                Production
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1" component="span">
                <a href={url}>{url}</a>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1" component="span">
                <a href={url}>{url}</a>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography variant="body1" component="span">
                <a href={url}>{url}</a>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          style: {
            minWidth: "75%",
          },
        }}
      >
        <DialogTitle id="form-dialog-title">
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            ADD CUSTOM DOMAIN
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={10}>
            <Grid item xs={12} sm={12}>
              <Typography variant="body1" textAlign="center">
                Initializ does not provide domain registration services. However
                you can use a domain name that you already own. For any
                non-ASCII characters, please use Punycode representation.
              </Typography>
            </Grid>
          </Grid>

          {/* <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5} style={{ padding: "15px" }}>
              <Grid item xs={6} sm={6}>
                <Typography variant="body1" component="span" fontWeight="bold">
                  TEST Domain
                </Typography>
              </Grid>

              <Grid item xs={6} sm={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  type="text"
                  id="testDomain"
                  name="testDomain"
                  inputRef={register}
                  error={!!errors.testDomain}
                  helperText={errors.testDomain?.message}
                  placeholder="hell-world.test.mycustomdomain.com"
                  style={{ width: "20rem" }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={5} style={{ padding: "15px" }}>
              <Grid item xs={6} sm={6}>
                <Typography variant="body1" component="span" fontWeight="bold">
                  STAGE Domain
                </Typography>
              </Grid>

              <Grid item xs={6} sm={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  type="text"
                  id="stageDomain"
                  name="stageDomain"
                  inputRef={register}
                  error={!!errors.stageDomain}
                  helperText={errors.stageDomain?.message}
                  placeholder="hell-world.stg.mycustomdomain.com"
                  style={{ width: "20rem" }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={5} style={{ padding: "15px" }}>
              <Grid item xs={6} sm={6}>
                <Typography variant="body1" component="span" fontWeight="bold">
                  PROD Domain
                </Typography>
              </Grid>

              <Grid item xs={6} sm={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  type="text"
                  id="prodDomain"
                  name="prodDomain"
                  inputRef={register}
                  error={!!errors.prodDomain}
                  helperText={errors.prodDomain?.message}
                  placeholder="hell-world.mycustomdomain.com"
                  style={{ width: "20rem" }}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </form> */}
          <Grid padding={10}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5} style={{ padding: "15px" }}>
                <Grid item xs={6} sm={6}>
                  <Typography
                    variant="body1"
                    component="span"
                    fontWeight="bold"
                  >
                    TEST Domain
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    variant="outlined"
                    size="small"
                    type="text"
                    {...register("testDomain")}
                    placeholder="hell-world.test.mycustomdomain.com"
                    style={{ width: "20rem" }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={5} style={{ padding: "15px" }}>
                <Grid item xs={6} sm={6}>
                  <Typography
                    variant="body1"
                    component="span"
                    fontWeight="bold"
                  >
                    STAGE Domain
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    variant="outlined"
                    size="small"
                    type="text"
                    {...register("stgDomain")}
                    placeholder="hell-world.test.mycustomdomain.com"
                    style={{ width: "20rem" }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={5} style={{ padding: "15px" }}>
                <Grid item xs={6} sm={6}>
                  <Typography
                    variant="body1"
                    component="span"
                    fontWeight="bold"
                  >
                    PROD Domain
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    variant="outlined"
                    size="small"
                    type="text"
                    {...register("prodDomain")}
                    placeholder="hell-world.test.mycustomdomain.com"
                    style={{ width: "20rem" }}
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Box sx={{ ...commonStyles, borderColor: "primary.main" }}>
            <Typography variant="body1">
              Create a new CNAME record for your domain on your DNS Provider.
              paste the CNAME Alias into the record so the domain points to your
              Initializ app.
            </Typography>
            <Grid item xs={12} sm={12} style={{ margin: "0.75rem 0" }}>
              <Typography variant="body2" fontWeight="bold">
                CNAME Alias
              </Typography>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={4} sm={4}>
                <Typography
                  variant="body1"
                  component="span"
                  fontWeight="bold"
                  marginLeft={1}
                >
                  Test
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Typography
                  variant="body1"
                  component="span"
                  fontWeight="bold"
                  marginLeft={1}
                >
                  Stage
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Typography
                  variant="body1"
                  component="span"
                  fontWeight="bold"
                  marginLeft={1}
                >
                  Production
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={4} sm={4}>
                <Box
                  style={{
                    border: "1px solid #bdbdbd",
                    padding: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="body1"
                    component="span"
                    marginLeft={0.5}
                    paddingTop={0.75}
                  >
                    {url}
                  </Typography>
                  <IconButton
                    aria-label="copy"
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                    }}
                  >
                    <ContentCopy />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Box
                  style={{
                    border: "1px solid #bdbdbd",
                    padding: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="body1"
                    component="span"
                    marginLeft={0.5}
                    paddingTop={0.75}
                  >
                    {url}
                  </Typography>
                  <IconButton
                    aria-label="copy"
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                    }}
                  >
                    <ContentCopy />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Box
                  style={{
                    border: "1px solid #bdbdbd",
                    padding: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="body1"
                    component="span"
                    paddingTop={0.75}
                    marginLeft={0.5}
                  >
                    {url}
                  </Typography>
                  <IconButton
                    aria-label="copy"
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                    }}
                  >
                    <ContentCopy />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} style={{ margin: "0.75rem 0" }}>
              <Typography variant="body1">Example:</Typography>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={4} sm={4}>
                <Typography
                  variant="body1"
                  component="span"
                  fontWeight="bold"
                  marginLeft={1}
                >
                  Test
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Typography
                  variant="body1"
                  component="span"
                  fontWeight="bold"
                  marginLeft={1}
                >
                  Stage
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Typography
                  variant="body1"
                  component="span"
                  fontWeight="bold"
                  marginLeft={1}
                >
                  Production
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={4} sm={4}>
                <Box
                  sx={{
                    border: 1.75,
                    borderColor: "#bdbdbd",
                    padding: "0.2rem",
                  }}
                >
                  <Typography variant="body2">CNAME Alias</Typography>
                  <Typography variant="body2">
                    hello-world.test-{">"} hello-world.test.initz.run
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Box
                  sx={{
                    border: 1.75,
                    borderColor: "#bdbdbd",
                    padding: "0.2rem",
                  }}
                >
                  <Typography variant="body2">CNAME Alias</Typography>
                  <Typography variant="body2">
                    hello-world.test-{">"} hello-world.test.initz.run
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Box
                  sx={{
                    border: 1.75,
                    borderColor: "#bdbdbd",
                    padding: "0.2rem",
                  }}
                >
                  <Typography variant="body2">CNAME Alias</Typography>
                  <Typography variant="body2">
                    hello-world.test-{">"} hello-world.test.initz.run
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions
          style={{ textAlign: "center", justifyContent: "center" }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            color="primary"
          >
            Save
          </Button>
          <Button
            aria-describedby="popover"
            variant="contained"
            color="inherit"
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppDomain;

import React, { Fragment, useEffect, useState } from "react";
import { Grid, Card, Button, TextField, CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import ProcessLogs from "./ProcessLogs";
import Skeleton from 'react-loading-skeleton';
import { approval } from "src/services/dashboardService";
import toast from "react-hot-toast";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import { log } from "console";
import { Box } from "@mui/system";

// Define the prop types for the ProcessDetails component
interface ProcessDetailsProps {
  supplyChainStepData: {
    stage?: string;
    status?: string;
    duration?: string;
    gitRepo?: string;
    commit?: string;
    branch?: string;
    date?: string;
    started_at: string;
    completed_at: string;
    steps: Step[];
    result: Result[];
    step_name: string
  };
  loading: boolean,
  gitRepo: string | undefined,
  gitBranch: string | undefined,
  handleTrigger: Function
}

interface Step {
  completed_at: string;
  log: string;
  reason: string;
  run_name: string;
  started_at: string;
  status: string;
}

interface Result {
  Key: string,
  Value: string
}

const ProcessDetails: React.FC<ProcessDetailsProps> = ({
  supplyChainStepData,
  loading,
  gitRepo,
  gitBranch,
  handleTrigger
}) => {

  const [duration, setDuration] = useState<string | undefined>();
  const [comment, setComment] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>('')
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const calcDuration = () => {
    const sDate = new Date(supplyChainStepData.started_at);
    const eDate = new Date(supplyChainStepData.completed_at);
    let diff = eDate.getTime() - sDate.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / 1000 / 60);
    diff -= minutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);
    let string = '';
    if (hours > 0) { string = hours + " hour " }
    if (minutes > 0) { string += minutes + " min " }
    if (seconds > 0) { string += seconds + " sec" }
    setDuration(string);
  }

  const submitApproval = () => {
    if (submitted) {
      return;
    }
    const data = {
      task_id: supplyChainStepData.step_name,
      approved: action === "Approve" ? "true" : "false",
      comment: comment
    }
    setSubmitted(true);
    approval(data).then((response) => {
      if (response.status === 200) {
        setTimeout(() => {
          handleTrigger(supplyChainStepData.stage);
          toast.success("Approved Successfully");
          setSubmitted(false);
          handleClose();
        }, 5000)
      } else {
        handleClose();
        toast.error("Some Error Occured")
      }
    }).catch((error) => {
      toast.error("Some Error Occured")
    })
  }

  useEffect(() => {
    setDuration(undefined);
    if (supplyChainStepData) {
      calcDuration();
    }
  }, [supplyChainStepData]);

  const getValue = (value: string) => {
    const date = new Date(value);
    return date.toDateString() === "Invalid Date" ? value : date.toLocaleString();
  }

  return (
    <>
      <Card data-testid="card" sx={{ display: "flex", flexDirection: "row" }}>
        <Grid container spacing={2} style={{ padding: "30px" }}>
          <Grid item xs={12} style={{ marginBottom: "-10px", marginTop: "-20px" }}><h2>Stage Summary</h2></Grid>
          <Grid item xs={4}>
            {loading ? <Skeleton width={200} height={20} /> : <Typography variant="h5" data-testid="stage">
              <b>Stage:</b>{" "}
              {supplyChainStepData ? supplyChainStepData.stage : "N/A"}{" "}
            </Typography>}
          </Grid>
          <Grid item xs={4}>
            {loading ? <Skeleton width={150} height={20} /> : <Typography variant="h5" data-testid="duration">
              <b>Duration:</b> {(duration && !supplyChainStepData?.stage?.toLowerCase().includes("approval")) ? duration : "N/A"}
            </Typography>}
          </Grid>
          <Grid item xs={4}>
            {loading ? <Skeleton width={200} height={20} /> : <Typography variant="h5" data-testid="status">
              <b>Status:</b>{" "}
              {supplyChainStepData ? supplyChainStepData.status : "N/A"}{" "}
            </Typography>}
          </Grid>

          <Grid item xs={4}>
            {loading ? <Skeleton width={200} height={20} /> :
              <Typography data-testid="gitrepo" variant="h5">
                <b>Git Repo: </b>
                {gitRepo ? gitRepo : "N/A"}
              </Typography>}
          </Grid>

          <Grid item xs={4}>
            {loading ? <Skeleton width={150} height={20} /> :
              <Typography data-testid="branch" variant="h5">
                <b>Branch:</b> {gitBranch ? gitBranch : "N/A"}
              </Typography>}
          </Grid>

          <Grid item xs={4}>
            {loading ? <Skeleton width={150} height={20} /> :
              <Typography data-testid="date" variant="h5">
                <b>Date:</b> {(supplyChainStepData?.started_at && !supplyChainStepData?.stage?.toLowerCase().includes("approval")) ? new Date(supplyChainStepData?.started_at).toLocaleString() : "N/A"}
              </Typography>}
          </Grid>

          {supplyChainStepData?.result.length > 0 && <>
            <Grid item xs={12} style={{ marginBottom: "-20px", marginTop: "-10px" }}><h2>Result</h2></Grid>
            {supplyChainStepData.result.map((result: any, index: number) => {
              return <Fragment key={index}>
                <Grid item xs={2.5}>
                  {loading ? <Skeleton width={150} height={20} /> :
                    <Typography variant="h5">
                      <b>{result.Key.toLowerCase()}</b>
                    </Typography>}
                </Grid>
                <Grid item xs={9.5}>
                  {loading ? <Skeleton width={350} height={20} /> :
                    <Typography variant="h5">
                      {getValue(result.Value)}
                    </Typography>}
                </Grid>
              </Fragment>
            })}
          </>
          }

          <Grid item xs={12}>
            {(supplyChainStepData?.stage?.toLowerCase().includes("approval") && supplyChainStepData.status === 'Pending') && <>
              <Grid item xs={12} style={{ marginBottom: "0px", marginTop: "-10px" }}><h2>Approval</h2></Grid>
              <TextField id="outlined-basic" label="Comment" variant="outlined" style={{ width: '100%' }} value={comment}
                onChange={(e) => setComment(e.target.value)} />
              <div className='demo-space-x'>
                <Button variant='contained' color='success' size="large" onClick={e => { setAction('Approve'); handleClickOpen(); }}>
                  Approve
                </Button>
                <Button variant='contained' color='error' size="large" onClick={e => { setAction('Reject'); handleClickOpen(); }}>
                  Reject
                </Button>
              </div>
            </>}
          </Grid>
        </Grid>
      </Card >
      <br></br>
      {supplyChainStepData?.steps?.length > 0 && <ProcessLogs steps={supplyChainStepData?.steps} loading={loading} />}

      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {!submitted ? <p style={{ fontSize: '25px' }}>Are you sure you want to <b>{action}</b></p> :
              <>Submitting... <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box> </>}
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose} disabled={submitted} style={{ fontSize: '18px' }}>Cancel</Button>
          <Button onClick={submitApproval} disabled={submitted} style={{ fontSize: '18px', marginLeft: '15px' }} variant='contained'>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProcessDetails;

import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, Grid, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";
import { workspace } from "src/services/appService";
import { AuthContext } from "src/context/AuthContext";
import Toaster from "src/utils/toaster";
import useLoading from "src/hooks/loading";
import AlertDialog from "src/component/alertDialog";
import usePlan from "src/hooks/plan";

type FormData = {
  workspace_name: string;
  description: string;
};

const CreateWorkspace = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const authContext = useContext(AuthContext);
  const planHook = usePlan();
  const { loading, startLoading, stopLoading } = useLoading();
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  useEffect(() => {
    planHook.isAppCrationAllowed() ? "" : setOpenAlert(true);
  }, []);

  const onSubmit = (data: FormData) => {
    if (planHook.isDeveloperPlan()) {
      setOpenAlert(true);
    } else if (!loading) {
      startLoading();
      workspace(data)
        .then((response) => {
          if (response.status === 201) {
            Toaster.successToast("Workspace created successfully");
            authContext.fetchWorkspaces(data.workspace_name);
            reset();
          } else if (response.status === 409) {
            Toaster.infoToast(
              "Workspace name already exists for current organization"
            );
          } else {
            toast.error("An unexpected error occurred");
          }
        })
        .catch((error) => {
          Toaster.errorToast(error.message || "An error occurred");
        })
        .finally(() => {
          stopLoading();
        });
    }
  };

  return (
    <Card sx={{ p: 7, pt: 1 }} data-testid="card">
      <h2>Create New Workspace</h2>
      <p>Add Details To Create a New Workspace</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField
              data-testid="workspaceName"
              inputProps={{ maxLength: 20 }}
              fullWidth
              label="Workspace Name *"
              variant="outlined"
              error={Boolean(errors.workspace_name)}
              helperText={errors.workspace_name?.message}
              {...register("workspace_name", {
                required: "Workspace name is required",
              })}
            />
          </Grid>

          <Grid item xs={8}>
            <TextField
              data-testid="workspaceDescription"
              fullWidth
              label="Workspace Description"
              variant="outlined"
              multiline
              rows={4}
              {...register("description")}
            />
          </Grid>

          <Grid item xs={12} style={{ textAlign: "left" }}>
            <Button
              data-testid="Button"
              size="large"
              variant="contained"
              type="submit"
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
      <AlertDialog
        open={openAlert}
        heading={"Plan Upgrade Needed"}
        message={"Please go to billing to upgrade your plan"}
        onCancel={() => setOpenAlert(false)}
      />
    </Card>
  );
};

CreateWorkspace.acl = {
  action: "read",
  subject: "workspace",
};

export default CreateWorkspace;

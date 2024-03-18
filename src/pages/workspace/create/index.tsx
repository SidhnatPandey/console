import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, Grid, TextField, Button, CircularProgress } from "@mui/material";
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
    planHook.isDeveloperPlan() ? setOpenAlert(true) : "";
  }, []);

  const onSubmit = (data: FormData) => {
    if (planHook.isDeveloperPlan()) {
      setOpenAlert(true);
    } else if (!loading) {
      startLoading();
      const params = {
        workspace_name: data.workspace_name.trim(),
        description: data?.description,
      };
      workspace(params)
        .then((response) => {
          if (response.status === 201) {
            if (window.location.pathname.includes("workspaceError")) {
              window.location.reload();
            } else {
              Toaster.successToast("Workspace created successfully");
              authContext.fetchWorkspaces(data.workspace_name);
            }
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

  const validateWorkspaceName = (value: string) => {
    value = value.trim();
    if (!value) {
      return "Workspace name is required";
    }
    if (value.length < 3 || value.length > 25) {
      return "Workspace name must be between 3 and 25 characters";
    }
    if (!/^[a-zA-Z0-9_-\s]+$/.test(value)) {
      return "Workspace name can only contain alphanumeric characters, hyphens, underscores, and spaces";
    }
    return true;
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
              inputProps={{ minLength: 3, maxLength: 25 }}
              fullWidth
              label="Workspace Name *"
              variant="outlined"
              error={Boolean(errors.workspace_name)}
              helperText={errors.workspace_name?.message}
              {...register("workspace_name", {
                validate: validateWorkspaceName,
              })}
            />
          </Grid>

          <Grid item xs={8}>
            <TextField
              data-testid="workspaceDescription"
              fullWidth
              inputProps={{ maxLength: 200 }}
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size="1.2rem"
                    color="secondary"
                    style={{ marginRight: "5px" }}
                  />
                  Creating
                </>
              ) : (
                "Create"
              )}
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

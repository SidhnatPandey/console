import React from "react";
import { useForm } from "react-hook-form";
import { Card, Grid, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";
import { workspace } from "src/services/appService";

type FormData = {
  workspace_name: string;
  description: string;
};

const CreateWorkspace: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    workspace(data)
      .then((response) => {
        toast.success("Workspace Created Successfully");
        reset();
      })
      .catch((error) => {
        toast.error(error.message || "An error occurred");
      });
  };

  return (
    <Card sx={{ p: 7, pt: 1 }}>
      <h2>Create New Workspace</h2>
      <p>Add Details To Create a New Workspace</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField
              data-testid="workspaceName"
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
    </Card>
  );
};

export default CreateWorkspace;

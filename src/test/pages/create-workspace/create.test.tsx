import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import CreateWorkspace from "src/pages/workspace/create";
import "@testing-library/jest-dom";
import Toaster from "src/utils/toaster";

jest.mock("src/services/appService", () => ({
  workspace: jest.fn().mockResolvedValue({ status: 201 }), 
}));

jest.mock("src/utils/toaster", () => ({
  successToast: jest.fn(),
  errorToast: jest.fn(),
  infoToast: jest.fn(),
}));

describe("<CreateWorkspace />", () => {
  it("renders the component", () => {
    render(<CreateWorkspace />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText("Create New Workspace")).toBeInTheDocument();
    expect(
      screen.getByText("Add Details To Create a New Workspace")
    ).toBeInTheDocument();
    expect(screen.getByTestId("workspaceName")).toBeInTheDocument();
    expect(screen.getByTestId("workspaceDescription")).toBeInTheDocument();
  });

  test("allows entering workspace name and description", () => {
    render(<CreateWorkspace />);

    const workspaceNameInput = screen.getByLabelText(
      /workspace name/i
    ) as HTMLInputElement;
    fireEvent.change(workspaceNameInput, {
      target: { value: "New Workspace" },
    });
    expect(workspaceNameInput.value).toBe("New Workspace");

    const descriptionInput = screen.getByLabelText(
      /workspace description/i
    ) as HTMLInputElement;
    fireEvent.change(descriptionInput, {
      target: { value: "Workspace Description" },
    });
    expect(descriptionInput.value).toBe("Workspace Description");
  });

  test("submits the form data", async () => {
    render(<CreateWorkspace />);

    const workspaceNameInput = screen.getByLabelText(/workspace name/i);
    fireEvent.change(workspaceNameInput, {
      target: { value: "New Workspace" },
    });

    const descriptionInput = screen.getByLabelText(/workspace description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "Workspace Description" },
    });

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Toaster.successToast).toHaveBeenCalledWith(
        "Workspace created successfully"
      );
    });
  });

  test("reset the form data", async () => {
    render(<CreateWorkspace />);

    const workspaceNameInput = screen.getByLabelText(
      /workspace name/i
    ) as HTMLInputElement;
    fireEvent.change(workspaceNameInput, {
      target: { value: "New Workspace" },
    });

    const descriptionInput = screen.getByLabelText(
      /workspace description/i
    ) as HTMLInputElement;
    fireEvent.change(descriptionInput, {
      target: { value: "Workspace Description" },
    });

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Toaster.successToast).toHaveBeenCalledWith(
        "Workspace created successfully"
      );
    });
    expect(workspaceNameInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
  });
  test("shows an info toast if the workspace name already exists", async () => {
    // Override the mock implementation for this test
    require("src/services/appService").workspace.mockResolvedValueOnce({ status: 409 });
  
    render(<CreateWorkspace />);
  
    const workspaceNameInput = screen.getByLabelText(/workspace name/i);
    fireEvent.change(workspaceNameInput, {
      target: { value: "ExistingWorkspace" },
    });
  
    const descriptionInput = screen.getByLabelText(/workspace description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "Workspace Description" },
    });
  
    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(Toaster.infoToast).toHaveBeenCalledWith(
        "Workspace name already exists for current organization"
      );
    });
  });
});

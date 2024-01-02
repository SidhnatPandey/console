import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import CreateWorkspace from "src/pages/workspace/create";
import toast from "react-hot-toast";
import "@testing-library/jest-dom";

jest.mock("src/services/appService", () => ({
  workspace: jest.fn().mockResolvedValue({ message: "Success" }),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("<CreateWorkspace />", () => {
  it("renders the component", () => {
    render(<CreateWorkspace />);

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
      expect(toast.success).toHaveBeenCalledWith(
        "Workspace Created Successfully"
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
      expect(toast.success).toHaveBeenCalledWith(
        "Workspace Created Successfully"
      );
    });
    expect(workspaceNameInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
  });
});

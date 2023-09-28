import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Register from "../../../pages/register/index";
import { successToast } from "src/lib/react-taostify";
import * as authService from "src/pages/register/authService";

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock functions from authService
jest.mock("src/services/authService", () => ({
  signUp: jest.fn(),
  checkUsername: jest.fn(),
  checkEmail: jest.fn(),
}));

jest.mock("src/lib/react-taostify", () => ({
  successToast: jest.fn(),
}));

describe("Register Component", () => {
  test("submits the form successfully", async () => {
    // Mock the successful signUp function
    const mockSignUp = authService.signUp as jest.Mock;
    mockSignUp.mockResolvedValue({ message: "Registered successfully" });

    // Mock the checkUsername function
    const mockCheckUsername = authService.checkUsername as jest.Mock;
    mockCheckUsername.mockResolvedValue({
      available: true,
      message: "Username is available",
    });

    // Mock the checkEmail function
    const mockCheckEmail = authService.checkEmail as jest.Mock;
    mockCheckEmail.mockResolvedValue({
      available: true,
      message: "Email is available",
    });
    render(<Register />);

    // Query elements and interact with them
    const usernameInput = screen.getByLabelText("Username");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const organizationInput = screen.getByLabelText("Organization");

    const agreeCheckboxByRole = screen.getByRole("checkbox", {
      name: "I agree to privacy policy & terms",
    });

    const submitButton = screen.getByText("Sign up");

    // Interact with form elements
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Test123@" } });
    fireEvent.change(organizationInput, { target: { value: "Test Org" } });
    fireEvent.click(agreeCheckboxByRole);
    fireEvent.click(submitButton);

    // Wait for the success toast to be triggered
    await waitFor(() => {
      expect(successToast).toHaveBeenCalled();
    });
  });
});
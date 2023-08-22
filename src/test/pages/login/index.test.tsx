import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "../../../pages/login/index";
import * as authService from "src/services/authService";

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("src/services/authService", () => ({
  login: jest.fn(),
}));

describe("LoginPage", () => {
  test("submits the form with valid data and successfully logs in", async () => {
    // Create a spy for the login function
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockResolvedValue({ message: "Login successfully" });

    render(<Login />);

    // Simulate user interactions (typing in email and password fields)
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    // Simulate form submission
    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);

    // Wait for the success message
    await waitFor(() => {
      // Assert that the login function is called with the correct payload
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
    });
  });
});

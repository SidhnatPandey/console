import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "../../../pages/login/index";
import * as authService from "src/services/authService";

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

console.error = jest.fn();

describe("login function", () => {
  it("submits the form with valid data and successfully logs in", () => {
    render(<Login />);

    // Simulate user interactions (typing in email and password fields)
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    // Simulate form submission
    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);
  });
  it("should call postPublic and return response data", async () => {
    // Mock the response data
    const responseData = { message: "Login successful" };

    // Mock the API function
    const mockApiFunction = jest.fn().mockResolvedValue({ data: responseData });

    // Mock the login detail object
    const loginDetail = {
      email: "test@example.com",
      password: "password",
    };

    // Call the login function with the mock API function
    const result = await authService.login(loginDetail, mockApiFunction);

    // Assertions
    expect(result).toEqual(responseData);
    expect(mockApiFunction).toHaveBeenCalledWith("/login", loginDetail);
  });

  it("should throw an error if postPublic throws an error", async () => {
    // Mock the error
    const error = new Error("API error");

    // Mock the API function
    const mockApiFunction = jest.fn().mockRejectedValue(error);

    // Mock the login detail object
    const loginDetail = {
      email: "test@example.com",
      password: "password",
    };

    // Call the login function with the mock API function and expect it to throw an error
    await expect(authService.login(loginDetail, mockApiFunction)).rejects.toThrow(error);
    expect(mockApiFunction).toHaveBeenCalledWith("/login", loginDetail);
  });
});
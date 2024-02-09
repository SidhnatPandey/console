import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import EditCard from "src/pages/billing/editCard";


describe("EditCard Component", () => {
  const mockItem = {
    id: "some-id",
    created: Date.now(),
    card: {
      brand: "visa",
      last4: "1234",
      exp_month: 12,
      exp_year: 2023,
      country: "US",
    },
    billing_details: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: {
        line1: "123 Main St",
        line2: "",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "12345",
      },
    },
    Default: false,
  };

  const mockHandleClose = jest.fn();

  test("renders EditCard component", () => {
    render(<EditCard open={true} handleClose={mockHandleClose} item={mockItem} />);

    expect(screen.getByText(/edit card/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiry month/i)).toBeInTheDocument();
  });

  // test("handles form submission", async () => {
  //   render(<EditCard open={true} handleClose={mockHandleClose} item={mockItem} />);

  //   userEvent.selectOptions(screen.getByLabelText(/expiry month/i), "1");
  //   userEvent.selectOptions(screen.getByLabelText(/expiry year/i), "2023");
  //   userEvent.type(screen.getByLabelText(/cardholder name/i), "John Doe");

  //   fireEvent.click(screen.getByRole("button", { name: /submit/i }));

  //   await waitFor(() => {
  //     expect(mockHandleClose).toHaveBeenCalledTimes(1);
  //   });
  // });

  test("handles form submission with loading", async () => {
    render(<EditCard open={true} handleClose={mockHandleClose} item={mockItem} />);
  
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  
    await waitFor(() => {
      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    });
  });
  

  // test("handles form submission error", async () => {
  //   jest.mock("src/services/billingService", () => ({
  //     updateCard: jest.fn(() => Promise.reject(new Error("Update error"))),
  //   }));
  
  //   render(<EditCard open={true} handleClose={mockHandleClose} item={mockItem} />);
  
  //   fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  //     const errorTextRegex = /some error occurred/i;
  //     expect(screen.getByText(errorTextRegex)).toBeInTheDocument();
  //   });
  });
  

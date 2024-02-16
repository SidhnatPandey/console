import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import InvoiceTable from "src/pages/billing/invoices";
import { listOfInvoice } from "src/services/billingService";
import '@testing-library/jest-dom';

jest.mock("src/services/billingService");

describe("InvoiceTable component", () => {
  it("renders invoice table with data", async () => {
    const mockData = [
      { invoice_number: "INV001", total_cost: 100, created_at: "2022-02-14", status: "Paid", pdf: "download-link-1" },
    ];

    (listOfInvoice as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(<InvoiceTable />);

    await waitFor(() => expect(listOfInvoice).toHaveBeenCalledTimes(1));

    expect(screen.getByText("Billing History")).toBeInTheDocument();
    expect(screen.getByText("INV001")).toBeInTheDocument();
    expect(screen.getByText("$ 100")).toBeInTheDocument();
    expect(screen.getByText("14 Feb 2022")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Download' })).toBeInTheDocument();
  });

  it("renders loading state", async () => {
    (listOfInvoice as jest.Mock).mockResolvedValueOnce({ data: [] });

    render(<InvoiceTable />);

    expect(screen.getByText("Loading ...")).toBeInTheDocument();
  });
});

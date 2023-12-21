import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import AppLogs from "src/pages/apps/app-dashboard/AppLogs";
import "@testing-library/jest-dom";

jest.mock("src/services/dashboardService", () => ({
  getAppLogs: jest.fn(() =>
    Promise.resolve({ data: { log: "Mocked Log Data" } })
  ),
}));

describe("AppLogs Component", () => {
  it("renders the component with tabs and logs", async () => {
    render(<AppLogs appName="TestApp"  />);
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput);
    expect(screen.getByTestId("logs-container")).toBeInTheDocument();
    expect(screen.getByTestId("tab-prod")).toBeInTheDocument();
    expect(screen.getByTestId("tab-stg")).toBeInTheDocument();
    expect(screen.getByTestId("tab-test")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("tab-stg"));
    expect(screen.getByTestId("logs-container")).toBeInTheDocument();
  });

  it("renders log item 0", async () => {
    render(<AppLogs appName="TestApp"  />);
    await waitFor(() => {
        const logItem0 = screen.getByTestId("log-item-0");
        expect(logItem0).toBeInTheDocument();
      });      
  });
});

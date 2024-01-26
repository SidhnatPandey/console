import React from "react";
import { render, screen } from "@testing-library/react";
import SecurityCompliance from "src/pages/security/SecurityCompliance";
import "@testing-library/jest-dom";

jest.mock("src/@core/components/react-apexcharts");

jest.mock("src/services/securityService", () => ({
  getScans: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe("SecurityCompliance Component", () => {
  it("renders without crashing", () => {
    render(<SecurityCompliance appId="test-app-id" />);
    expect(screen.getByText("Scan Compliance")).toBeInTheDocument();
  });

  it("renders without crashing card", () => {
    render(<SecurityCompliance appId="test-app-id" />);
    expect(screen.getByTestId("security-compliance-card")).toBeInTheDocument();
  });

  it("fetches and displays scan title correctly", () => {
    render(<SecurityCompliance appId="test-app-id" />);
    expect(screen.getByTestId("total-scans")).toBeInTheDocument();
    expect(screen.getByTestId("succeeded-scans")).toBeInTheDocument();
    expect(screen.getByTestId("failed-scans")).toBeInTheDocument();
  });

  it("fetches and displays scan data correctly", () => {
    render(<SecurityCompliance appId="test-app-id" />);
    expect(screen.getByTestId("total-scans-data")).toBeInTheDocument();
    expect(screen.getByTestId("succeeded-scans-data")).toBeInTheDocument();
    expect(screen.getByTestId("failed-scans-data")).toBeInTheDocument();
  });
});

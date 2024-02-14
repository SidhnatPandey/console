// Import necessary libraries and the component
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ApplicationVulnerabilities from "src/pages/security/ApplicationVulnerabilities";
import { SecurityContext } from "src/context/SecurityContext";

jest.mock("src/services/securityService", () => ({
  vulnerabilitiesList: jest.fn().mockResolvedValue({
    vulnerabilitiesList: [
      {
        AppId: "1",
        AppName: "App A",
        LastScanned: "2023-01-15",
        WorkspaceId: "workspace1",
        WorkspaceName: "Workspace A",
        Cves: [{ Count: 1, Severity: "Critical" }],
      },
      {
        AppId: "2",
        AppName: "App B",
        LastScanned: "2023-01-16",
        WorkspaceId: "workspace2",
        WorkspaceName: "Workspace B",
        Cves: [{ Count: 2, Severity: "High" }],
      },
    ],
  }),
}));

describe("ApplicationVulnerabilities", () => {
  const mockContextValue = {
    setRunType: jest.fn(),
    workspace: "mock-workspace",
    runType: "mock-runType",
    setWorkspace: jest.fn(),
    appId: "mock-app",
    setAppId: jest.fn(),
  };

  it("renders table headers correctly", () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ApplicationVulnerabilities />
      </SecurityContext.Provider>
    );
    expect(screen.getByText(/App Name/i)).toBeInTheDocument();
    expect(screen.getByText(/workspace/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Scanned/i)).toBeInTheDocument();
    expect(screen.getByText(/CVEs/i)).toBeInTheDocument();
    expect(screen.getByText(/DOWNLOAD/i)).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ApplicationVulnerabilities />
      </SecurityContext.Provider>
    );
  });

  it("sorts data correctly", async () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ApplicationVulnerabilities />
      </SecurityContext.Provider>
    );
    const appNameHeader = screen.getByText("App Name");
    fireEvent.click(appNameHeader);
  });

  it("filters data based on search term", async () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ApplicationVulnerabilities />
      </SecurityContext.Provider>
    );
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "searchTerm" } });
  });

  it("displays no data message when no apps are available", async () => {
    jest.mock("src/services/securityService", () => ({
      vulnerabilitiesList: jest.fn().mockResolvedValue({ data: [] }),
    }));
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ApplicationVulnerabilities />
      </SecurityContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("No Apps Available")).toBeInTheDocument();
    });
  });
});

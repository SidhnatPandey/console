// Import necessary libraries and the component
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImpactedApplications from "src/pages/security/cve/[cveId]/ImpactedApplications";
import { SecurityContext } from "src/context/SecurityContext";

jest.mock("src/services/securityService", () => ({
  appAffected: jest.fn().mockResolvedValue({
    appAffected: [
      {
        AppName: "1",
        Workspace: "High",
      },
    ],
  }),
}));

describe("cveVulnerabilitiesList", () => {
  const mockContextValue = {
    setRunType: jest.fn(),
    workspace: "mock-workspace",
    runType: "mock-runType",
    setWorkspace: jest.fn(),
    cveId: "mock-app",
    setCveId: jest.fn(),
  };

  it("renders table headers correctly", () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ImpactedApplications
          setAppsAffectedData={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
          loading={false}
        />
      </SecurityContext.Provider>
    );
    expect(screen.getByText("APPLICATION")).toBeInTheDocument();
    expect(screen.getByText("WORKSPACE")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ImpactedApplications
          setAppsAffectedData={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
          loading={false}
        />{" "}
      </SecurityContext.Provider>
    );
  });

  it("sorts data correctly", async () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ImpactedApplications
          setAppsAffectedData={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
          loading={false}
        />{" "}
      </SecurityContext.Provider>
    );
    const appNameHeader = screen.getByText("APPLICATION");
    fireEvent.click(appNameHeader);
  });

  it("filters data based on search term", async () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ImpactedApplications
          setAppsAffectedData={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
          loading={false}
        />{" "}
      </SecurityContext.Provider>
    );
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "searchTerm" } });
  });

  it("displays no data message when no apps are available", async () => {
    jest.mock("src/services/securityService", () => ({
      appAffected: jest.fn().mockResolvedValue({ data: [] }),
    }));
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ImpactedApplications
          setAppsAffectedData={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
          loading={false}
        />{" "}
      </SecurityContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("No Apps Available")).toBeInTheDocument();
    });
  });
});

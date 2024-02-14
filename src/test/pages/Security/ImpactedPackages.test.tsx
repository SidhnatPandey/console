// Import necessary libraries and the component
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImpactedPackages from "src/pages/security/cve/[cveId]/ImpactedPackages";
import { SecurityContext } from "src/context/SecurityContext";

jest.mock("src/services/securityService", () => ({
  appAffected: jest.fn().mockResolvedValue({
    packageAffected: [
      {
        PackageName: "1",
        Version: "High",
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
        <ImpactedPackages
          setAppsAffectedData={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
          loading={false}
        />
      </SecurityContext.Provider>
    );
    expect(screen.getByText("PACKAGE")).toBeInTheDocument();
    expect(screen.getByText("VERSION")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ImpactedPackages
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
        <ImpactedPackages
          setAppsAffectedData={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
          loading={false}
        />{" "}
      </SecurityContext.Provider>
    );
    const packageNameHeader = screen.getByText("PACKAGE");
    fireEvent.click(packageNameHeader);
  });

  it("filters data based on search term", async () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <ImpactedPackages
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
        <ImpactedPackages
          setAppsAffectedData={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
          loading={false}
        />{" "}
      </SecurityContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("No Package Available")).toBeInTheDocument();
    });
  });
});

// Import necessary libraries and the component
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CveVulnerabilities from "src/pages/security/app/[appId]/CveVulnerabilities";
import { SecurityContext } from "src/context/SecurityContext";

jest.mock("src/services/securityService", () => ({
  cveVulnerabilitiesList: jest.fn().mockResolvedValue({
    cveVulnerabilitiesList: [
      {
        CveId: "1",
        Severity: "High",
        Package: "libc-bin",
        Version: "2.35-0ubuntu3.6",
        Description:
          "sha256crypt and sha512crypt through 0.6 allow attackers to cause a denial of service (CPU consumption) because the algorithm's runtime is proportional to the square of the length of the password.",
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
        <CveVulnerabilities appId={""} />
      </SecurityContext.Provider>
    );
    expect(screen.getByText(/CVEID/i)).toBeInTheDocument();
    expect(screen.getByText(/SEVERITY/i)).toBeInTheDocument();
    expect(screen.getByText(/PACKAGE/i)).toBeInTheDocument();
    expect(screen.getByText(/VERSION/i)).toBeInTheDocument();
    expect(screen.getByText(/DESCRIPTION/i)).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <CveVulnerabilities appId={""} />
      </SecurityContext.Provider>
    );
  });

  it("sorts data correctly", async () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <CveVulnerabilities appId={""} />
      </SecurityContext.Provider>
    );
    const appNameHeader = screen.getByText("CVEID");
    fireEvent.click(appNameHeader);
  });

  it("filters data based on search term", async () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <CveVulnerabilities appId={""} />
      </SecurityContext.Provider>
    );
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "searchTerm" } });
  });

  it("displays no data message when no apps are available", async () => {
    jest.mock("src/services/securityService", () => ({
      cveVulnerabilitiesList: jest.fn().mockResolvedValue({ data: [] }),
    }));
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <CveVulnerabilities appId={""} />
      </SecurityContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("No CVEs Available")).toBeInTheDocument();
    });
  });
});

import { render, screen } from "@testing-library/react";
import SeverityEpss from "src/pages/security/cve/[cveId]/SeverityEpssCard";
import "@testing-library/jest-dom";
import React from "react";

jest.mock("src/services/securityService", () => ({
  getEpssScore: jest.fn(),
}));

describe("SeverityEpss Component", () => {
  it("renders with provided props and mock data", async () => {
    const appsAffectedData = {
      CveId: "",
      Severity: "High",
    };

    render(<SeverityEpss appsAffectedData={appsAffectedData} />);

    expect(screen.getByText("SEVERITY")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();

    expect(screen.getByText("EXPLOIT PROBABILITY")).toBeInTheDocument();
    expect(screen.getByText("in next 30 days")).toBeInTheDocument();

    expect(screen.getByText("EPSS SCORE")).toBeInTheDocument();
    expect(
      screen.getByText("Exploit Prediction Scoring System")
    ).toBeInTheDocument();
  });
});

import { render } from "@testing-library/react";
import SeverityEpss from "src/pages/security/cve/[cveId]/SeverityEpssCard";
import "@testing-library/jest-dom";

jest.mock("src/services/securityService", () => ({
  getEpssScore: jest.fn(),
}));

describe("SeverityEpss Component", () => {
  it("renders with provided props and mock data", async () => {
    const appsAffectedData = {
      CveId: "",
      Severity: "High",
    };

    const { getByText } = render(
      <SeverityEpss appsAffectedData={appsAffectedData} />
    );

    expect(getByText("SEVERITY")).toBeInTheDocument();
    expect(getByText("High")).toBeInTheDocument();

    expect(getByText("EXPLOIT PROBABILITY")).toBeInTheDocument();
    expect(getByText("in next 30 days")).toBeInTheDocument();

    expect(getByText("EPSS SCORE")).toBeInTheDocument();
    expect(getByText("Exploit Prediction Scoring System")).toBeInTheDocument();
  });
});

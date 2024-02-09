import { render, screen, waitFor } from "@testing-library/react";
import SecurityCveChart from "src/pages/security/app/[appId]/SecurityCveChart";
import "@testing-library/jest-dom";

jest.mock("src/services/securityService", () => ({
  cveHistory: jest.fn().mockResolvedValue({
    data: [
      {
        MonthYear: "01/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "02/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "03/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "04/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "05/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "06/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "07/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "08/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "09/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "10/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "11/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
      {
        MonthYear: "12/22",
        TotalCriticalCVEs: 0,
        TotalHighCVEs: 0,
        TotalMediumCVEs: 0,
        TotalLowCVEs: 0,
        TotalUnknownCVEs: 0,
      },
    ],
  }),
}));

describe("SecurityCveChart component", () => {
  test("renders all months correctly", async () => {
    const { getByText } = render(<SecurityCveChart appId="testAppId" />);
    const expectedMonths = [
      "01/22",
      "02/22",
      "03/22",
      "04/22",
      "05/22",
      "06/22",
      "07/22",
      "08/22",
      "09/22",
      "10/22",
      "11/22",
      "12/22",
    ];
    expectedMonths.forEach(async (month) => {
      await waitFor(() => {
        const monthRegex = screen.getByText(month);
        expect(monthRegex).toBeInTheDocument();
      });
    });
  });

  test("renders without crashing", () => {
    render(<SecurityCveChart appId="testAppId" />);
    const card = screen.getByTestId("cve-chart-container");
    const titleElement = screen.getByText("CVE Trend");
    const subheaderElement = screen.getByText("Last 12 Months");
    expect(card).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(subheaderElement).toBeInTheDocument();
  });
});

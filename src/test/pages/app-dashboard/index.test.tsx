import AppDashboard from "../../../pages/apps/app-dashboard/index";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";


jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("src/services/dashboardService", () => ({
  supplyChainRuns: jest.fn().mockResolvedValue({
    data: {
      supplyChainProperty1: "Value1",
      supplyChainProperty2: "Value2",
    },
  }),
}));

jest.mock("src/services/appService", () => ({
  appDetails: jest.fn().mockResolvedValue({
    data: {
      application_name: "Your App",
      stage: "Production",
      status: "Running",
      id: "your-id",
      port: 8080,
      http_path: "/your-path",
      description: "Your description",
    },
  }),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: () => [false, jest.fn()],
}));
describe("AppDashboard Component", () => {

  beforeEach(() => {
    render(<AppDashboard />);
  })

  it("should render loading state", async () => {

    expect(screen.getByTestId("card")).toBeInTheDocument();

    expect(screen.getByTestId("tab-list")).toBeInTheDocument();

    expect(screen.getByTestId("stage-icon")).toBeInTheDocument();

    expect(screen.getByTestId("status-icon")).toBeInTheDocument();

    expect(screen.getByTestId("location-icon")).toBeInTheDocument();

    expect(screen.getByTestId("title")).toBeInTheDocument();

    expect(screen.getByTestId("stage")).toBeInTheDocument();

    expect(screen.getByTestId("status")).toBeInTheDocument();

    expect(screen.getByTestId("website-link")).toBeInTheDocument();
  });

  it("should render data state", async () => {

    await waitFor(() => {
      expect(screen.getByTestId("tab-1")).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId("tab-1"));
    expect(screen.getByTestId("tab-panel-1")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("tab-2"));
    expect(screen.getByTestId("tab-panel-2")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("tab-3"));
    expect(screen.getByTestId("tab-panel-3")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("tab-4"));
    expect(screen.getByTestId("tab-panel-4")).toBeInTheDocument();
  });

  it("should switch tabs", async () => {
    userEvent.click(screen.getByTestId("tab-2"));
    expect(screen.getByTestId("tab-panel-2")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("tab-3"));
    expect(screen.getByTestId("tab-panel-3")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("tab-4"));
    expect(screen.getByTestId("tab-panel-4")).toBeInTheDocument();
  });
});

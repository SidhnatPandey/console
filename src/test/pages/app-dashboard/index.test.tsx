import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import AppDashboard from "../../../pages/app-dashboard/index";
import AppSummary from "../../../pages/apps/app-dashboard/AppSummay";
import AppCreationFlow from "../../../pages/app-dashboard/ProcessTile";
import ProcessDetails from "../../../pages/app-dashboard/ProcessDetails";
import ProcessLogs from "../../../pages/app-dashboard/ProcessLogs";
describe("Integration Test Suite", () => {
  // Tests for AppDashboard Component
  describe("AppDashboard Component", () => {
    beforeEach(() => {
      render(<AppDashboard />);
    });

    it("renders without crashing", () => {
      // Check if the component renders without errors
      const cardElement = screen.getByTestId("card");
      expect(cardElement).toBeInTheDocument();
    });

    it("displays the correct title", () => {
      // Check if the title element and its text content are correct
      const titleElement = screen.getByTestId("title");
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.textContent).toBe("Hello World");
    });

    it("changes tabs when clicked", () => {
      // Click on the 'Insights' tab
      fireEvent.click(screen.getByTestId("tab-2"));

      // Ensure that the 'Insights' tab is active
      const insightsTab = screen.getByTestId("tab-2");
      expect(insightsTab).toHaveClass("Mui-selected");

      // Click on the 'Settings' tab
      fireEvent.click(screen.getByTestId("tab-4"));

      // Ensure that the 'Settings' tab is active
      const settingsTab = screen.getByTestId("tab-4");
      expect(settingsTab).toHaveClass("Mui-selected");
    });

    it("displays card content", () => {
      // Check if specific elements inside the card are present
      expect(screen.getByTestId("title")).toBeInTheDocument();
      expect(screen.getByTestId("tab-list")).toBeInTheDocument();
    });

    it("displays tab content", () => {
      // Click on the 'Overview' tab
      fireEvent.click(screen.getByTestId("tab-1"));

      // Ensure that the 'Overview' tab panel is active and its content is displayed
      const overviewTabPanel = screen.getByTestId("tab-panel-1");
      expect(overviewTabPanel).toBeInTheDocument();

      // Switch to the 'Insights' tab
      fireEvent.click(screen.getByTestId("tab-2"));

      // Ensure that the 'Insights' tab panel is active and its content is displayed
      const insightsTabPanel = screen.getByTestId("tab-panel-2");
      expect(insightsTabPanel).toBeInTheDocument();

    });

    it("displays a link in the card", () => {
      const linkElement = screen.getByText("https://hello-world.init.run");

      // Check if the link is present and has the correct URL
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute("href", "abc.com");
      expect(linkElement).toHaveStyle({ color: "#655bd3" });
    });

    it("changes tab when keyboard navigation is used", () => {
      // Select the 'Overview' tab
      fireEvent.keyDown(screen.getByTestId("tab-1"), { key: "Enter" });

      // Ensure that the 'Overview' tab is active
      const overviewTab = screen.getByTestId("tab-1");
      expect(overviewTab).toHaveClass("Mui-selected");

      // Select the 'Insights' tab using keyboard navigation
      fireEvent.keyDown(screen.getByTestId("tab-1"), { key: "ArrowRight" });
    });
  });

  // Tests for AppSummary Component
  describe("AppSummary Component", () => {
    beforeEach(() => {
      render(<AppSummary />);
    });

    it("renders without crashing", () => {
      // Check if the component renders without errors
      const appSummaryElement = screen.getByText("App Summary");
      expect(appSummaryElement).toBeInTheDocument();
    });

    it("displays last updated time", () => {
      // Check if the last updated time text is displayed
      const updatedTimeElement = screen.getByText("Updated 1 minute ago");
      expect(updatedTimeElement).toBeInTheDocument();
    });
  });

  // Tests for AppCreationFlow Component
  describe("AppCreationFlow Component", () => {
    beforeEach(() => {
      render(<AppCreationFlow />);
    });

    it("renders without crashing", () => {
      // Check if the component renders without errors
      const appCreationFlowElement = screen.getByText("Clone");
      expect(appCreationFlowElement).toBeInTheDocument();
    });

    it("marks the selected process tile as selected", () => {
      // Click on a process tile to select it
      fireEvent.click(screen.getByText("Clone"));
    });

    it("displays process details and logs when a tile is selected", () => {
      // Click on a process tile to select it
      fireEvent.click(screen.getByText("Build"));
    });

    it("closes process details and logs when another tile is selected", () => {
      // Click on a process tile to select it
      fireEvent.click(screen.getByText("Build"));

      // Click on another process tile to select it

      // Check if the previously displayed process details and logs are no longer present
    });

    it('displays the "Production" tile', () => {
      // Check if the "Production" tile is displayed
      const productionTile = screen.getByText("Prod");
      expect(productionTile).toBeInTheDocument();
    });

  });

  // Tests for ProcessDetails Component
  describe("ProcessDetails Component", () => {
    it("renders without crashing", () => {
      // Render the component
      render(<ProcessDetails title="Test Process" />);

      // Check if the component renders without errors
      const processDetailsElement = screen.getByText("Test Process:");
      expect(processDetailsElement).toBeInTheDocument();
    });

    it("displays the process title and status", () => {
      // Render the component with a specific title
      render(<ProcessDetails title="Test Process" />);

      // Check if the process title and status are displayed correctly
      const processTitleElement = screen.getByText("Test Process:");
      const processStatusElement = screen.getByText("In progress");
      expect(processTitleElement).toBeInTheDocument();
      expect(processStatusElement).toBeInTheDocument();
    });

  });

  // Tests for ProcessLogs Component
  describe("ProcessLogs Component", () => {
    beforeEach(() => {
      render(<ProcessLogs />);
    });

    it("renders without crashing", () => {
      // Check if the component renders without errors
      const processLogsElement = screen.getByText("Logs");
      expect(processLogsElement).toBeInTheDocument();
    });

  });
});

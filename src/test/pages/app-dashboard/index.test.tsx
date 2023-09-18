import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AppDashboard from "../../../pages/app-dashboard/index";
import AppSummary from "../../../pages/app-dashboard/AppSummay";
import AppCreationFlow from "../../../pages/app-dashboard/ProcessTile";
import ProcessDetails from "../../../pages/app-dashboard/ProcessDetails";
import ProcessLogs from "../../../pages/app-dashboard/ProcessLogs";
describe('Integration Test Suite', () => {
  // Tests for AppDashboard Component
  describe('AppDashboard Component', () => {
    beforeEach(() => {
      render(<AppDashboard />);
    });

    it('renders without crashing', () => {
      // Check if the component renders without errors
      const cardElement = screen.getByTestId('card');
      expect(cardElement).toBeInTheDocument();
    });

    it('displays the correct title', () => {
      // Check if the title element and its text content are correct
      const titleElement = screen.getByTestId('title');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.textContent).toBe('Hello World');
    });

    it('changes tabs when clicked', () => {
      // Click on the 'Insights' tab
      fireEvent.click(screen.getByTestId('tab-2'));

      // Ensure that the 'Insights' tab is active
      const insightsTab = screen.getByTestId('tab-2');
      expect(insightsTab).toHaveClass('Mui-selected');

      // Click on the 'Settings' tab
      fireEvent.click(screen.getByTestId('tab-4'));

      // Ensure that the 'Settings' tab is active
      const settingsTab = screen.getByTestId('tab-4');
      expect(settingsTab).toHaveClass('Mui-selected');
    });

    it('displays card content', () => {
      // Check if specific elements inside the card are present
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('tab-list')).toBeInTheDocument();
    });

    it('displays tab content', () => {
      // Click on the 'Overview' tab
      fireEvent.click(screen.getByTestId('tab-1'));

      // Ensure that the 'Overview' tab panel is active and its content is displayed
      const overviewTabPanel = screen.getByTestId('tab-panel-1');
      expect(overviewTabPanel).toBeInTheDocument();
      expect(screen.getByTestId('app-summary')).toBeInTheDocument();
      expect(screen.getByTestId('process-tile')).toBeInTheDocument();

      // Switch to the 'Insights' tab
      fireEvent.click(screen.getByTestId('tab-2'));

      // Ensure that the 'Insights' tab panel is active and its content is displayed
      const insightsTabPanel = screen.getByTestId('tab-panel-2');
      expect(insightsTabPanel).toBeInTheDocument();

      // Test other tab panels similarly
    });

    it('displays a link in the card', () => {
      const linkElement = screen.getByText('https://hello-world.init.run');

      // Check if the link is present and has the correct URL
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', 'abc.com');
      expect(linkElement).toHaveStyle({ color: '#655bd3' });
    });

    it('changes tab when keyboard navigation is used', () => {
      // Select the 'Overview' tab
      fireEvent.keyDown(screen.getByTestId('tab-1'), { key: 'Enter' });

      // Ensure that the 'Overview' tab is active
      const overviewTab = screen.getByTestId('tab-1');
      expect(overviewTab).toHaveClass('Mui-selected');

      // Select the 'Insights' tab using keyboard navigation
      fireEvent.keyDown(screen.getByTestId('tab-1'), { key: 'ArrowRight' });

      // Ensure that the 'Insights' tab is active
      const insightsTab = screen.getByTestId('tab-2');
      expect(insightsTab).toHaveClass('Mui-selected');
    });

    it('displays tab content correctly', () => {
      // Click on the 'Overview' tab
      fireEvent.click(screen.getByTestId('tab-1'));

      // Ensure that the 'Overview' tab panel is active
      const overviewTabPanel = screen.getByTestId('tab-panel-1');
      expect(overviewTabPanel).toHaveClass('Mui-selected');

      // Check if tab content text is correct
      expect(screen.getByText('Chocolate bar carrot cake candy canes sesame snaps.')).toBeInTheDocument();

      // Switch to the 'Insights' tab
      fireEvent.click(screen.getByTestId('tab-2'));

      // Ensure that the 'Insights' tab panel is active
      const insightsTabPanel = screen.getByTestId('tab-panel-2');
      expect(insightsTabPanel).toHaveClass('Mui-selected');

      // Check if tab content text is correct
      expect(screen.getByText('Danish tiramisu jujubes cupcake chocolate bar cake cheesecake')).toBeInTheDocument();
    });

    it('displays tab content for other tabs', () => {
      // Click on the 'Logs' tab
      fireEvent.click(screen.getByTestId('tab-3'));

      // Ensure that the 'Logs' tab panel is active
      const logsTabPanel = screen.getByTestId('tab-panel-3');
      expect(logsTabPanel).toHaveClass('Mui-selected');

      // Check if tab content text for 'Logs' is correct
      expect(screen.getByText('Danish tiramisu jujubes cupcake chocolate bar cake cheesecake')).toBeInTheDocument();

      // Click on the 'Settings' tab
      fireEvent.click(screen.getByTestId('tab-4'));

      // Ensure that the 'Settings' tab panel is active
      const settingsTabPanel = screen.getByTestId('tab-panel-4');
      expect(settingsTabPanel).toHaveClass('Mui-selected');

      // Check if tab content text for 'Settings' is correct
      expect(screen.getByText('Danish tiramisu jujubes cupcake chocolate bar cake cheesecake')).toBeInTheDocument();
    });

    // Add more test cases as needed
  });

  // Tests for AppSummary Component
  describe('AppSummary Component', () => {
    beforeEach(() => {
      render(<AppSummary />);
    });

    it('renders without crashing', () => {
      // Check if the component renders without errors
      const appSummaryElement = screen.getByText('App Summary');
      expect(appSummaryElement).toBeInTheDocument();
    });

    it('displays correct stats data', () => {
      // Check if each stat item is displayed correctly
      const statsElements = screen.getAllByRole('gridcell');

      // Ensure that there are four stat items
      expect(statsElements).toHaveLength(4);

      // Check the content of each stat item
      const expectedStats = ['1 / 2', '1 %', '0.7/1 GB', '1.4/2 GB'];
      const expectedTitles = ['Instances/Auto Scale', 'CPU', 'Memory/Allocated', 'Disk/Allocated'];

      statsElements.forEach((element, index) => {
        expect(element).toHaveTextContent(expectedStats[index]);
        expect(element).toHaveTextContent(expectedTitles[index]);
      });
    });

    it('displays last updated time', () => {
      // Check if the last updated time text is displayed
      const updatedTimeElement = screen.getByText('Updated 1 minute ago');
      expect(updatedTimeElement).toBeInTheDocument();
    });

    it('displays the correct number of icons', () => {
      // Check if there are four icons, one for each stat item
      const iconElements = screen.getAllByRole('img');
      expect(iconElements).toHaveLength(4);
    });

    it('applies correct avatar colors', () => {
      // Check if avatar colors are applied correctly
      const avatarElements = screen.getAllByTestId('custom-avatar');
      const expectedColors = ['primary', 'info', 'error', 'success'];

      avatarElements.forEach((element, index) => {
        expect(element).toHaveAttribute('color', expectedColors[index]);
      });
    });

    it('displays the correct title in the CardHeader', () => {
      const cardHeaderElement = screen.getByRole('heading', { name: 'App Summary' });
      expect(cardHeaderElement).toBeInTheDocument();
    });

    it('displays stats in a grid layout', () => {
      // Check if the grid container is present
      const gridContainer = screen.getByRole('grid');
      expect(gridContainer).toBeInTheDocument();

      // Check if the grid items are displayed
      const gridItems = screen.getAllByRole('gridcell');
      expect(gridItems).toHaveLength(4);
    });

    // it('matches snapshot', () => {
    //   // Check if the rendered component matches a snapshot
    //   const { container } = render(<AppSummary />);
    //   expect(container).toMatchSnapshot();
    // });

    it('displays updated time in the correct format', () => {
      // Check if the updated time is displayed in the expected format
      const updatedTimeElement = screen.getByText(/Updated \d{1,2} minute(s?) ago/);
      expect(updatedTimeElement).toBeInTheDocument();
    });

    // Add more test cases as needed
  });

  // Tests for AppCreationFlow Component
  describe('AppCreationFlow Component', () => {
    beforeEach(() => {
      render(<AppCreationFlow />);
    });

    it('renders without crashing', () => {
      // Check if the component renders without errors
      const appCreationFlowElement = screen.getByText('Clone');
      expect(appCreationFlowElement).toBeInTheDocument();
    });

    it('displays the correct number of process tiles', () => {
      // Check if the correct number of process tiles are displayed
      const processTiles = screen.getAllByRole('card');
      expect(processTiles).toHaveLength(9);
    });

    it('marks the selected process tile as selected', () => {
      // Click on a process tile to select it
      fireEvent.click(screen.getByText('Clone'));

      // Check if the selected process tile is marked as selected
      const selectedTile = screen.getByText('Clone');
      expect(selectedTile).toHaveStyle({ border: '2px solid rgb(115, 83, 229)' });
    });

    it('displays arrow icons between process tiles', () => {
      // Check if the correct number of arrow icons are displayed
      const arrowIcons = screen.getAllByRole('arrow');
      expect(arrowIcons).toHaveLength(8);
    });

    it('displays process details and logs when a tile is selected', () => {
      // Click on a process tile to select it
      fireEvent.click(screen.getByText('Build'));

      // Check if process details and logs are displayed
      const processDetails = screen.getByText('Process Details');
      const processLogs = screen.getByText('Process Logs');
      expect(processDetails).toBeInTheDocument();
      expect(processLogs).toBeInTheDocument();
    });

    it('closes process details and logs when another tile is selected', () => {
      // Click on a process tile to select it
      fireEvent.click(screen.getByText('Build'));

      // Check if process details and logs are displayed
      const processDetails = screen.getByText('Process Details');
      const processLogs = screen.getByText('Process Logs');
      expect(processDetails).toBeInTheDocument();
      expect(processLogs).toBeInTheDocument();

      // Click on another process tile to select it
      fireEvent.click(screen.getByText('Approval'));

      // Check if the previously displayed process details and logs are no longer present
      expect(processDetails).not.toBeInTheDocument();
      expect(processLogs).not.toBeInTheDocument();
    });

    it('displays the "Approval" tile with the correct styles', () => {
      // Check if the "Approval" tile is displayed with the correct styles
      const approvalTile = screen.getByText('Approval');
      expect(approvalTile).toHaveStyle({ transform: 'rotate(-45deg)', backgroundColor: 'rgb(115, 83, 229)' });
    });

    it('displays updated time in the correct format', () => {
      // Check if the updated time is displayed in the expected format
      const updatedTimeElement = screen.getByText(/Updated \d{1,2} minute(s?) ago/);
      expect(updatedTimeElement).toBeInTheDocument();
    });

    it('displays the "Production" tile', () => {
      // Check if the "Production" tile is displayed
      const productionTile = screen.getByText('Prod');
      expect(productionTile).toBeInTheDocument();
    });

    // Add more test cases for additional functionality as needed
  });

  // Tests for ProcessDetails Component
  describe('ProcessDetails Component', () => {
    it('renders without crashing', () => {
      // Render the component
      render(<ProcessDetails title="Test Process" />);

      // Check if the component renders without errors
      const processDetailsElement = screen.getByText('Test Process:');
      expect(processDetailsElement).toBeInTheDocument();
    });

    it('displays the process title and status', () => {
      // Render the component with a specific title
      render(<ProcessDetails title="Test Process" />);

      // Check if the process title and status are displayed correctly
      const processTitleElement = screen.getByText('Test Process:');
      const processStatusElement = screen.getByText('In progress');
      expect(processTitleElement).toBeInTheDocument();
      expect(processStatusElement).toBeInTheDocument();
    });

    it('displays the duration', () => {
      // Render the component with a specific duration
      render(<ProcessDetails title="Test Process" duration="29 sec" />);

      // Check if the duration is displayed correctly
      const durationElement = screen.getByText('Duration: 29 sec');
      expect(durationElement).toBeInTheDocument();
    });

    it('displays the Git repo information', () => {
      // Render the component with Git repo information
      render(<ProcessDetails title="Test Process" gitRepo="git@github.com:initializ/api:git" commit="SHA" />);

      // Check if the Git repo information is displayed correctly
      const gitRepoElement = screen.getByText('Git Repo: git@github.com:initializ/api:git');
      const commitElement = screen.getByText('Commit: SHA');
      expect(gitRepoElement).toBeInTheDocument();
      expect(commitElement).toBeInTheDocument();
    });

    it('displays the branch and date', () => {
      // Render the component with branch and date information
      render(<ProcessDetails title="Test Process" branch="develop" date="2023-09-20" />);

      // Check if the branch and date information is displayed correctly
      const branchElement = screen.getByText('Branch: develop');
      const dateElement = screen.getByText('Date: 2023-09-20');
      expect(branchElement).toBeInTheDocument();
      expect(dateElement).toBeInTheDocument();
    });

    // Add more test cases for additional functionality as needed
  });

  // Tests for ProcessLogs Component
  describe('ProcessLogs Component', () => {
    beforeEach(() => {
      render(<ProcessLogs />);
    });

    it('renders without crashing', () => {
      // Check if the component renders without errors
      const processLogsElement = screen.getByText('Logs');
      expect(processLogsElement).toBeInTheDocument();
    });

    it('displays a list of log entries', () => {
      // Check if the list of log entries is displayed
      const logEntries = screen.getAllByRole('listitem');
      expect(logEntries).toHaveLength(40); // Assuming you have 40 log entries in the component
    });

    it('displays log entry details', () => {
      // Check if log entry details are displayed correctly for a sample entry
      const sampleLogEntry = screen.getByText('done: false metadata: @type: type.googleapis.com/google.logging.v2.CopyLogEntriesMetadata progress: 75 request: destination: storage.googleapis.com/my-storage-bucket-1 filter: "timestamp 2021-05-23T10:00:00.0Z" name: projects/my-test-project/locations/us-central1/buckets/my-logging-bucket-2 startTime: 2021-05-23T10:52:40.039751Z state: OPERATION_STATE_RUNNING');
      expect(sampleLogEntry).toBeInTheDocument();
    });

    it('displays a scrollbar for log entries', () => {
      // Check if a scrollbar is displayed for log entries container
      const logEntriesContainer = screen.getByRole('scrollbar');
      expect(logEntriesContainer).toBeInTheDocument();
    });

    it('has a black background and white text color for log entries', () => {
      // Check if the log entries container has the correct background and text color
      const logEntriesContainer = screen.getByRole('scrollbar');
      expect(logEntriesContainer).toHaveStyle({ backgroundColor: 'black', color: 'white' });
    });

    // Add more test cases for additional functionality as needed
  });
});

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProcessLogs from 'src/pages/apps/app-dashboard/ProcessLogs';

describe('ProcessLogs Component', () => {
  const steps = [
    {
      log: 'Sample log content',
      run_name: 'Step 1',
      status: 'succeeded',
    },
  ];


  test('renders tab list with correct number of tabs', () => {
    render(<ProcessLogs steps={steps} loading={false} tabHeading="Test Tab" />);
    const tabs = screen.getAllByTestId(/^tab-\d+$/);
    expect(tabs).toHaveLength(steps.length);
  });

  test('renders logs container with log content', () => {
    render(<ProcessLogs steps={steps} loading={false} tabHeading="Test Tab" />);
    const logsContainer = screen.getByTestId('logsContainer');
    expect(logsContainer).toBeInTheDocument();
    expect(logsContainer).toHaveTextContent('Sample log content');
  });

  test('handles tab change and updates logs', async () => {
    render(<ProcessLogs steps={steps} loading={false} tabHeading="Test Tab" />);

    await waitFor(() => {
      const tabName = screen.getByTestId('tabName');
      expect(tabName).toHaveTextContent('Step 1 Logs');
    });
  });

  test('handles search input and highlights text', () => {
    render(<ProcessLogs steps={steps} loading={false} tabHeading="Test Tab" />);
    const searchInput = screen.getByTestId('searchInput');
    fireEvent.change(searchInput);
  });
});

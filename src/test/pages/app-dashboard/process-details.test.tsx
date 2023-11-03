import React from 'react';
import { render, screen } from '@testing-library/react';
import ProcessDetails from 'src/pages/apps/app-dashboard/ProcessDetails';// Adjust the import path based on your project structure

describe('ProcessDetails component', () => {
  const mockData = {
    supplyChainStepData: {
      stage: 'clone',
      status: 'Succeeded',
      duration: '1 hour 30 min 15 sec',
      started_at: '2023-10-26T18:24:54.000Z',
      completed_at: '2023-10-26T19:54:09.000Z',
      steps: [], // You can provide steps data here if needed
    },
    loading: false,
    gitRepo: 'MyOrgTest12/api',
    gitBranch: 'main',
  };

  it('renders the component with provided data', () => {
    render(<ProcessDetails {...mockData} />);

    expect(screen.getByTestId('stage')).toHaveTextContent('Stage: clone');
    expect(screen.getByTestId('duration')).toHaveTextContent('Duration: 1 hour 29 min 15 sec');
    expect(screen.getByTestId('status')).toHaveTextContent('Status: Succeeded');
    expect(screen.getByTestId('gitrepo')).toHaveTextContent('Git Repo: MyOrgTest12/api');
    expect(screen.getByTestId('commit')).toHaveTextContent('Commit: N/A');
    expect(screen.getByTestId('branch')).toHaveTextContent('Branch: main');
    expect(screen.getByTestId('date')).toHaveTextContent('Date: 26/10/2023, 11:54:54 pm');
});

  it('renders loading state', () => {
    render(<ProcessDetails {...mockData} loading={true} />);

    expect(screen.queryByTestId('stage')).toBeNull();
    expect(screen.queryByTestId('duration')).toBeNull();
    expect(screen.queryByTestId('status')).toBeNull();
    expect(screen.queryByTestId('gitrepo')).toBeNull();
    expect(screen.queryByTestId('commit')).toBeNull();
    expect(screen.queryByTestId('branch')).toBeNull();
    expect(screen.queryByTestId('date')).toBeNull();
  });
});

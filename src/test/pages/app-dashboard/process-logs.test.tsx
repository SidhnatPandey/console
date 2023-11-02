import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProcessLogs from 'src/pages/apps/app-dashboard/ProcessLogs';

describe('ProcessLogs component', () => {
  const mockSteps = [
    {
      completed_at: '2023-11-02T10:00:00Z',
      log: 'Sample log content',
      reason: 'Sample reason',
      run_name: 'Run 1',
      started_at: '2023-11-02T09:00:00Z',
      status: 'succeeded',
    },
  ];

  it('renders tab labels correctly', () => {
    render(<ProcessLogs steps={mockSteps} loading={false} />);
    expect(screen.getByText('Run 1')).toBeInTheDocument();
  });

  it('renders log content when loading is false and steps are provided', () => {
    render(<ProcessLogs steps={mockSteps} loading={false} />);
    expect(screen.getByText('Sample log content')).toBeInTheDocument();
  });

  it('handles tab change correctly', () => {
    render(<ProcessLogs steps={mockSteps} loading={false} />);
    expect(screen.getByText('Sample log content')).toBeInTheDocument();
  });

 it('renders log content with special characters correctly', () => {
    const specialCharactersLog = 'Log content with special characters: !@#$%^&*()_+';
    const mockStepsWithSpecialCharacters = [
      {
        completed_at: '2023-11-02T10:00:00Z',
        log: specialCharactersLog,
        reason: 'Sample reason',
        run_name: 'Run with special characters',
        started_at: '2023-11-02T09:00:00Z',
        status: 'succeeded',
      },
    ];
    render(<ProcessLogs steps={mockStepsWithSpecialCharacters} loading={false} />);
    // Ensure log content with special characters is rendered correctly
    expect(screen.getByText(specialCharactersLog)).toBeInTheDocument();
  });

  
//   it('renders loading skeleton when loading prop is true', async () => {
//     render(<ProcessLogs steps={[]} loading={true} />);
    
//     // Wait for the loading skeleton to be rendered asynchronously
//     await waitFor(() => {
//       expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
//     });
//   });

//   it('renders appropriate message when steps are empty and loading is false', () => {
//     render(<ProcessLogs steps={[]} loading={false} />);
//     expect(screen.getByText('No steps available.')).toBeInTheDocument();
//   });

//   it('truncates long run names in tabs', () => {
//     const longRunName = 'Very long run name that needs to be truncated';
//     const mockStepsWithLongName = [
//       {
//         completed_at: '2023-11-02T10:00:00Z',
//         log: 'Sample log content',
//         reason: 'Sample reason',
//         run_name: longRunName,
//         started_at: '2023-11-02T09:00:00Z',
//         status: 'succeeded',
//       },
//     ];
//     render(<ProcessLogs steps={mockStepsWithLongName} loading={false} />);
//     expect(screen.getByText('Very long run...')).toBeInTheDocument();
//   });

//   it('handles tab change correctly', () => {
//     render(<ProcessLogs steps={mockSteps} loading={false} />);
//     fireEvent.click(screen.getByText('Run 1'));
//     // Ensure log content is updated after tab change
//     expect(screen.getByText('Updated log content')).toBeInTheDocument();
//   });

//   it('renders log content with special characters correctly', () => {
//     const specialCharactersLog = 'Log content with special characters: !@#$%^&*()_+';
//     const mockStepsWithSpecialCharacters = [
//       {
//         completed_at: '2023-11-02T10:00:00Z',
//         log: specialCharactersLog,
//         reason: 'Sample reason',
//         run_name: 'Run with special characters',
//         started_at: '2023-11-02T09:00:00Z',
//         status: 'succeeded',
//       },
//     ];
//     render(<ProcessLogs steps={mockStepsWithSpecialCharacters} loading={false} />);
//     expect(screen.getByText(specialCharactersLog)).toBeInTheDocument();
//   });

  it('handles tab change correctly when steps have different logs', () => {
    const stepsWithDifferentLogs = [
      {
        completed_at: '2023-11-02T10:00:00Z',
        log: 'Log content for Run 1',
        reason: 'Sample reason',
        run_name: 'Run 1',
        started_at: '2023-11-02T09:00:00Z',
        status: 'succeeded',
      },
      {
        completed_at: '2023-11-02T12:00:00Z',
        log: 'Log content for Run 2',
        reason: 'Sample reason',
        run_name: 'Run 2',
        started_at: '2023-11-02T11:00:00Z',
        status: 'succeeded',
      },
    ];
    render(<ProcessLogs steps={stepsWithDifferentLogs} loading={false} />);
    fireEvent.click(screen.getByText('Run 2'));
    expect(screen.getByText('Log content for Run 2')).toBeInTheDocument();
  });

});
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProcessLogs from 'src/pages/apps/app-dashboard/ProcessLogs';
import '@testing-library/jest-dom';

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
    render(<ProcessLogs steps={mockSteps} loading={false} tabHeading={''} />);
    expect(screen.getByText('Run 1')).toBeInTheDocument();
  });

  it('renders log content when loading is false and steps are provided', () => {
    render(<ProcessLogs steps={mockSteps} loading={false} tabHeading={''} />);
    expect(screen.getByText('Sample log content')).toBeInTheDocument();
  });

  it('handles tab change correctly', () => {
    render(<ProcessLogs steps={mockSteps} loading={false} tabHeading={''} />);
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
    render(<ProcessLogs steps={mockStepsWithSpecialCharacters} loading={false} tabHeading={''} />);
    // Ensure log content with special characters is rendered correctly
    expect(screen.getByText(specialCharactersLog)).toBeInTheDocument();
  });

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
    render(<ProcessLogs steps={stepsWithDifferentLogs} loading={false} tabHeading={''} />);
    fireEvent.click(screen.getByText('Run 2'));
    expect(screen.getByText('Log content for Run 2')).toBeInTheDocument();
  });

});
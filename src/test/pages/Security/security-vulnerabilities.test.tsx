import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecurityVulnerabilities from 'src/pages/security/SecurityVulnerabilities';
import { SecurityContext } from "src/context/SecurityContext"; 

jest.mock('src/services/securityService', () => ({
    getAllvulnerabilities: jest.fn().mockResolvedValue({
      data: [
        { name: 'Critical', value: 5, color: 'red' }
      ]
    }),
  }));

describe('SecurityVulnerabilities Component', () => {
  const mockContextValue = {
    setRunType: jest.fn(),
    workspace: 'mock-workspace',
    runType: 'mock-runType',
    setWorkspace: jest.fn(),
    appId: 'mock-app',
    setAppId: jest.fn(),
  };

// Simplified functional MockResizeObserver
const MockResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

beforeEach(() => {
  // Override the global ResizeObserver only in a test environment
  if (process.env.NODE_ENV === 'test') {
    window.ResizeObserver = MockResizeObserver;
  }
});

  it('should render without crashing', () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <SecurityVulnerabilities appId="testAppId" />
      </SecurityContext.Provider>
    );
    expect(screen.getByTestId('vulnerability-card')).toBeInTheDocument();
  });

  it('contains all main elements', () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <SecurityVulnerabilities appId="testAppId" />
      </SecurityContext.Provider>
    );
    expect(screen.getByTestId('vulnerability-card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('box')).toBeInTheDocument();
    expect(screen.getByTestId('low-severity')).toBeInTheDocument();
    expect(screen.getByTestId('medium-severity')).toBeInTheDocument();
    expect(screen.getByTestId('high-severity')).toBeInTheDocument();
    expect(screen.getByTestId('critical-severity')).toBeInTheDocument();
    expect(screen.getByTestId('unknown-severity')).toBeInTheDocument();
  });
});

class MockResizeObserver {
    observations: any;
    callback: any;
    constructor(callback: any) {
        this.callback = callback;
        this.observations = [];
    }

    observe(target: any, options: any) {
        this.observations.push({ target, options });
    }

    unobserve(target: any) {
        this.observations = this.observations.filter((obs: { target: any; }) => obs.target !== target);
    }

    disconnect() {
        this.observations = [];
    }
}

window.ResizeObserver = MockResizeObserver;


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

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecurityDashboard from 'src/pages/security/SecurityDashboard';
import { SecurityContext } from "src/context/SecurityContext";

// Mocking the necessary components
jest.mock("src/component/switcherButton", () => (props:any) => (
  <button onClick={() => props.handleBtnClick("mock-value")}>
    Mock SwitcherButton
  </button>
));
jest.mock("src/component/workspaceDropdown", () => () => <div>Mock WorkspaceDropdown</div>);

describe('SecurityDashboard', () => {
  const mockContextValue = {
    setRunType: jest.fn(),
    workspace: 'mock-workspace',
    runType: 'mock-runType',
    setWorkspace: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByText } = render(
      <SecurityContext.Provider value={mockContextValue}>
        <SecurityDashboard title={'Security Dashboard'} />
      </SecurityContext.Provider>
    );

    expect(getByText('Security Dashboard')).toBeInTheDocument();
    expect(getByText('Mock WorkspaceDropdown')).toBeInTheDocument();
  });

  it('interacts with SecurityContext correctly', () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <SecurityDashboard title={'Security Dashboard'} />
      </SecurityContext.Provider>
    );

    fireEvent.click(screen.getByText('Mock SwitcherButton'));
    expect(mockContextValue.setRunType).toHaveBeenCalledWith('mock-value');
  });
});

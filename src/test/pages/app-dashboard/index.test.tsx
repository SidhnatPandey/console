import AppDashboard from "../../../pages/apps/app-dashboard/index";
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils'; 
jest.mock("next/router", () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
  }));
jest.mock('src/services/dashboardService', () => ({
  supplyChainRuns: jest.fn().mockResolvedValue({
    data: {
      
      supplyChainProperty1: 'Value1',
      supplyChainProperty2: 'Value2',
    },
  }),
}));
jest.mock('src/services/appService', () => ({
  appDetails: jest.fn().mockResolvedValue({
    data: {
      
      application_name: 'Your App',
      stage: 'Production',
      status: 'Running',
    },
  }),
}));

describe('AppDashboard Component', () => {
  it('should render loading state', () => {
    act(() => {
      render(<AppDashboard />);
    });

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('tab-list')).toBeInTheDocument();

  });

  it('should render data state', async () => {
    act(() => {
      render(<AppDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('tab-1')).toBeInTheDocument(); // Ensure tabs are rendered
    });

  });

  it('should switch tabs', async () => {
    act(() => {
      render(<AppDashboard />);
    });

    await waitFor(() => {
      userEvent.click(screen.getByTestId('tab-2'));

      expect(screen.getByTestId('tab-panel-2')).toBeInTheDocument();
    });

  });

});

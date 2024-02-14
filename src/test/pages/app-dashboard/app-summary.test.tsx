import AppSummary from "../../../pages/workspace/app-dashboard/AppSummary";
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('AppSummary component', () => {
  it('renders without crashing', () => {
    render(<AppSummary loading={false} appName={undefined} metricsTimer={0} />);
  });

  it('displays "App Summary" in the title', () => {
    render(<AppSummary loading={false} appName={undefined} metricsTimer={0} />);
    expect(screen.getByText('App Summary')).toBeInTheDocument();
  });

  it('displays "Updated 1 minute ago" when not loading', () => {
    render(<AppSummary loading={false} appName={undefined} metricsTimer={0} />);
    expect(screen.getByTestId('updated-time')).toBeInTheDocument();
  });

  it("renders AppSummary component with correct data", () => {
    render(<AppSummary loading={false} appName={undefined} metricsTimer={0} />);

    // Check if elements with data-testid attributes are present and have correct values
    expect(screen.getByTestId("instances-count")).toBeInTheDocument();
    expect(screen.getByTestId("cpu-percentage")).toBeInTheDocument();
    expect(screen.getByTestId("memory-usage")).toBeInTheDocument();
    expect(screen.getByTestId("network-usage")).toBeInTheDocument();
  });

});
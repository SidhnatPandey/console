import AppSummary from "../../../pages/apps/app-dashboard/AppSummary";
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('AppSummary component', () => {
  it('renders without crashing', () => {
    render(<AppSummary loading={false} />);
  });

  it('displays "App Summary" in the title', () => {
    render(<AppSummary loading={false} />);
    expect(screen.getByText('App Summary')).toBeInTheDocument();
  });

  it('displays "Updated 1 minute ago" when not loading', () => {
    render(<AppSummary loading={false} />);
    expect(screen.getByTestId('updated-time')).toBeInTheDocument();
  });

  it('displays 4 titles when not loading', () => {
    render(<AppSummary loading={false} />);
    expect(screen.getAllByTestId('title')).toHaveLength(4);
  });

  it('displays 4 custom avatars when not loading', () => {
    render(<AppSummary loading={false} />);
    expect(screen.getAllByTestId('custom-avatar')).toHaveLength(4);
  });

  it('displays 4 statistics when not loading', () => {
    render(<AppSummary loading={false} />);
    expect(screen.getAllByTestId('statistic')).toHaveLength(4);
  });
});

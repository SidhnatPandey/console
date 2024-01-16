import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import AppLogs from "src/pages/workspace/app-dashboard/AppLogs";
import "@testing-library/jest-dom";

jest.mock("src/services/dashboardService", () => ({
  getAppLogs: jest.fn(() =>
    Promise.resolve({ data: { log: "Mocked Log Data" } })
  ),
}));

describe('<AppLogs />', () => {
  it('renders the component', () => {
    render(<AppLogs appId="123" />);
    expect(screen.getByTestId('app-logs-card')).toBeInTheDocument();
  });
});

it('searchbox showing correctly', async () => {
  render(<AppLogs appId="123" />);
  expect(screen.getByTestId('environments-title')).toBeInTheDocument();
});

it('changes tabs correctly', () => {
  render(<AppLogs appId="123" />);
  const prodTab = screen.getByText('Prod');
  fireEvent.click(prodTab);
  expect(screen.getByTestId('logs-title')).toHaveTextContent('Prod Logs');
});

it('changes tabs correctly', () => {
  render(<AppLogs appId="123" />);
  const prodTab = screen.getByText('Stg');
  fireEvent.click(prodTab);
  expect(screen.getByTestId('logs-title')).toHaveTextContent('Stg Logs');
});

it('changes tabs correctly', () => {
  render(<AppLogs appId="123" />);
  const prodTab = screen.getByText('Test');
  fireEvent.click(prodTab);
  expect(screen.getByTestId('logs-title')).toHaveTextContent('Test Logs');
});

it('searchbox showing correctly', async () => {
  render(<AppLogs appId="123" />);
  expect(screen.getByTestId('search-field')).toBeInTheDocument();
});

it('searchbox showing correctly', async () => {
  render(<AppLogs appId="123" />);
  expect(screen.getByTestId('tab-list-box')).toBeInTheDocument();
});

it('scrolls to bottom on new logs', async () => {
  render(<AppLogs appId="123" />);
  const logsContainer = screen.getByTestId('logs-container');

  expect(logsContainer.scrollTop).toBe(logsContainer.scrollHeight - logsContainer.clientHeight);
});

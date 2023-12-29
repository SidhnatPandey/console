import React from "react";
import { render, fireEvent, waitFor, screen, findAllByText } from "@testing-library/react";
import AppLogs from "src/pages/apps/app-dashboard/AppLogs";
import "@testing-library/jest-dom";

jest.mock("src/services/dashboardService", () => ({
  getAppLogs: jest.fn(() =>
    Promise.resolve({ data: { log: "Mocked Log Data" } })
  ),
}));

describe('<AppLogs />', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<AppLogs appId="123" />);
    expect(getByTestId('app-logs-card')).toBeInTheDocument();
  });
});

it(' searchbox showing correctly', async () => {
  const { getByTestId } = render(<AppLogs appId="123" />);
  expect(getByTestId('environments-title')).toBeInTheDocument();
});

it('changes tabs correctly', () => {
  const { getByText, getByTestId } = render(<AppLogs appId="123" />);
  const prodTab = getByText('Prod');
  fireEvent.click(prodTab);
  expect(getByTestId('logs-title')).toHaveTextContent('Prod Logs');
});

it('changes tabs correctly', () => {
  const { getByText, getByTestId } = render(<AppLogs appId="123" />);
  const prodTab = getByText('Stg');
  fireEvent.click(prodTab);
  expect(getByTestId('logs-title')).toHaveTextContent('Stg Logs');
});

it('changes tabs correctly', () => {
  const { getByText, getByTestId } = render(<AppLogs appId="123" />);
  const prodTab = getByText('Test');
  fireEvent.click(prodTab);
  expect(getByTestId('logs-title')).toHaveTextContent('Test Logs');
});

it(' searchbox showing correctly', async () => {
  const { getByTestId } = render(<AppLogs appId="123" />);
  expect(getByTestId('search-field')).toBeInTheDocument();
});

it(' searchbox showing correctly', async () => {
  const { getByTestId } = render(<AppLogs appId="123" />);
  expect(getByTestId('tab-list-box')).toBeInTheDocument();
});

it('scrolls to bottom on new logs', async () => {
  const { getByTestId } = render(<AppLogs appId="123" />);
  const logsContainer = getByTestId('logs-container');

  expect(logsContainer.scrollTop).toBe(logsContainer.scrollHeight - logsContainer.clientHeight);
});

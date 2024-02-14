// test('pagination works as expected', async () => {
//     const { findByLabelText, findByText } = render(<Apps selectedRow={null} setSelectedRow={jest.fn()} />);

//     // Use findBy instead of getBy for asynchronous queries
//     const rowsPerPageDropdown = await findByLabelText('Rows per page:');
//     fireEvent.change(rowsPerPageDropdown, { target: { value: '10' } });

//     // Use findBy instead of getBy for asynchronous queries
//     const nextPageButton = await findByText('Next');
//     fireEvent.click(nextPageButton);

//     // Add your assertions here, for example, check if the next page is displayed
//   });


import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import Apps from 'src/pages/workspace/apps';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';



jest.mock('src/services/appService', () => ({
  appList: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 1,
          name: 'MyTestApp', // Replace with your actual data
          currentEnv: 'Development',
          lastDeployed: '2023-10-30',
          liveAppUrl: 'http://example.com',
          status: 'Running',
        },
      ],
    })
  ),
}));

it('renders Apps component without error', () => {
  render(<Apps selectedRow={null} setSelectedRow={jest.fn()} workspace_id={undefined} />);
});

test('sorts table when column header is clicked', async () => {
  render(<Apps selectedRow={null} setSelectedRow={jest.fn()} workspace_id={undefined} />);
  const columnHeader = screen.getByText('NAME');
  fireEvent.click(columnHeader);
});

test('pagination works as expected', async () => {
  render(<Apps selectedRow={null} setSelectedRow={jest.fn()} workspace_id={undefined} />);
  expect(screen.getByLabelText('Rows per page:')).toBeInTheDocument();
  expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
});

test('sorts table when column header is clicked', async () => {
  render(<Apps selectedRow={null} setSelectedRow={jest.fn()} workspace_id={undefined} />);
  const columnHeader = screen.getByText('NAME');
  fireEvent.click(columnHeader);
});

test('pagination navigation works', async () => {
  render(<Apps selectedRow={null} setSelectedRow={jest.fn()} workspace_id={undefined} />);
  const nextPageButton = screen.getByLabelText('Go to next page');
  fireEvent.click(nextPageButton);
  const prevPageButton = screen.getByLabelText('Go to previous page');
  fireEvent.click(prevPageButton);
});

jest.mock('src/services/appService', () => ({
  appList: jest.fn(() => Promise.reject(new Error('API Error'))),
}));
test('handles API error', async () => {
  render(<Apps selectedRow={null} setSelectedRow={jest.fn()} workspace_id={undefined} />);
});
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
import Apps from 'src/pages/apps';

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

it('renders Apps component without error', async () => {
  render(<Apps selectedRow={null} setSelectedRow={jest.fn()} />);
  await waitFor(() => {
  });
});

test('sorts table when column header is clicked', async () => {
  const { getByText } = render(<Apps selectedRow={null} setSelectedRow={jest.fn()} />);

  await waitFor(() => {
    const columnHeader = getByText('NAME');
    fireEvent.click(columnHeader);
  });
});

test('pagination works as expected', async () => {
  const { findByLabelText, findByText } = render(<Apps selectedRow={null} setSelectedRow={jest.fn()} />);
  await waitFor(() => {
    const rowsPerPageDropdown = findByLabelText('Rows per page:');
    const nextPageButton = findByText('Next');

  });
});


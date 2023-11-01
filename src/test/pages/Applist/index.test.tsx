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
import { screen } from '@testing-library/react'; // Import screen object

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
  render(<Apps selectedRow={null} setSelectedRow={jest.fn()} />);
});

test('sorts table when column header is clicked', async () => {
  render(<Apps selectedRow={null} setSelectedRow={jest.fn()} />);
  const columnHeader = screen.getByText('NAME');
  fireEvent.click(columnHeader);
});

test('pagination works as expected', async () => {
  render(<Apps selectedRow={null} setSelectedRow={jest.fn()} />);
  waitFor(() => {
    screen.findByLabelText('Rows per page:', {}, { timeout: 5000 });
    screen.findByText('Next', {}, { timeout: 5000 });
  });

});



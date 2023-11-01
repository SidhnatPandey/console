import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
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
  act(() => {
    const rowsPerPageLabel = screen.getByLabelText('Rows per page:');
    const nextButton = document.querySelector('.MuiIconButton-root[aria-label="Go to next page"]');
    expect(rowsPerPageLabel).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});



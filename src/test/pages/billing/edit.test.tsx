import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import EditCard from 'src/pages/billing/editCard';

describe('EditCard Component', () => {
    const mockItem = {
        id: 'some-id',
        created: Date.now(), // or any valid timestamp as a number
        card: {
          brand: 'visa',
          last4: '1234',
          exp_month: 12,
          exp_year: 2023,
          country: 'US',
        },
        billing_details: {
          name: 'John Doe',
          email: 'john.doe@example.com', // Add email property
          phone: '123-456-7890', // Add phone property
          address: {
            line1: '123 Main St',
            line2: '',
            city: 'City',
            state: 'State',
            country: 'Country',
            postal_code: '12345',
          },
        },
        Default: false,
      };
      
      // Rest of your test code...
      

  const mockHandleClose = jest.fn();

//   test('renders EditCard component', () => {
//     render(<EditCard open={true} handleClose={mockHandleClose} item={mockItem} />);

//     // Add assertions based on your component structure
//     expect(screen.getByText(/edit card/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/expiry month/i)).toBeInTheDocument();
//     // Add more assertions as needed
//   });

//   test('handles form submission', async () => {
//     render(<EditCard open={true} handleClose={mockHandleClose} item={mockItem} />);

//     // Simulate form input changes
//     userEvent.selectOptions(screen.getByLabelText(/expiry month/i), '1');
//     userEvent.selectOptions(screen.getByLabelText(/expiry year/i), '2023');
//     userEvent.type(screen.getByLabelText(/cardholder name/i), 'John Doe');
//     // Simulate other form input changes

//     // Trigger form submission
//     fireEvent.click(screen.getByRole('button', { name: /submit/i }));

//     // Wait for async operations to complete (e.g., API call in useEffect)
//     await waitFor(() => {
//       // Add assertions based on the expected behavior after submission
//       expect(mockHandleClose).toHaveBeenCalledTimes(1);
//     });
//   });

//   test('handles form submission with loading', async () => {
//     render(<EditCard open={true} handleClose={mockHandleClose} item={mockItem} />);

//     // Trigger form submission
//     fireEvent.click(screen.getByRole('button', { name: /submit/i }));

//     // Wait for async operations to complete (e.g., API call in useEffect)
//     await waitFor(() => {
//       // Add assertions based on the expected behavior during loading
//       expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
//       // Add more assertions as needed
//     });
//   });

  test('handles form submission error', async () => {
    // Mock the updateCard function to simulate an error
    jest.mock('path-to-your/billingService', () => ({
      updateCard: jest.fn(() => Promise.reject(new Error('Update error'))),
    }));

    render(<EditCard open={true} handleClose={mockHandleClose} item={mockItem} />);

    // Trigger form submission
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for async operations to complete (e.g., API call in useEffect)
    await waitFor(() => {
      // Add assertions based on the expected behavior after an error
      expect(screen.getByText(/some error occurred/i)).toBeInTheDocument();
      // Add more assertions as needed
    });
  });
});

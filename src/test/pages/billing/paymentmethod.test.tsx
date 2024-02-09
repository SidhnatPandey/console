import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import PaymentMethod from 'src/pages/billing/paymentMethod'; // Update the path accordingly

describe('PaymentMethod Component', () => {
  const mockCards = [
    {
      id: '1',
      card: {
        brand: 'visa',
        last4: '1234',
        exp_month: 12,
        exp_year: 2023,
        country: 'Country',
      },
      billing_details: {
        name: 'John Doe',
        address: {
          line1: '123 Main St',
          line2: '',
          city: 'City',
          state: 'State',
          country: 'Country',
          postal_code: '12345',
        },
        email: 'john.doe@example.com',
        phone: '123-456-7890',
      },
      Default: false,
      created: Date.now(),
    },
  ];

  const mockFetchCards = jest.fn();

  const mockCustomerId = '123';

  test('renders PaymentMethod component', () => {
    render(<PaymentMethod cards={mockCards} fetchCards={mockFetchCards} customerId={mockCustomerId} />);

    // Add assertions based on your component structure
    expect(screen.getByText(/payment method/i)).toBeInTheDocument();
    expect(screen.getByText(/add new card/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    // Add more assertions as needed
  });

  test('handles "Add New Card" button click', () => {
    render(<PaymentMethod cards={mockCards} fetchCards={mockFetchCards} customerId={mockCustomerId} />);

    const addNewCardButton = screen.getByRole('button', { name: /add new card/i });
    fireEvent.click(addNewCardButton);
    expect(screen.getByText(/add new card/i)).toBeInTheDocument();
  });

  test('handles "Make Default" button click', () => {
    render(<PaymentMethod cards={mockCards} fetchCards={mockFetchCards} customerId={mockCustomerId} />);

    const makeDefaultButton = screen.getByRole('button', { name: /make default/i });
    fireEvent.click(makeDefaultButton);
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });

  test('handles "Delete" button click', () => {
    render(<PaymentMethod cards={mockCards} fetchCards={mockFetchCards} customerId={mockCustomerId} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });

  test('handles ConfirmationDialog onConfirm', async () => {
    render(<PaymentMethod cards={mockCards} fetchCards={mockFetchCards} customerId={mockCustomerId} />);

    const makeDefaultButton = screen.getByRole('button', { name: /make default/i });
    fireEvent.click(makeDefaultButton);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mockFetchCards).toHaveBeenCalledTimes(1);
    });
  });
});

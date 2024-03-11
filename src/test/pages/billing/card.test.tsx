import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from 'src/pages/billing/card';

describe('Card Component', () => {
    const mockItem = {
        id: 'some-id',
        created: Date.now(), 
        card: {
            brand: 'visa',
            last4: '1234',
            exp_month: 12,
            exp_year: 2023,
            country: 'US',
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
    };

    const mockOpenConfirmation = jest.fn();

      test('renders Card component', () => {
        render(
          <Card index={0} item={mockItem} cardsLength={1} openConfirmation={mockOpenConfirmation} />
        );

        // Add assertions based on your component structure
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
        expect(screen.getByText(/make as default/i)).toBeInTheDocument();
        expect(screen.getByText(/edit/i)).toBeInTheDocument();
      });

    test('handles "Make as Default" button click', () => {
        render(
            <Card index={0} item={mockItem} cardsLength={1} openConfirmation={mockOpenConfirmation} />
        );

        const makeDefaultButton = screen.getByText(/make as default/i);
        fireEvent.click(makeDefaultButton);
        expect(mockOpenConfirmation).toHaveBeenCalledWith(mockItem, false);
    });

    test('handles "Edit" button click', () => {
        render(
            <Card index={0} item={mockItem} cardsLength={1} openConfirmation={mockOpenConfirmation} />
        );

        const editButton = screen.getByText(/edit/i);
        fireEvent.click(editButton);
        expect(screen.getByText(/edit card/i)).toBeInTheDocument();
    });

    test('handles "Delete" button click', () => {
        render(
            <Card index={0} item={mockItem} cardsLength={2} openConfirmation={mockOpenConfirmation} />
        );

        const deleteButton = screen.getByText(/delete/i);
        fireEvent.click(deleteButton);
        expect(mockOpenConfirmation).toHaveBeenCalledWith(mockItem, true);
    });
});

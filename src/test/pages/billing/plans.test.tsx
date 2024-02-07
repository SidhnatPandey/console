import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Plans from 'src/pages/billing/plans';
import { PricingPlanType } from 'src/@core/components/plan-details/types';
import { useRouter } from 'next/router';


jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'), // Use actual implementation for non-mocked parts
    useRouter: jest.fn(),
  }));

describe('Plans Component', () => {
    const mockPlans: PricingPlanType[] = [
        {
          id: '1',
          title: 'Basic Plan',
          price: 9.99,
          features: ['Feature 1', 'Feature 2'],
          imgSrc: '/path/to/image',
          subtitle: 'Mock subtitle',
          popular_plan: true,
          monthly_price: 19.99,
          plan_benefits: ['Benefit 1', 'Benefit 2'],  // Add plan_benefits
          description: 'Mock description',
          summary: 'Mock summary',
          yearlyPlan: {
            perMonth: 15.99,
            totalAnnual: 191.88,
          },
          // Add other mock properties as needed
        },
        // Add more mock plans as needed
      ];


    const mockFetchCards = jest.fn();

    // test('renders Plans component', () => {
    //     render(<Plans plans={mockPlans} fetchCards={mockFetchCards} />);

    //     // Add assertions based on your component structure
    //     expect(screen.getByText(/pricing plans/i)).toBeInTheDocument();
    //     expect(screen.getByText(/choose the best plan/i)).toBeInTheDocument();
    //     // Add more assertions as needed
    // });

    test('handles plan upgrade click', () => {
        // Mock the useRouter implementation
        (useRouter as jest.Mock).mockReturnValue({
          push: jest.fn(),
        });
    
        render(<Plans plans={mockPlans} fetchCards={mockFetchCards} />);
    
        const upgradeButton = screen.getByRole('button', { name: /upgrade plan/i });
        fireEvent.click(upgradeButton);
    
        // Add assertions based on the expected behavior
        // For example, you can check if the PaymentDialog component is rendered
        expect(screen.getByText(/payment/i)).toBeInTheDocument();
      });
    //   test('handles PaymentDialog handleClose', () => {
    //     render(<Plans plans={mockPlans} fetchCards={mockFetchCards} />);

    //     const upgradeButton = screen.getByRole('button', { name: /upgrade plan/i });
    //     fireEvent.click(upgradeButton);

    //     const closeButton = screen.getByRole('button', { name: /close/i });
    //     fireEvent.click(closeButton);

    //     // Add assertions based on the expected behavior
    //     // For example, you can check if the PaymentDialog is closed
    //     expect(screen.queryByText(/payment/i)).not.toBeInTheDocument();
    //   });

    //   // Add more test cases as needed
});

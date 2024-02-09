import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Plans from 'src/pages/billing/plans';
import { PricingPlanType } from 'src/@core/components/plan-details/types';

import { useRouter } from 'next/router';

const mockNextRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock('src/services/billingService', () => ({
  saveCardSession: jest.fn(),
}));

jest.mock('src/context/AuthContext', () => ({
  useContext: jest.fn(() => ({
    fetchOrg: jest.fn(),
  })),
}));

jest.mock('src/utils/toaster', () => ({
  successToast: jest.fn(),
  errorToast: jest.fn(),
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
      plan_benefits: ['Benefit 1', 'Benefit 2'],
      description: 'Mock description',
      summary: 'Mock summary',
      yearlyPlan: {
        perMonth: 15.99,
        totalAnnual: 191.88,
      },
    },
  ];

  test('renders Plans component', () => {
    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockNextRouter);

    render(<Plans plans={mockPlans} fetchCards={jest.fn()} />);

    expect(screen.getByText(/pricing plans/i)).toBeInTheDocument();
    expect(screen.getByText(/choose the best plan/i)).toBeInTheDocument();
  });

  test('handles plan upgrade click', () => {
    const mockFetchCards = jest.fn();
    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockNextRouter);

    render(<Plans plans={mockPlans} fetchCards={mockFetchCards} />);

    const upgradeButton = screen.getByText(/upgrade plan/i);
    fireEvent.click(upgradeButton);

    expect(screen.getByText(/payment/i)).toBeInTheDocument();
  });

  test('handles PaymentDialog handleClose', async () => {
    const mockFetchCards = jest.fn();
    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockNextRouter);

    render(<Plans plans={mockPlans} fetchCards={mockFetchCards} />);

    const upgradeButton = screen.getByText(/upgrade plan/i);
    fireEvent.click(upgradeButton);

    const closeButton = screen.getByText(/close/i);
    fireEvent.click(closeButton);

    await act(async () => {});
    expect(screen.queryByText(/payment/i)).not.toBeInTheDocument();
  });
});

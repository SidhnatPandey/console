import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Plans from "src/pages/billing/plans";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("src/services/billingService", () => ({
  saveCardSession: jest.fn(),
}));

jest.mock("src/utils/toaster", () => ({
  successToast: jest.fn(),
  errorToast: jest.fn(),
}));

jest.mock("src/services/locastorageService", () => ({
  getItemFromLocalstorage: jest.fn(),
  removeItemFromLocalstorage: jest.fn(),
  setItemToLocalstorage: jest.fn(),
}));

jest.mock("src/context/AuthContext", () => ({
  AuthContext: {
    Consumer: ({
      children,
    }: {
      children: (value: { fetchOrg: () => void }) => React.ReactNode;
    }) => children({ fetchOrg: jest.fn() }),
  },
}));

global.fetch = jest.fn().mockResolvedValue({
  json: () =>
    Promise.resolve({ status: "complete", customer_id: "customerId" }),
});

describe("Plans Component", () => {
  const mockPlans = [
    {
      id: "1",
      title: "Basic Plan",
      price: 9.99,
      features: ["Feature 1", "Feature 2"],
      imgSrc: "/path/to/image",
      subtitle: "Mock subtitle",
      popular_plan: true,
      monthly_price: 19.99,
      plan_benefits: ["Benefit 1", "Benefit 2"],
      description: "Mock description",
      summary: "Mock summary",
      yearlyPlan: {
        perMonth: 15.99,
        totalAnnual: 191.88,
      },
    },
  ];

  test("renders Plans component", async () => {
    render(<Plans plans={mockPlans} fetchCards={jest.fn()} />);

    expect(screen.getByText(/Pricing Plans/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose the best plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Basic Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock subtitle/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock description/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock summary/i)).toBeInTheDocument();
  });

  test("handles plan upgrade click", async () => {
    const fetchCardsMock = jest.fn();
    render(<Plans plans={mockPlans} fetchCards={fetchCardsMock} />);

    fireEvent.click(screen.getByText(/Basic Plan/i));

    expect(screen.getByText(/9.99/i)).toBeInTheDocument();
  });
});

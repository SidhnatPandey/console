export type PricingPlanType = {
  id: string;
  title: string;
  price: number;
  features: string[];
  imgSrc: string;
  subtitle: string;
  imgWidth?: number;
  imgHeight?: number;
  currentPlan?: boolean;
  popular_plan: boolean;
  monthly_price: number;
  plan_benefits: string[];
  description?: string;
  summary?: string;
  yearlyPlan: {
    perMonth: number;
    totalAnnual: number;
  };
  tier?: number;
};

export type PricingPlanProps = {
  plan: string;
  data: PricingPlanType;
  handleUpgrade: any;
};

export type PricingFaqType = {
  id: string;
  answer: string;
  question: string;
};

export type PricingTableRowType = {
  feature: string;
  starter: boolean;
  pro: boolean | string;
  enterprise: boolean;
};

export type PricingTableType = {
  header: { title: string; subtitle: string; isPro?: boolean }[];
  rows: PricingTableRowType[];
};

export type PricingDataType = {
  faq: PricingFaqType[];
  pricingTable: PricingTableType;
  pricingPlans: PricingPlanType[];
};

import { useContext, useState } from "react";
import { PricingPlanType } from "src/@core/components/plan-details/types";
import { AuthContext } from "src/context/AuthContext";
import { getPlans } from "src/services/billingService";

function usePlan() {
  const authContext = useContext(AuthContext);

  //states
  const [plans, setPlans] = useState<PricingPlanType[]>([]);

  const isAppCrationAllowed = () => {
    const org = authContext.org;
    return org?.tier === 1 ? (org.app_count > 0 ? false : true) : true;
  };

  const planTier = () => {
    return authContext.org?.tier ?? 0;
  };

  const fetchPlans = () => {
    getPlans().then((res) => {
      if (res && res.data) {
        setPlans(res.data);
      } else {
        console.error("Invalid response format:", res);
      }
    })
  };
  const isDeveloperPlan = () => {
    return authContext.org?.tier === 1;
  };

  const userPlans = () => {
    const userPlans = plans?.filter((plan: any) => plan.tier >= planTier());
    return userPlans;
  };

  return {
    isAppCrationAllowed,
    planTier,
    userPlans,
    fetchPlans,
    isDeveloperPlan
  };
}

export default usePlan;

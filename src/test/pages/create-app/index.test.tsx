// Import the required testing libraries
import React from "react";
import { render, screen } from "@testing-library/react";
import StepperCustomVertical from "../../../pages/create-app/index";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "",
    query: {},
    asPath: "",
  }),
}));

test("StepperCustomVertical", () => {
  render(<StepperCustomVertical />);
  screen.debug();

  
});

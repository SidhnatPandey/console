import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./index";
import * as authService from "src/services/authService";

jest.mock("src/services/authService"); // Mock the entire module

const mockAuthService = authService as jest.Mocked<typeof authService>;
const mockCheckUsername = mockAuthService.checkUsername;

// Mock useRouter for this test case
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  
}));



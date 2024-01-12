import UserProfileHeader from "src/pages/myProfile/UserProfileHeader";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getUserInfo } from "src/services/userService";
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("src/services/userService", () => ({
  getUserInfo: jest.fn().mockResolvedValue({
    status: 200,
    data: {
      id: "mock_id",
      type: "mock_type",
      user_id: "mock_user_id",
      role: "mock_role",
      org: "mock_org",
      org_id: "mock_org_id",
      email: "mock@example.com",
      username: "mock_username",
      password: "mock_password",
      created_at: "mock_created_at",
      updated_at: "mock_updated_at",
      nickname: "mock_nickname",
      user_info: {
        first_name: "John",
        last_name: "Doe",
        phone_number: "1234567890",
        profile_picture: "mock_profile_picture_url",
        address: {
          country: "mock_country",
          state: "mock_state",
          zip_code: "12345",
          city: "mock_city",
          street_address: "mock_street_address",
        },
      },
      status: "mock_status",
    },
  } as any),
}));

describe("UserProfileHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the user profile header correctly", async () => {
    render(<UserProfileHeader setAllUserData={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId("profile-picture")).toBeInTheDocument();
    });
    expect(screen.getByTestId("profile-banner")).toBeInTheDocument();
    expect(screen.getByTestId("box-container")).toBeInTheDocument();
    expect(screen.getByTestId("info-box")).toBeInTheDocument();
    expect(screen.getByTestId("role")).toBeInTheDocument();
    expect(screen.getByTestId("address")).toBeInTheDocument();
    expect(screen.getByTestId("joined-date")).toBeInTheDocument();

    const editProfileButton = screen.getByTestId("edit-profile-button");
    userEvent.click(editProfileButton);
  });
});

import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import UserList, { RowOptions } from "src/pages/settings";
import "@testing-library/jest-dom";
import * as userService from "src/services/userService";

jest.mock("src/services/userService");

describe("UserList Component", () => {
  const mockUsers = [
    {
      user_id: "1",
      user_info: {
        first_name: "John",
        last_name: "Doe",
        profile_picture: "",
      },
      username: "johndoe",
      email: "johndoe@example.com",
      role: "admin",
      status: "active",
    },
  ];

  beforeEach(() => {
    (userService.getOrganisationsUserList as jest.Mock).mockResolvedValue({
      data: { users: mockUsers },
    });
    (userService.inviteUser as jest.Mock).mockResolvedValue({
      status: 201,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("UserList Component", () => {
    test('Verify that the "Add New User" button opens the dialog', () => {
      render(<UserList />);

      const addButton = screen.getByRole("button", { name: /add new user/i });
      fireEvent.click(addButton);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      const dialogElement = screen.getByTestId("user-dialog");
      expect(dialogElement).toBeInTheDocument();
      const dialogTitle = screen.getByTestId("user-dialog-title");
      expect(dialogTitle).toBeInTheDocument();
      const formElement = screen.getByTestId("form");
      expect(formElement).toBeInTheDocument();
      const emailInputElement = screen.getByTestId("email-input");
      expect(emailInputElement).toBeInTheDocument();
      const usernameInputElement = screen.getByTestId("username-input");
      expect(usernameInputElement).toBeInTheDocument();
      const organizationInputElement = screen.getByTestId("organization-input");
      expect(organizationInputElement).toBeInTheDocument();
      const roleSelectElement = screen.getByTestId("role-select");
      expect(roleSelectElement).toBeInTheDocument();
      const workspaceSelectElement = screen.getByTestId("workspace-select");
      expect(workspaceSelectElement).toBeInTheDocument();
      const submitButtonElement = screen.getByTestId("submit-button");
      expect(submitButtonElement).toBeInTheDocument();
    });

    it("Renders a table when there are users", async () => {
      render(<UserList />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("user-full-name")).toBeInTheDocument();
      expect(screen.getByTestId("role")).toBeInTheDocument();
      expect(screen.getByTestId("email-address")).toBeInTheDocument();
      expect(screen.getByTestId("status")).toBeInTheDocument();
      expect(screen.getByTestId("action")).toBeInTheDocument();
    });
  });
  test("Should display a message or empty state when no users are present", () => {
    render(<UserList />);
    const noUsersMessage = screen.getByTestId("tableData");
    expect(noUsersMessage).toHaveTextContent("Loading ...");
  });

  test("Should display tablecell data", () => {
    render(<UserList />);
    const tableCellData = screen.getByTestId("tableData");
    expect(tableCellData).toBeInTheDocument();
  });

  test("Renders the first user's avatar in the table", async () => {
    render(<UserList />);

    const firstUserAvatar = await waitFor(() =>
      screen.findByTestId("avatar-0")
    );
    expect(firstUserAvatar).toBeInTheDocument();
  });

  test("Verify all the buttons", () => {
    render(<UserList />);

    const rowButton = screen.getByRole("button", { name: /Rows per page: 5/i });
    fireEvent.click(rowButton);
    const previousButton = screen.getByRole("button", {
      name: /Go to previous page/i,
    });
    fireEvent.click(previousButton);
    const nextButton = screen.getByRole("button", { name: /Go to next page/i });
    fireEvent.click(nextButton);
  });

  test('Verify the "remove User" menu', async () => {
    render(
      <RowOptions
        user={{
          id: "",
          type: "",
          user_id: "",
          role: "",
          org: "",
          org_id: "",
          email: "",
          username: "",
          password: "",
          created_at: "",
          updated_at: "",
          nickname: "",
          default_org: undefined,
          user_info: {
            first_name: "",
            last_name: "",
            phone_number: "",
            profile_picture: "",
            address: {
              country: "",
              state: "",
              zip_code: 0,
              city: "",
              street_address: "",
            },
          },
          status: "",
        }}
        editClickHandler={undefined}
        refreshData={undefined}
        orgName={undefined}
      />
    );

    const menuIconButton = screen.getByTestId("menu-icon");
    fireEvent.click(menuIconButton);

    const removeMenu = screen.getByTestId("remove-user");
    fireEvent.click(removeMenu);
  });
});

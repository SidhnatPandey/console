import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorkspaceSettings from 'src/pages/workspace/WorkspaceSettings';
import * as appService from 'src/services/appService';
import "@testing-library/jest-dom";

const mockedGetListOfUsersWorkspaces = appService.getListOfUsersWorkspaces as jest.MockedFunction<typeof appService.getListOfUsersWorkspaces>;
const mockedOrgUser = appService.orguser as jest.MockedFunction<typeof appService.orguser>;

jest.mock('src/services/appService', () => ({
  getListOfUsersWorkspaces: jest.fn(),
  addUserToWorkspace: jest.fn(),
  removeUserFromWorkspace: jest.fn(),
  orguser: jest.fn(),
}));

const mockWorkspaceId = { id: 'mockWorkspaceId' };

const mockUsers = [
  {
    id: 1,
    user_id: 'user1',
    email: 'user1@example.com',
  },
  {
    id: 2,
    user_id: 'user2',
    email: 'user2@example.com',
  },
];

const mockWorkspaceSettingsData = [
  {
    profile_picture: null,
    username: 'user1',
    id: 1,
    user_full_name: 'User One',
    role: 'developer',
    email: 'user1@example.com',
    status: 'active',
    org_id: 'org1',
    user_id: 'user1',
    user: {},
  },
  {
    profile_picture: null,
    username: 'user2',
    id: 2,
    user_full_name: 'User Two',
    role: 'workspace-admin',
    email: 'user2@example.com',
    status: 'pending',
    org_id: 'org1',
    user_id: 'user2',
    user: {},
  },
];

describe('WorkspaceSettings', () => {
  beforeEach(() => {
    mockedGetListOfUsersWorkspaces.mockResolvedValue({ data: mockWorkspaceSettingsData });
    mockedOrgUser.mockResolvedValue({ data: { users: mockUsers } });
  });

  test('renders workspace settings correctly', async () => {
    mockedGetListOfUsersWorkspaces.mockResolvedValueOnce({ data: mockWorkspaceSettingsData });
    mockedOrgUser.mockResolvedValueOnce({ data: { users: mockUsers } });
  
    render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);
  
    await waitFor(() => {
      expect(mockedGetListOfUsersWorkspaces).toHaveBeenCalledTimes(1);
      expect(mockedOrgUser).toHaveBeenCalledTimes(1);
    });
      expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
  });
  test('Verify that the "Add New User" button opens the dialog', () => {
    render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);

    const addButton = screen.getByTestId("button");
    fireEvent.click(addButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();    
    const dialogTitle = screen.getByTestId("user-dialog-title");
    expect(dialogTitle).toBeInTheDocument();
    const emailInputElement = screen.getByTestId("email-select");
    expect(emailInputElement).toBeInTheDocument();
    const roleSelectElement = screen.getByTestId("role-select");
    expect(roleSelectElement).toBeInTheDocument();
    const submitButtonElement = screen.getByTestId("submit-button");
    expect(submitButtonElement).toBeInTheDocument();
  });

  it("Renders a table when there are users", async () => {
    render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("user-full-name")).toBeInTheDocument();
    expect(screen.getByTestId("role")).toBeInTheDocument();
    expect(screen.getByTestId("email-address")).toBeInTheDocument();
    expect(screen.getByTestId("status")).toBeInTheDocument();
    expect(screen.getByTestId("action")).toBeInTheDocument();
  });
});
test("Should display a message or empty state when no users are present", () => {
  render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);
  const noUsersMessage = screen.getByTestId("tableData");
  expect(noUsersMessage).toHaveTextContent("Loading ...");
});

test("Should display tablecell data", () => {
  render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);
  const tableCellData = screen.getByTestId("tableData");
  expect(tableCellData).toBeInTheDocument();
});

test("Verify all the buttons", () => {
  render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);

  const rowButton = screen.getByRole("button", { name: /Rows per page: 5/i });
  fireEvent.click(rowButton);
  const previousButton = screen.getByRole("button", {
    name: /Go to previous page/i,
  });
  fireEvent.click(previousButton);
  const nextButton = screen.getByRole("button", { name: /Go to next page/i });
  fireEvent.click(nextButton);
});

  test('should open menu when clicking the more icon', async () => {
    render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);

    await waitFor(() => expect(screen.getByText('User One')).toBeInTheDocument());

    const menuIconButtons = screen.getAllByTestId('menu-icon');
    fireEvent.click(menuIconButtons[0]);
  });
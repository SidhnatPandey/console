import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkspaceSettings from 'src/pages/workspace/WorkspaceSettings';
import * as appService from 'src/services/appService';
import "@testing-library/jest-dom";


// Mocking API functions with type definitions
const mockedGetListOfUsersWorkspaces = appService.getListOfUsersWorkspaces as jest.MockedFunction<typeof appService.getListOfUsersWorkspaces>;
const mockedOrgUser = appService.orguser as jest.MockedFunction<typeof appService.orguser>;
const mockedAddUserToWorkspace = appService.addUserToWorkspace as jest.MockedFunction<typeof appService.addUserToWorkspace>;
const mockedRemoveUserFromWorkspace = appService.removeUserFromWorkspace as jest.MockedFunction<typeof appService.removeUserFromWorkspace>;

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
    // Mock the API data
    mockedGetListOfUsersWorkspaces.mockResolvedValueOnce({ data: mockWorkspaceSettingsData });
    mockedOrgUser.mockResolvedValueOnce({ data: { users: mockUsers } });
  
    // Render the component
    render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);
  
    // Wait for the API calls to resolve
    await waitFor(() => {
      expect(mockedGetListOfUsersWorkspaces).toHaveBeenCalledTimes(1);
      expect(mockedOrgUser).toHaveBeenCalledTimes(1);
    });
  
    // Debug: Log the rendered HTML for inspection
    console.log(screen.debug());
  
    // Check if user data is rendered
    expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
  });
  
  test('opens add user dialog on button click', async () => {
    // Render the component
    render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);
  
    // Wait for the API calls to resolve
    // await waitFor(() => expect(appService.getListOfUsersWorkspaces).toHaveBeenCalledTimes(1));
    // await waitFor(() => expect(appService.orguser).toHaveBeenCalledTimes(1));
  
    // Open the add user dialog
    fireEvent.click(screen.getByRole('button', { name: 'Add User' }));
  
    // Wait for the dialog to be rendered
    await waitFor(() => screen.getByText('Invite User'));
  
    // Check if the dialog is open
    expect(screen.getByText('Invite User')).toBeInTheDocument();
  });

// test('adds user to workspace on save button click', async () => {
//   render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);

//   await waitFor(() => expect(mockedGetListOfUsersWorkspaces).toHaveBeenCalledTimes(1));
//   await waitFor(() => expect(mockedOrgUser).toHaveBeenCalledTimes(1));

//   // Open the add user dialog
//   fireEvent.click(screen.getByRole('button', { name: 'Add User' }));

//   // Select a user and role
//   userEvent.selectOptions(screen.getByLabelText('User Email'), 'user1');
//   userEvent.selectOptions(screen.getByLabelText('Role'), 'developer');

//   // Mock the API call for adding user to workspace
//   mockedAddUserToWorkspace.mockResolvedValueOnce();

//   // Click the save button
//   fireEvent.click(screen.getByRole('button', { name: 'Save' }));

//   // Wait for the API call to resolve
//   await waitFor(() => expect(mockedAddUserToWorkspace).toHaveBeenCalledWith({
//     role: 'developer',
//     user_id: 'user1',  // Replace with the actual user ID value
//     workspace_id: mockWorkspaceId.id,
//   }));

//   // Check if the user is added
//   expect(screen.getByText('User One')).toBeInTheDocument();
// });
//     // Check if the user is added
//     expect(screen.getByText('User One')).toBeInTheDocument();
//   });
  
  // test('removes user from workspace on remove button click', async () => {
  //   render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);
  
  //   await waitFor(() => expect(mockedGetListOfUsersWorkspaces).toHaveBeenCalledTimes(1));
  //   await waitFor(() => expect(mockedOrgUser).toHaveBeenCalledTimes(1));
  
  //   // Mock the API call for removing user from workspace
  //   mockedRemoveUserFromWorkspace.mockResolvedValueOnce();
  
  //   // Click the remove button for the first user
  //   fireEvent.click(screen.getByTestId('remove-button-0'));
  
  //   // Wait for the API call to resolve
  //   await waitFor(() => expect(mockedRemoveUserFromWorkspace).toHaveBeenCalledTimes(1));
  
  //   // Check if the user is removed
  //   expect(screen.queryByText('User One')).not.toBeInTheDocument();
  // });
  // test('edits user on edit button click', async () => {
  //   render(<WorkspaceSettings workspaceId={mockWorkspaceId} />);
  
  //   await waitFor(() => expect(mockedGetListOfUsersWorkspaces).toHaveBeenCalledTimes(1));
  //   await waitFor(() => expect(mockedOrgUser).toHaveBeenCalledTimes(1));
  
  //   // Mock the API call for editing user
  //   mockedAddUserToWorkspace.mockResolvedValueOnce();
  
  //   // Click the edit button for the first user
  //   fireEvent.click(screen.getByTestId('edit-button-0'));
  
  //   // Check if the edit dialog is open
  //   expect(screen.getByText('Edit User')).toBeInTheDocument();
  
  //   // Select a new role
  //   userEvent.selectOptions(screen.getByLabelText('Role'), 'developer');
  
  //   // Click the save button
  //   fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  
  //   // Wait for the API call to resolve
  //   await waitFor(() => expect(mockedAddUserToWorkspace).toHaveBeenCalledTimes(1));
  
  //   // Check if the user is edited
  //   expect(screen.getByText('User One')).toBeInTheDocument();
  // });
  
});

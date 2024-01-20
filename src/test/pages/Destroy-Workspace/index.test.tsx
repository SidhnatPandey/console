import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DestroyWorkspace from 'src/pages/workspace/DestroyWorkspace';
import { deleteWorkspace } from 'src/services/appService';
import "@testing-library/jest-dom";

jest.mock('src/services/appService');

describe('DestroyWorkspace', () => {
  const mockWorkspaceId = { id: '123' };

  it('renders without crashing', () => {
    render(<DestroyWorkspace workspaceId={mockWorkspaceId} loading={false} />);
    // You can add more specific assertions if needed
    expect(screen.getByText('Destroy Workspace and Associated Apps')).toBeInTheDocument();
  });

  it('displays loading spinner when loading prop is true', () => {
    render(<DestroyWorkspace workspaceId={mockWorkspaceId} loading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('opens confirmation dialog when Destroy button is clicked', () => {
    render(<DestroyWorkspace workspaceId={mockWorkspaceId} loading={false} />);
    const destroyButton = screen.getByTestId('destroy-button');
    fireEvent.click(destroyButton);
    expect(screen.getByText('Are you sure you want to delete this Workspace?')).toBeInTheDocument();
  });

});

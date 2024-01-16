import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Workspace from 'src/pages/workspace/[slug]';
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

describe('Workspace Component', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/workspace/TestProject');
    mockRouter.query = { slug: 'TestProject' };
  });

  test('renders Workspace component with card', async () => {
    render(<Workspace />);
  
    const cardElement = await screen.findByTestId('card');
    expect(cardElement).toBeInTheDocument();
  });
  

  test('checks Workspace component are present or not', () => {
    render(<Workspace />);
    expect(screen.getByTestId('button')).toBeInTheDocument();
    expect(screen.getByTestId('button2')).toBeInTheDocument();
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByText('Apps')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('handles tab switching', async () => {
    render(<Workspace />);

    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);

    await waitFor(() => {
      expect(screen.queryByText('Workspace Component')).not.toBeInTheDocument();

    });

    await waitFor(() => {
      expect(screen.getByText('Settings Content')).toBeInTheDocument();
    });
  });

  test('it should display the workspace component when the Apps button is clicked', async () => {
    render(<Workspace />);
    const appsButton = screen.getByText('Apps');
    fireEvent.click(appsButton);

    const workspaceComponent = screen.getByText('Apps');
    expect(workspaceComponent).toHaveTextContent('Apps');
  });

  test('displays correct project title and description', () => {
    render(<Workspace />);
    expect(screen.getByTestId('title')).toHaveTextContent('TestProject');
    expect(screen.getByTestId('description')).toHaveTextContent('This workspace is for TestProject');
  });

  test('toggles content and icons on tab click', () => {
    render(<Workspace />);
    const appsButton = screen.getByTestId('button');
    const settingsButton = screen.getByTestId('button2');

    fireEvent.click(settingsButton);
    expect(screen.getByTestId('settingsContent')).toBeInTheDocument();
    expect(screen.queryByTestId('Apps')).not.toBeInTheDocument();

    fireEvent.click(appsButton);
    expect(screen.queryByTestId('settingsContent')).not.toBeInTheDocument();
    expect(screen.getByText('Apps')).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from 'src/pages/myProfile/Profile';
import ProfileTabs from 'src/pages/myProfile/ProfileTabs';
import '@testing-library/jest-dom';

describe('ProfileTabs Component', () => {
  test('renders profile tab correctly', async () => {
    render(<ProfileTabs/>);
    expect(screen.getByTestId('profile-tab')).toBeInTheDocument();
  });
});

describe('Profile Component', () => {
  const user_info = {
    user_info: {
      first_name: 'John',
      last_name: 'Doe',
      status: 'Active',
      address: {
        city: 'Cityville',
        country: 'Countryland',
      },
      phone_number: '1234567890',
      email: 'john.doe@example.com',
    },
  };

  test('renders user information correctly', async () => {
    render(<Profile profileData={null} />);
    
    expect(screen.getByTestId('about-section')).toBeInTheDocument();
    expect(screen.getByTestId('full-name')).toBeInTheDocument();
    expect(screen.getByTestId('status')).toBeInTheDocument();
    expect(screen.getByTestId('city')).toBeInTheDocument();
    expect(screen.getByTestId('country')).toBeInTheDocument();
    expect(screen.getByTestId('contacts-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
  });
});

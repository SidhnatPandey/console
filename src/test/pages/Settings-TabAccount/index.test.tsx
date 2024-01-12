import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabAccount from 'src/pages/myProfile/edit-profile/TabAccount'; // Assuming the component is in the same directory
import { deactivateUser, postUserProfile } from 'src/services/userService';
import { act } from 'react-dom/test-utils';

jest.mock('src/services/userService', () => ({
    getUserProfile: jest.fn(() => Promise.resolve({ data: {} })),
    postUserProfile: jest.fn(() => Promise.resolve({ status: 200 })),
    deactivateUser: jest.fn(() => Promise.resolve({ status: 200 })),
}));
jest.mock('react-hot-toast', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock('src/hooks/useAuth', () => ({ useAuth: jest.fn(() => ({ logout: jest.fn() })) }));

describe('TabAccount Component', () => {
    it('renders TabAccount component correctly', async () => {
        render(<TabAccount />);
        await waitFor(() => {
            expect(screen.getByText('Profile Details')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('Delete Account')).toBeInTheDocument();
        });
    });

    it('handles form changes correctly', async () => {
        render(<TabAccount />);
        const firstNameInput = screen.getByLabelText('First Name') as HTMLInputElement;
        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        await waitFor(() => {
            expect(firstNameInput.value).toBe('John');
        });

        const lastNameInput = screen.getByLabelText('Last Name') as HTMLInputElement;
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
        await waitFor(() => {
            expect(lastNameInput.value).toBe('Doe');
        });

        const phoneNumberInput = screen.getByLabelText('Phone Number') as HTMLInputElement;
        fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
        await waitFor(() => {
            expect(phoneNumberInput.value).toBe('1234567890');
        });

        const stateInput = screen.getByLabelText('State') as HTMLInputElement;
        fireEvent.change(stateInput, { target: { value: 'California' } });
        await waitFor(() => {
            expect(stateInput.value).toBe('California');
        });

        const cityInput = screen.getByLabelText('City') as HTMLInputElement;
        fireEvent.change(cityInput, { target: { value: 'Los Angeles' } });
        await waitFor(() => {
            expect(cityInput.value).toBe('Los Angeles');
        });

        const organizationInput = screen.getByLabelText('Organization') as HTMLInputElement;
        fireEvent.change(organizationInput, { target: { value: 'ABC Corp' } });
        await waitFor(() => {
            expect(organizationInput.value).toBe('ABC Corp');
        });

        const addressInput = screen.getByLabelText('Address') as HTMLInputElement;
        fireEvent.change(addressInput, { target: { value: '123 Main St' } });
        await waitFor(() => {
            expect(addressInput.value).toBe('123 Main St');
        });

        const zipCodeInput = screen.getByLabelText('Zip Code') as HTMLInputElement;
        fireEvent.change(zipCodeInput, { target: { value: '12345' } });
        await waitFor(() => {
            expect(zipCodeInput.value).toBe('12345');
        });
    });

    it('handles save changes correctly', async () => {
        render(<TabAccount />);
        const saveChangesButton = screen.getByText('Save Changes');
        fireEvent.click(saveChangesButton);

        await waitFor(() => {
            expect(postUserProfile).toHaveBeenCalled();
        });
    });

    it('handles input image change correctly', async () => {
        render(<TabAccount />);
        const fileInput = screen.getByLabelText('Upload New Photo') as HTMLInputElement;
        const file = new File(['(binary content)'], 'test.jpg', { type: 'image/jpeg' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(fileInput.files?.length).toBe(1);
        });
    });

    it('handles input image reset correctly', async () => {
        render(<TabAccount />);
        const resetButton = screen.getByText('Reset');
        fireEvent.click(resetButton);
        await waitFor(() => {
            const profilePic = screen.getByAltText('Profile Pic');
            expect(profilePic).toHaveAttribute('src', 'data:image/jpeg;base64,'); // Change this based on the expected initial value
        });
    });


    it('handles cancel changes correctly', async () => {
        render(<TabAccount />);
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);
        await waitFor(() => {
            expect((screen.getByLabelText('First Name') as HTMLInputElement).value).toBe('');
        });
    });

    it('handles deactivate account correctly', async () => {
        render(<TabAccount />);
        const deactivateButton = screen.getByText('Deactivate Account');
        fireEvent.click(deactivateButton);
        await act(async () => {
            await deactivateUser();
            expect(deactivateUser).toHaveBeenCalled();
        });
    });
});

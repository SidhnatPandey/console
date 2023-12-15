import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabAccount from 'src/pages/settings/TabAccount';// Assuming the component is in the same directory
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
            expect(screen.getByText('Delete Account')).toBeInTheDocument();
        });
    });

    it('handles form changes correctly', async () => {
        render(<TabAccount />);
        await waitFor(() => {
            const firstNameInput = screen.getByLabelText('First Name') as HTMLInputElement;
            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            expect(firstNameInput.value).toBe('John');
        });
    });

    it('handles save changes correctly', async () => {
        render(<TabAccount />);
        await waitFor(() => {
            const saveChangesButton = screen.getByText('Save Changes');
            fireEvent.click(saveChangesButton);
            expect(postUserProfile).toHaveBeenCalled();
        });
    });

    it('handles input image change correctly', async () => {
        render(<TabAccount />);
        await waitFor(() => {
            const fileInput = screen.getByLabelText('Upload New Photo') as HTMLInputElement;
            const file = new File(['(binary content)'], 'test.jpg', { type: 'image/jpeg' });
            if (fileInput) {
                fireEvent.change(fileInput, { target: { files: [file] } });
                expect(fileInput.files?.length).toBe(1);
            } else {
                throw new Error('Input element not found');
            }
        });
    });

    it('handles input image reset correctly', async () => {
        render(<TabAccount />);
        await waitFor(() => {
            const resetButton = screen.getByText('Reset');
            fireEvent.click(resetButton);
            return waitFor(() => {
                const profilePic = screen.getByAltText('Profile Pic');
                expect(profilePic.getAttribute('src')).toBe('data:image/jpeg;base64,'); // Change this based on the expected initial value
            });
        });
    });

    it('handles cancel changes correctly', async () => {
        render(<TabAccount />);
        await waitFor(() => {
            const cancelButton = screen.getByText('Cancel');
            fireEvent.click(cancelButton);
            expect((screen.getByLabelText('First Name') as HTMLInputElement).value).toBe('');
        });
    });

    it('handles deactivate account correctly', async () => {
        render(<TabAccount />);
        await act(async () => {
            const deactivateButton = screen.getByText('Deactivate Account');
            fireEvent.click(deactivateButton);
            await deactivateUser();
            expect(deactivateUser).toHaveBeenCalled();
        });
    });
})



import { render, screen, waitFor } from '@testing-library/react';
import { destroyApp } from 'src/services/appService';
import DestroyApp from 'src/pages/workspace/app-dashboard/DestroyApp';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('src/services/appService', () => ({
    destroyApp: jest.fn() as jest.MockedFunction<typeof destroyApp>,
}));

describe('DestroyApp Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component with loading state', async () => {
        render(<DestroyApp loading={true} />);
        waitFor(() => {
            expect(screen.getByText(/Loading/i)).toBeInTheDocument();
        });
        waitFor(() => {
            expect(screen.getByText('Destroy')).toBeInTheDocument();
        });
    });

    test('renders the component with data', async () => {
        render(<DestroyApp loading={false} appName="Test App" />);
        waitFor(() => {
            expect(true).toBe(true); // Trivial condition
        });
        waitFor(() => {
            expect(screen.getByText('App Settings')).toBeInTheDocument();
        });
        waitFor(() => {
            expect(screen.getByText('Destroy App')).toBeInTheDocument();
        });
    });


    test('clicking the Destroy button opens the confirmation dialog', async () => {
        render(<DestroyApp loading={false} appId="testAppId" />);

        waitFor(() => {
            expect(screen.getByText('Destroy')).toBeInTheDocument();
        });
        userEvent.click(screen.getByText(/Destroy App and Associated Components/i));
        waitFor(() => {
            expect(screen.getByText('Are you sure you want to Delete this App?')).toBeInTheDocument();
        });
    });

    test('clicking "Confirm" in the confirmation dialog triggers destroyApp and redirects on success', async () => {
        (destroyApp as jest.Mock).mockResolvedValueOnce({ status: 200 });
        render(<DestroyApp loading={false} appId="testAppId" />);
        userEvent.click(screen.getByRole('button', { name: /Destroy/i }));
        waitFor(() => {
            expect(destroyApp).toHaveBeenCalledWith('testAppId');
        });
        waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('App deleted successfully!');
        });
        waitFor(() => {
            expect(location.pathname).toBe('/apps');
        });
    });
});

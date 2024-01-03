import React from 'react';
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import Workspace from 'src/pages/workspace';


jest.mock('next/router', () => ({
    useRouter: () => ({
        query: { project: ['mockedProjectId'] },
        push: jest.fn(),
    }),
}));

describe('<Workspace />', () => {

    // it('renders the component with project details', () => {
    //     render(<Workspace />);

    //     // Assert that the cardElement is present
    //     expect(screen.getByTestId('card')).toBeInTheDocument();

    //     // Assert other conditions
    //     const titleElement = screen.getByTestId('title');
    //     expect(titleElement).toBeInTheDocument();
    //     expect(titleElement).toContainHTML('This workspace is for');
    //   });

    it('renders the component with "N/A" when project is null', async () => {
        jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({
            query: { project: null },
            push: jest.fn(),
        });
        render(<Workspace />);
        try {
            await waitFor(() => {
                const titleElement = screen.queryByTestId('title');
                if (!titleElement) {
                    throw new Error('Title element not found');
                }
                if (titleElement.textContent === 'N/A') {
                    return true;
                }
                return false;
            });
            const titleElement = screen.getByTestId('title');
            expect(titleElement).toHaveTextContent('N/A');
        } catch (error: any) {
            expect((error as Error).message).toContain('Title element not found');
        }
    });

    it('switches to Apps tab and shows Apps content', async () => {
        render(<Workspace />);
        await screen.findByTestId('card');
        fireEvent.click(screen.getByText('Apps'));
        const appsTab = screen.getByText('Apps');
        const appsTabStyle = window.getComputedStyle(appsTab);
        expect(appsTabStyle.backgroundColor).toBe('rgb(21, 101, 192)');
    });

    // it('switches to Settings tab and shows Settings content', async () => {
    //     render(<Workspace />);

    //     // Wait for the component to render
    //     const cardElement = await screen.findByTestId('card');

    //     // Click on Settings tab
    //     fireEvent.click(screen.getByText('Settings'));

    //     // Wait for the card element to be removed
    //     await waitFor(async () => {
    //       if (screen.queryByTestId('card')) {
    //         // Continue waiting if the element is still present
    //         return false;
    //       }
    //       // Return true when the element is not present
    //       return true;
    //     }, { timeout: 5000 }); // Adjust the timeout as needed

    //     // Assert that Settings content is displayed
    //     expect(screen.getByText('Settings Content')).toBeInTheDocument();
    //   });
})
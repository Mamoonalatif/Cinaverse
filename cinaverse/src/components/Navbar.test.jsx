import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../context/StoreContext', () => ({
    useStore: () => ({
        user: { id: 1, firstName: 'Test' },
        isAuthenticated: true,
        logout: jest.fn(),
        theme: 'dark',
        toggleTheme: jest.fn(),
    }),
}));

describe('Navbar Component', () => {
    it('renders navbar links', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText(/home/i)).toBeInTheDocument();
        expect(screen.getByText(/movies/i)).toBeInTheDocument();
        // Should show user name if logged in
        expect(screen.getByText(/Test/)).toBeInTheDocument();
    });
});

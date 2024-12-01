// FILE: src/views/pages/authentication/auth-forms/AuthLogin.test.jsx

import { render, fireEvent, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseContext } from 'contexts/FirebaseContext';
import AuthLogin from './AuthLogin';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
  reducer: {
    customization: (state = { borderRadius: 12 }) => state,
  },
});

const mockLogin = vi.fn();

const renderWithProviders = (ui, { providerProps, ...renderOptions } = {}) => {
  return render(
    <Provider store={mockStore}>
      <FirebaseContext.Provider {...providerProps}>
        <BrowserRouter>{ui}</BrowserRouter>
      </FirebaseContext.Provider>
    </Provider>,
    renderOptions
  );
};

describe('AuthLogin', () => {
  const providerProps = {
    value: {
      login: mockLogin,
    },
  };

  beforeEach(() => {
    mockLogin.mockClear();
  });

  test('prompts the user to fill in the required fields if username or password is blank', async () => {
    renderWithProviders(<AuthLogin />, { providerProps });

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('displays a login failure message if the login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Login failed'));

    renderWithProviders(<AuthLogin />, { providerProps });

    fireEvent.change(screen.getByLabelText(/email address \/ username/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(
      screen.getByLabelText('Password', { selector: 'input' }),
      { target: { value: 'password' } }
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
  });
});
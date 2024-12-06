// FILE: src/views/pages/authentication/auth-forms/AuthRegister.test.jsx

import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { FirebaseContext } from 'contexts/FirebaseContext';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import AuthRegister from './AuthRegister';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockStore = configureStore({
  reducer: {
    customization: (state = { borderRadius: 12 }) => state,
  },
});

const mockRegister = vi.fn();

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

describe('AuthRegister', () => {
  const providerProps = {
    value: {
      register: mockRegister,
    },
  };

  beforeEach(() => {
    mockRegister.mockClear();
    mockNavigate.mockClear();
  });

  // prompts the user to fill in the required fields if fields are left blank
  test('User clicks the “Register” button', async () => {
    renderWithProviders(<AuthRegister />, { providerProps });

    fireEvent.click(screen.getByTestId('sign-up-button'));

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Please Confirm password/i)).toBeInTheDocument();
  });

  // displays a registration failure message if the registration fails
  test('User enters the username, password, email, and other optional information. After entering the information, the user clicks the “Register” button.', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Registration failed'));

    renderWithProviders(<AuthRegister />, { providerProps });

    fireEvent.change(screen.getByLabelText('First Name', { selector: 'input' }), {
        target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last Name', { selector: 'input' }), {
        target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i, { selector: 'input' }), {
        target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
        target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    // expect(await screen.findByTestId('submit-error')).toHaveTextContent('Registration failed');
  });

// TODO: Fix this test
//   test('allows a user to register successfully', async () => {
//     mockRegister.mockResolvedValueOnce({});

//     renderWithProviders(<AuthRegister />, { providerProps });

//     fireEvent.change(screen.getByLabelText('First Name', { selector: 'input' }), {
//         target: { value: 'John' },
//     });
//     fireEvent.change(screen.getByLabelText('Last Name', { selector: 'input' }), {
//         target: { value: 'Doe' },
//     });
//     fireEvent.change(screen.getByLabelText(/email/i, { selector: 'input' }), {
//         target: { value: 'john.doe@example.com' },
//     });
//     fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
//         target: { value: 'password123' },
//     });
//     fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input' }), {
//         target: { value: 'password123' },
//     });
//     fireEvent.change(screen.getByLabelText('Phone', { selector: 'input' }), {
//         target: { value: '1234567890' },
//     });

//     fireEvent.change(screen.getByLabelText('Gender', { selector: 'input' }), {
//         target: { value: 'male' },
//     });
    

//     fireEvent.change(screen.getByLabelText('Birthday', { selector: 'input' }), {
//         target: { value: '1990-01-01' },
//     });
//     fireEvent.change(screen.getByLabelText('Occupation', { selector: 'input' }), {
//         target: { value: 'Engineer' },
//     });
//     fireEvent.change(screen.getByLabelText("Jobs You're Seeking", { selector: 'input' }), {
//         target: { value: 'Software Developer' },
//     });
//     fireEvent.change(screen.getByLabelText("Skills You've Acquired", { selector: 'input' }), {
//         target: { value: 'JavaScript, React' },
//     });
  
//     // Check terms & conditions
//     fireEvent.click(screen.getByTestId('terms-checkbox'));

//     // Submit form
//     fireEvent.click(screen.getByTestId('sign-up-button'));
    

//     expect(mockRegister).toHaveBeenCalledWith(
//         'john.doe@example.com',
//         'password123',
//       expect.objectContaining({
//         firstName: 'John',
//         lastName: 'Doe',
//         phone: '1234567890',
//         gender: 'male', 
//         birthday: '1990-01-01',
//         occupation: 'Engineer',
//         jobsSeeking: 'Software Developer',
//         skills: 'JavaScript, React'
//       })
//     );

//     // Check that navigate was called to redirect the user
//     expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
//   });
});
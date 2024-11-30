// FILE: src/views/pages/authentication/auth-forms/ProfilePage.test.jsx

import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FirebaseContext } from 'contexts/FirebaseContext';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import ProfilePage from './index.jsx'; // Adjust the import path as necessary

// Mock the FirebaseContext
const mockUpdateUserData = vi.fn();
const mockUserData = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'jane.doe@example.com',
  phone: '1234567890',
  gender: 'other',
  birthday: '1990-01-01',
  occupation: 'Engineer',
  jobsSeeking: 'Software Developer',
  skills: 'JavaScript, React',
  createdAt: new Date('2021-01-01T00:00:00Z'),
  lastLogin: new Date('2021-06-01T12:00:00Z'),
};

const mockStore = configureStore({
  reducer: {
    customization: (state = { borderRadius: 12 }) => state,
  },
});

const renderWithProviders = (ui) => {
  const providerProps = {
    value: {
      userData: mockUserData,
      updateUserData: mockUpdateUserData,
    },
  };

  return render(
    <Provider store={mockStore}>
      <FirebaseContext.Provider {...providerProps}>
        <BrowserRouter>{ui}</BrowserRouter>
      </FirebaseContext.Provider>
    </Provider>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    mockUpdateUserData.mockClear();
  });

  test('All fields become editable when "Edit Profile" is clicked', async () => {
    renderWithProviders(<ProfilePage />);

    // Ensure the "Edit Profile" button is present
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    expect(editButton).toBeInTheDocument();

    // Click the "Edit Profile" button
    await userEvent.click(editButton);

    // Now, all TextFields should be in the document and editable
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const genderSelect = screen.getByLabelText(/gender/i);
    const birthdayInput = screen.getByLabelText(/birthday/i);
    const occupationInput = screen.getByLabelText(/occupation/i);
    const jobsSeekingInput = screen.getByLabelText(/jobs seeking/i);
    const skillsInput = screen.getByLabelText(/skills/i);

    // Check that all inputs are enabled (editable)
    expect(firstNameInput).toBeEnabled();
    expect(lastNameInput).toBeEnabled();
    expect(emailInput).toBeDisabled(); // Email is disabled based on your component
    expect(phoneInput).toBeEnabled();
    expect(genderSelect).toBeEnabled();
    expect(birthdayInput).toBeEnabled();
    expect(occupationInput).toBeEnabled();
    expect(jobsSeekingInput).toBeEnabled();
    expect(skillsInput).toBeEnabled();
  });

  test('Valid user information is saved successfully', async () => {
    mockUpdateUserData.mockResolvedValueOnce({ success: true });

    renderWithProviders(<ProfilePage />);

    // Click the "Edit Profile" button to make fields editable
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    await userEvent.click(editButton);

    // Update form fields
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const genderSelect = screen.getByLabelText(/gender/i);
    const birthdayInput = screen.getByLabelText(/birthday/i);
    const occupationInput = screen.getByLabelText(/occupation/i);
    const jobsSeekingInput = screen.getByLabelText(/jobs seeking/i);
    const skillsInput = screen.getByLabelText(/skills/i);

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'John');
    
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, 'Smith');
    
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '1234567890');

    // Handle Gender Select
    await userEvent.click(genderSelect); // Open the dropdown
    const maleOption = await screen.findByRole('option', { name: /other/i });
    await userEvent.click(maleOption);

    await userEvent.clear(birthdayInput);
    await userEvent.type(birthdayInput, '1990-01-01');

    await userEvent.clear(occupationInput);
    await userEvent.type(occupationInput, 'Engineer');

    await userEvent.clear(jobsSeekingInput);
    await userEvent.type(jobsSeekingInput, 'Software Developer');

    await userEvent.clear(skillsInput);
    await userEvent.type(skillsInput, 'JavaScript, React');

    // Submit the form by clicking the "Save" button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    // Wait for the updateUserData to be called
    await waitFor(() => {
      expect(mockUpdateUserData).toHaveBeenCalledTimes(1);
    });

    // Check that updateUserData was called with the updated data
    expect(mockUpdateUserData).toHaveBeenCalledWith({
      ...mockUserData,
      firstName: 'John',
      lastName: 'Smith',
      phone: '1234567890',
      gender: 'other',
      birthday: '1990-01-01',
      occupation: 'Engineer',
      jobsSeeking: 'Software Developer',
      skills: 'JavaScript, React',
    });

    // Optionally, check that the form exits edit mode
    await waitFor(() => {
      expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
    });

    // Verify that the updated information is displayed
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText(/other/i)).toBeInTheDocument();
    expect(screen.getByText('1990-01-01')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByText('JavaScript, React')).toBeInTheDocument();
  });
  test('Entered information is cleared and reverted when "Cancel" is clicked', async () => {
    renderWithProviders(<ProfilePage />);

    // Click the "Edit Profile" button to enter edit mode
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    await userEvent.click(editButton);

    // Update form fields
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const genderSelect = screen.getByLabelText(/gender/i);
    const birthdayInput = screen.getByLabelText(/birthday/i);
    const occupationInput = screen.getByLabelText(/occupation/i);
    const jobsSeekingInput = screen.getByLabelText(/jobs seeking/i);
    const skillsInput = screen.getByLabelText(/skills/i);

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Johnny');
    
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, 'Doe');
    
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '0987654321');

    // Handle Gender Select
    await userEvent.click(genderSelect); // Open the dropdown
    const femaleOption = await screen.findByRole('option', { name: /female/i });
    await userEvent.click(femaleOption);

    await userEvent.clear(birthdayInput);
    await userEvent.type(birthdayInput, '1992-02-02');

    await userEvent.clear(occupationInput);
    await userEvent.type(occupationInput, 'Designer');

    await userEvent.clear(jobsSeekingInput);
    await userEvent.type(jobsSeekingInput, 'UI/UX Designer');

    await userEvent.clear(skillsInput);
    await userEvent.type(skillsInput, 'Figma, Sketch');

    // Click the "Cancel" button to revert changes
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    // Ensure edit mode is exited
    expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();

    // Verify that the original information is displayed
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText(/other/i)).toBeInTheDocument();
    expect(screen.getByText('1990-01-01')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByText('JavaScript, React')).toBeInTheDocument();

    // Ensure that updateUserData was not called
    expect(mockUpdateUserData).not.toHaveBeenCalled();
  });
});
// src/views/job-page/job-detail.test.jsx

import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FirebaseContext } from 'contexts/FirebaseContext';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as FirestoreAPI from '../../contexts/FirestoreAPI'; // Adjust the path as needed
import JobDetail from './job-detail';

// Mock FirestoreAPI functions
vi.mock('../../contexts/FirestoreAPI');

const mockStore = configureStore({
  reducer: {
    customization: (state = { borderRadius: 12 }) => state,
    // Add other reducers if necessary
  },
});

const mockLogin = vi.fn();

// Utility function to render with providers
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

describe('JobDetail Component', () => {
  const providerProps = {
    value: {
      login: mockLogin,
      googleSignIn: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders JobDetail component correctly', async () => {
    // Mock API responses
    FirestoreAPI.getJobDetails.mockResolvedValue({
      id: 'job123',
      name: 'Software Engineer',
      company: 'Tech Corp',
      description: 'Develop and maintain software applications.',
      references: 'https://techcorp.com/jobs/123',
      related_skill: ['skill1', 'skill2'],
      events: 'Interview scheduled',
      status: '0',
      note: 'Urgent hire',
    });

    FirestoreAPI.getAllSkills.mockResolvedValue([
      { id: 'skill1', name: 'JavaScript', status: 0 },
      { id: 'skill2', name: 'React', status: 0 },
    ]);

    // Mock sessionStorage
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation((key) => {
      const store = {
        userId: 'user123',
        jobId: 'job123',
      };
      return store[key] || null;
    });

    renderWithProviders(<JobDetail />, { providerProps });

    // Wait for loading to finish
    // expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    // Wait for job details to load
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/tech corp/i)).toBeInTheDocument();
      expect(screen.getByText(/develop and maintain software applications/i)).toBeInTheDocument();
    });
  });

  test('enters edit mode and updates job details', async () => {
    // Mock API responses
    FirestoreAPI.getJobDetails.mockResolvedValue({
      id: 'job123',
      name: 'Software Engineer',
      company: 'Tech Corp',
      description: 'Develop and maintain software applications.',
      references: 'https://techcorp.com/jobs/123',
      related_skill: ['skill1', 'skill2'],
      events: 'Interview scheduled',
      status: '0',
      note: 'Urgent hire',
    });

    FirestoreAPI.getAllSkills.mockResolvedValue([
      { id: 'skill1', name: 'JavaScript', status: 0 },
      { id: 'skill2', name: 'React', status: 0 },
    ]);

    FirestoreAPI.updateJob.mockResolvedValue({ success: true });

    // Mock sessionStorage
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation((key) => {
      const store = {
        userId: 'user123',
        jobId: 'job123',
      };
      return store[key] || null;
    });

    renderWithProviders(<JobDetail />, { providerProps });

    // Wait for job details to load
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    // Click the "Edit" button to enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Check that form fields are editable
    const nameInput = screen.getByLabelText(/name/i);
    const companyInput = screen.getByLabelText(/company/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const referencesInput = screen.getByLabelText(/references/i);
    const statusSelect = screen.getByLabelText(/status/i);
    const noteInput = screen.getByLabelText(/note/i);

    expect(nameInput).toBeEnabled();
    expect(companyInput).toBeEnabled();
    expect(descriptionInput).toBeEnabled();
    expect(referencesInput).toBeEnabled();
    expect(statusSelect).toBeEnabled();
    expect(noteInput).toBeEnabled();

    // Update form fields
    fireEvent.change(nameInput, { target: { value: 'Senior Software Engineer' } });
    fireEvent.change(companyInput, { target: { value: 'Innovatech' } });
    fireEvent.change(descriptionInput, { target: { value: 'Lead development teams.' } });
    fireEvent.change(referencesInput, { target: { value: 'https://innovatech.com/jobs/456' } });
    fireEvent.change(statusSelect, { target: { value: '1' } }); // Assuming '1' is a valid status
    fireEvent.change(noteInput, { target: { value: 'Promoted position' } });

    // Click the "Save" button
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    // Wait for updateJob to be called
    await waitFor(() => {
      expect(FirestoreAPI.updateJob).toHaveBeenCalledWith('user123', 'job123', {
        name: 'Senior Software Engineer',
        company: 'Innovatech',
        description: 'Lead development teams.',
        references: 'https://innovatech.com/jobs/456',
        related_skill: ['skill1', 'skill2'],
        events: 'Interview scheduled',
        status: '1',
        note: 'Promoted position',
      });
    });

    // Verify that updated information is displayed
    await waitFor(() => {
      expect(screen.getByText(/senior software engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/innovatech/i)).toBeInTheDocument();
      expect(screen.getByText(/lead development teams/i)).toBeInTheDocument();
      expect(screen.getByText(/https:\/\/innovatech\.com\/jobs\/456/i)).toBeInTheDocument();
      expect(screen.getByText(/promoted position/i)).toBeInTheDocument();
    });
  });

  test('adds a new skill to the job', async () => {
    // Mock API responses
    FirestoreAPI.getJobDetails.mockResolvedValue({
      id: 'job123',
      name: 'Software Engineer',
      company: 'Tech Corp',
      description: 'Develop and maintain software applications.',
      references: 'https://techcorp.com/jobs/123',
      related_skill: ['skill1'],
      events: 'Interview scheduled',
      status: '0',
      note: 'Urgent hire',
    });

    FirestoreAPI.getAllSkills.mockResolvedValue([
      { id: 'skill1', name: 'JavaScript', status: 0 },
      { id: 'skill2', name: 'React', status: 0 },
      { id: 'skill3', name: 'TypeScript', status: 0 },
    ]);

    FirestoreAPI.addSkill.mockResolvedValue({ skillId: 'skill3' });
    FirestoreAPI.updateSkill.mockResolvedValue({ success: true });

    // Mock sessionStorage
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation((key) => {
      const store = {
        userId: 'user123',
        jobId: 'job123',
      };
      return store[key] || null;
    });

    renderWithProviders(<JobDetail />, { providerProps });

    // Wait for job details to load
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    // Select a new skill from the dropdown
    const dropdown = screen.getByLabelText(/add other required skills/i);
    fireEvent.change(dropdown, { target: { value: 'skill3' } });

    // Verify that addSkill and updateSkill are called
    await waitFor(() => {
      expect(FirestoreAPI.addSkill).toHaveBeenCalledWith('user123', {
        skillId: 'skill3',
        jobId: 'job123',
      });
      expect(FirestoreAPI.updateSkill).toHaveBeenCalledWith('user123', 'skill3', {
        related_job: [{ id: 'job123', name: 'Software Engineer' }],
      });
    });

    // Verify that the new skill is displayed
    await waitFor(() => {
      expect(screen.getByText(/typescript/i)).toBeInTheDocument();
    });
  });

  test('deletes a skill from the job', async () => {
    // Mock API responses
    FirestoreAPI.getJobDetails.mockResolvedValue({
      id: 'job123',
      name: 'Software Engineer',
      company: 'Tech Corp',
      description: 'Develop and maintain software applications.',
      references: 'https://techcorp.com/jobs/123',
      related_skill: ['skill1', 'skill2'],
      events: 'Interview scheduled',
      status: '0',
      note: 'Urgent hire',
    });

    FirestoreAPI.getAllSkills.mockResolvedValue([
      { id: 'skill1', name: 'JavaScript', status: 0 },
      { id: 'skill2', name: 'React', status: 0 },
    ]);

    FirestoreAPI.deleteSkill.mockResolvedValue({ success: true });
    FirestoreAPI.updateSkill.mockResolvedValue({ success: true });

    // Mock sessionStorage
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation((key) => {
      const store = {
        userId: 'user123',
        jobId: 'job123',
      };
      return store[key] || null;
    });

    renderWithProviders(<JobDetail />, { providerProps });

    // Wait for job details to load
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    // Find the skill to delete
    const skillChip = screen.getByText(/react/i);
    const deleteButton = skillChip.nextSibling; // Assuming the delete button is next to the chip

    // Click the delete button
    fireEvent.click(deleteButton);

    // Verify that deleteSkill and updateSkill are called
    await waitFor(() => {
      expect(FirestoreAPI.deleteSkill).toHaveBeenCalledWith('user123', 'skill2');
      expect(FirestoreAPI.updateSkill).toHaveBeenCalledWith('user123', 'skill2', {
        related_job: [], // Assuming related_job should be emptied
      });
    });

    // Verify that the skill is removed from the UI
    await waitFor(() => {
      expect(screen.queryByText(/react/i)).not.toBeInTheDocument();
    });
  });

  test('discards deletion when deleting a skill', async () => {
    // Mock API responses
    FirestoreAPI.getJobDetails.mockResolvedValue({
      id: 'job123',
      name: 'Software Engineer',
      company: 'Tech Corp',
      description: 'Develop and maintain software applications.',
      references: 'https://techcorp.com/jobs/123',
      related_skill: ['skill1', 'skill2'],
      events: 'Interview scheduled',
      status: '0',
      note: 'Urgent hire',
    });

    FirestoreAPI.getAllSkills.mockResolvedValue([
      { id: 'skill1', name: 'JavaScript', status: 0 },
      { id: 'skill2', name: 'React', status: 0 },
    ]);

    // Mock sessionStorage
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation((key) => {
      const store = {
        userId: 'user123',
        jobId: 'job123',
      };
      return store[key] || null;
    });

    renderWithProviders(<JobDetail />, { providerProps });

    // Wait for job details to load
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    // Find the skill to delete
    const skillChip = screen.getByText(/react/i);
    const deleteButton = skillChip.nextSibling; // Assuming the delete button is next to the chip

    // Mock window.confirm to simulate user discarding the deletion
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    // Click the delete button
    fireEvent.click(deleteButton);

    // Verify that deleteSkill and updateSkill are not called
    await waitFor(() => {
      expect(FirestoreAPI.deleteSkill).not.toHaveBeenCalled();
      expect(FirestoreAPI.updateSkill).not.toHaveBeenCalled();
    });

    // Verify that the skill is still present
    expect(screen.getByText(/react/i)).toBeInTheDocument();
  });

  test('handles save failure gracefully', async () => {
    // Mock API responses
    FirestoreAPI.getJobDetails.mockResolvedValue({
      id: 'job123',
      name: 'Software Engineer',
      company: 'Tech Corp',
      description: 'Develop and maintain software applications.',
      references: 'https://techcorp.com/jobs/123',
      related_skill: ['skill1', 'skill2'],
      events: 'Interview scheduled',
      status: '0',
      note: 'Urgent hire',
    });

    FirestoreAPI.getAllSkills.mockResolvedValue([
      { id: 'skill1', name: 'JavaScript', status: 0 },
      { id: 'skill2', name: 'React', status: 0 },
    ]);

    FirestoreAPI.updateJob.mockRejectedValue(new Error('Failed to update job'));

    // Mock sessionStorage
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation((key) => {
      const store = {
        userId: 'user123',
        jobId: 'job123',
      };
      return store[key] || null;
    });

    renderWithProviders(<JobDetail />, { providerProps });

    // Wait for job details to load
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    // Click the "Edit" button to enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Update form fields
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Senior Software Engineer' } });

    // Click the "Save" button
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    // Wait for updateJob to be called and fail
    await waitFor(() => {
      expect(FirestoreAPI.updateJob).toHaveBeenCalledWith('user123', 'job123', expect.any(Object));
    });

    // Verify that an error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/an error occurred while saving the job/i)).toBeInTheDocument();
    });

    // Ensure the form remains in edit mode
    expect(screen.getByLabelText(/name/i)).toBeEnabled();
  });

  // Add more tests as needed for other functionalities
});
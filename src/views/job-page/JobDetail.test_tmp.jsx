import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import JobDetail from './job-detail.jsx';
import * as FirestoreAPI from '../../contexts/FirestoreAPI';

// Mock store configuration
const mockStore = configureStore({
  reducer: {
    customization: (state = { borderRadius: 12 }) => state,
  },
});

const renderWithProviders = (ui) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

// Mock FirestoreAPI
vi.mock('../../contexts/FirestoreAPI', () => ({
  getJobDetails: vi.fn(),
  getAllSkills: vi.fn(),
  deleteJob: vi.fn(),
  addJob: vi.fn(),
  updateJob: vi.fn(),
  getSkillDetails: vi.fn(),
  updateSkill: vi.fn(),
}));

describe('JobDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('userId', 'test-user');
    sessionStorage.setItem('jobId', '1');
  });

  test('Displays loading state and fetches job details', async () => {
    FirestoreAPI.getJobDetails.mockResolvedValueOnce({
      name: 'Test Job',
      company: 'Test Company',
      description: 'Test Description',
      references: 'Test References',
      related_skill: [],
      events: 'Test Events',
      status: '0',
      note: 'Test Note',
    });
    FirestoreAPI.getAllSkills.mockResolvedValueOnce([]);

    renderWithProviders(<JobDetail />);

    // Verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Verify job details are displayed
    expect(screen.getByText(/test job/i)).toBeInTheDocument();
    expect(screen.getByText(/test company/i)).toBeInTheDocument();
  });

  test('Allows editing and saving job details', async () => {
    FirestoreAPI.getJobDetails.mockResolvedValueOnce({
      name: 'Old Job Name',
      company: 'Old Company',
      description: 'Old Description',
      references: 'Old References',
      related_skill: [],
      events: 'Old Events',
      status: '0',
      note: 'Old Note',
    });
    FirestoreAPI.updateJob.mockResolvedValueOnce(true);

    renderWithProviders(<JobDetail />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const editButton = screen.getByText(/edit/i);
    await userEvent.click(editButton);

    const nameInput = screen.getByDisplayValue(/old job name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Job Name');

    const saveButton = screen.getByText(/save all/i);
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(FirestoreAPI.updateJob).toHaveBeenCalledWith(
        'test-user',
        '1',
        expect.objectContaining({ name: 'New Job Name' })
      );
    });
  });

  test('Handles skill addition', async () => {
    FirestoreAPI.getJobDetails.mockResolvedValueOnce({
      name: 'Test Job',
      related_skill: [],
    });
    FirestoreAPI.getAllSkills.mockResolvedValueOnce([
      { id: '1', company: 'Test Company', description: 'A job to be deleted', related_skill: [], status: '0',name: 'Skill 1'},
    ]);
    FirestoreAPI.getSkillDetails.mockResolvedValueOnce({
      related_job: [],
    });

    renderWithProviders(<JobDetail />);

    // Wait for skills to load
    await waitFor(() => {
      expect(screen.getByText(/test job/i)).toBeInTheDocument();
    });

    const skillDropdown = screen.getByLabelText(/add other required skills:/i);
    await userEvent.selectOptions(skillDropdown, '1');

    await waitFor(() => {
      expect(FirestoreAPI.updateJob).toHaveBeenCalledWith(
        'test-user',
        '1',
        expect.objectContaining({
          related_skill: ['1'],
        })
      );
    });
  });

  test('Handles job deletion', async () => {
    FirestoreAPI.getJobDetails.mockResolvedValueOnce({
      id: '1',
      company: 'Test Company',
      description: 'A job to be deleted',
      related_skill: [],
      status: '0',
    });
    FirestoreAPI.deleteJob.mockResolvedValueOnce(1);

    renderWithProviders(<JobDetail />);

    // Wait for job to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/delete/i);
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(FirestoreAPI.deleteJob).toHaveBeenCalledWith('test-user', '1');
    });
    expect(mockNavigate).toHaveBeenCalledWith('../job-page');
  });
});

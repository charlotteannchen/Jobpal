import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import JobPage from './index.jsx'; // Adjust the path as necessary
import * as FirestoreAPI from '../../contexts/FirestoreAPI'; // Mock FirestoreAPI

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

vi.mock('../../contexts/FirestoreAPI', () => ({
  getAllJobs: vi.fn(),
}));

describe('JobPage', () => {
  beforeEach(() => {
    FirestoreAPI.getAllJobs.mockClear();
    sessionStorage.clear();
  });

  test('Displays loading state and fetches job data', async () => {
    FirestoreAPI.getAllJobs.mockResolvedValueOnce([
      { id: '1', name: 'Frontend Developer', status: '0' },
      { id: '2', name: 'Backend Developer', status: '1' },
    ]);

    renderWithProviders(<JobPage />);

    // Verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Verify job data is displayed
    expect(screen.getByText(/frontend developer/i)).toBeInTheDocument();
    expect(screen.getByText(/backend developer/i)).toBeInTheDocument();
  });

  test('Displays error state if job data fails to load', async () => {
    FirestoreAPI.getAllJobs.mockRejectedValueOnce(new Error('Failed to fetch jobs'));

    renderWithProviders(<JobPage />);

    // Verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });

    // Verify error message
    expect(screen.getByText(/failed to fetch jobs/i)).toBeInTheDocument();
  });

  test('Redirects to job detail page when a job is clicked', async () => {
    FirestoreAPI.getAllJobs.mockResolvedValueOnce([
      { id: '1', name: 'Frontend Developer', status: '0' },
    ]);

    renderWithProviders(<JobPage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/frontend developer/i)).toBeInTheDocument();
    });

    // Simulate clicking the job
    const jobBox = screen.getByText(/frontend developer/i);
    await userEvent.click(jobBox);

    // Verify sessionStorage is updated
    expect(sessionStorage.getItem('jobId')).toBe('1');
  });

  test('Displays jobs under correct categories', async () => {
    FirestoreAPI.getAllJobs.mockResolvedValueOnce([
      { id: '1', name: 'Frontend Developer', status: '0' },
      { id: '2', name: 'Backend Developer', status: '1' },
      { id: '3', name: 'QA Engineer', status: '2' },
      { id: '4', name: 'UI Designer', status: '3' },
      { id: '5', name: 'DevOps Engineer', status: '4' },
    ]);

    renderWithProviders(<JobPage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/frontend developer/i)).toBeInTheDocument();
    });

    // Verify jobs under each category
    expect(screen.getByText(/frontend developer/i)).toBeInTheDocument(); // Listed
    expect(screen.getByText(/backend developer/i)).toBeInTheDocument(); // Learning
    expect(screen.getByText(/qa engineer/i)).toBeInTheDocument(); // Applied
    expect(screen.getByText(/ui designer/i)).toBeInTheDocument(); // Interviewing
    expect(screen.getByText(/devops engineer/i)).toBeInTheDocument(); // Finished
  });

  test('Adds a new job when "+" is clicked', async () => {
    FirestoreAPI.getAllJobs.mockResolvedValueOnce([]);

    renderWithProviders(<JobPage />);

    // Wait for data to load
    await waitFor(() => {
        const addButton = screen.getByTestId("add-listed-job");
        expect(addButton).toBeInTheDocument();
      });

    // Simulate clicking the "+" button
    const addButton = screen.getByTestId('add-listed-job');
    await userEvent.click(addButton);

    // Verify sessionStorage is updated with placeholder jobId
    expect(sessionStorage.getItem('jobId')).toBe(null);
    expect(window.location.pathname).toBe('/job-detail');
  }
  
);
});

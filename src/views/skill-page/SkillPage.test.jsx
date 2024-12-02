import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SkillPage from './index.jsx'; //  
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

// Mock FirestoreAPI
vi.mock('../../contexts/FirestoreAPI', () => ({
  getAllSkills: vi.fn(),
}));

describe('SkillPage', () => {
  beforeEach(() => {
    FirestoreAPI.getAllSkills.mockClear();
    sessionStorage.clear();
  });

  test('Displays loading state and fetches skill data', async () => {
    FirestoreAPI.getAllSkills.mockResolvedValueOnce([
      { id: '1', name: 'JavaScript', status: 0 },
      { id: '2', name: 'Python', status: 1 },
    ]);

    renderWithProviders(<SkillPage />);

    // Verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Verify skill data is displayed
    expect(screen.getByText(/javascript/i)).toBeInTheDocument();
    expect(screen.getByText(/python/i)).toBeInTheDocument();
  });

  test('Displays error state if skill data fails to load', async () => {
    FirestoreAPI.getAllSkills.mockRejectedValueOnce(new Error('Failed to fetch skills'));

    renderWithProviders(<SkillPage />);

    // Verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });

    // Verify error message
    expect(screen.getByText(/failed to fetch skills/i)).toBeInTheDocument();
  });

  test('Redirects to skill detail page when a skill is clicked', async () => {
    FirestoreAPI.getAllSkills.mockResolvedValueOnce([
      { id: '1', name: 'JavaScript', status: 0 },
    ]);

    renderWithProviders(<SkillPage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/javascript/i)).toBeInTheDocument();
    });

    // Simulate clicking the skill
    const skillBox = screen.getByText(/javascript/i);
    await userEvent.click(skillBox);

    // Verify sessionStorage is updated
    expect(sessionStorage.getItem('skillId')).toBe('1');
  });

  test('Displays skills under correct categories', async () => {
    FirestoreAPI.getAllSkills.mockResolvedValueOnce([
      { id: '1', name: 'JavaScript', status: 0 },
      { id: '2', name: 'Python', status: 1 },
    ]);

    renderWithProviders(<SkillPage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/javascript/i)).toBeInTheDocument();
    });

    // Verify skills under each category
    expect(screen.getByText(/javascript/i)).toBeInTheDocument(); // In progress
    expect(screen.getByText(/python/i)).toBeInTheDocument(); // Finished
  });

  test('Adds a new skill when "+" is clicked', async () => {
    FirestoreAPI.getAllSkills.mockResolvedValueOnce([
      { id: '1', name: 'JavaScript', status: 0 },
    ]);
  
    renderWithProviders(<SkillPage />);
  
    // Wait for the "In progress" add button to render
    const addButtonInProgress = await screen.findByTestId('inprogress-skill');
    expect(addButtonInProgress).toBeInTheDocument();
  
    // Simulate clicking the "+" button
    await userEvent.click(addButtonInProgress);
  
    // Verify sessionStorage is updated with placeholder skillId
    expect(sessionStorage.getItem('skillId')).toBe(null);
    expect(window.location.pathname).toBe('/skill-detail');
  });
});

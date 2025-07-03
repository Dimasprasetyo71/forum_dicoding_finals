import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeToggle from './ThemeToggle';
import ThemeContext  from '../../contexts/ThemeContext';
import type { ThemeContextType } from '../../types';
import '@testing-library/jest-dom';
describe('ThemeToggle', () => {
  it('renders light theme and toggles to dark', () => {
    const toggleThemeMock = vi.fn();
    const mockValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: toggleThemeMock,
    };

    const { getByText } = render(
      <ThemeContext.Provider value={mockValue}>
        <ThemeToggle />
      </ThemeContext.Provider>
    );

    expect(getByText('Go Dark')).toBeInTheDocument();
    fireEvent.click(getByText('Go Dark'));
    expect(toggleThemeMock).toHaveBeenCalled();
  });
});

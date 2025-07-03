import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FlagIcon } from './FlagIcon';
import '@testing-library/jest-dom';

describe('FlagIcon', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<FlagIcon code="ID" />);
    expect(getByTestId('flag-icon')).toBeInTheDocument();
  });
});

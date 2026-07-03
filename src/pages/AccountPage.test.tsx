import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccountPage } from './AccountPage';

describe('AccountPage', () => {
  it('renders a placeholder heading', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /conta/i })).toBeInTheDocument();
  });
});

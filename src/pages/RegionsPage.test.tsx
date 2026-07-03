import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RegionsPage } from './RegionsPage';

describe('RegionsPage', () => {
  it('renders a placeholder heading', () => {
    render(<RegionsPage />);

    expect(screen.getByRole('heading', { name: /regiões/i })).toBeInTheDocument();
  });
});

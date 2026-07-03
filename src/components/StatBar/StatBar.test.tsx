import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatBar } from './StatBar';

describe('StatBar', () => {
  it('renders the label and numeric value, and fills proportionally to max', () => {
    render(<StatBar label="hp" value={45} max={255} />);

    expect(screen.getByText('hp')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    const fill = screen.getByTestId('stat-bar-fill');
    expect(fill).toHaveStyle({ width: `${(45 / 255) * 100}%` });
  });
});

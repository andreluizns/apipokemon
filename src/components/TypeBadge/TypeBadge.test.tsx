import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TypeBadge } from './TypeBadge';

describe('TypeBadge', () => {
  it('renders the pt-BR label and an icon for a known type', () => {
    const { container } = render(<TypeBadge type="grass" />);

    expect(screen.getByText('Grama')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('renders without an icon for a type with no icon asset', () => {
    const { container } = render(<TypeBadge type="ice" />);

    expect(screen.getByText('Gelo')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });
});

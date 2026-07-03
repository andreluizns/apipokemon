import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNav } from './BottomNav';

describe('BottomNav', () => {
  it('renders links to pokedex, regions, favorites and account', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /pokédex/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /regiões/i })).toHaveAttribute('href', '/regioes');
    expect(screen.getByRole('link', { name: /favoritos/i })).toHaveAttribute('href', '/favoritos');
    expect(screen.getByRole('link', { name: /conta/i })).toHaveAttribute('href', '/conta');
  });

  it('shows the label for the active route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BottomNav />
      </MemoryRouter>
    );

    expect(screen.getByText('Pokédex')).toBeVisible();
  });
});

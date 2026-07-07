import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FavoriteHeartIcon } from './FavoriteHeartIcon';

describe('FavoriteHeartIcon', () => {
  it('renders a filled heart when active', () => {
    const { container } = render(<FavoriteHeartIcon active />);

    expect(container.querySelector('path')).toHaveAttribute('fill', 'white');
  });

  it('renders an outline heart when inactive', () => {
    const { container } = render(<FavoriteHeartIcon active={false} />);

    expect(container.querySelector('path')).toHaveAttribute('fill', 'none');
  });
});

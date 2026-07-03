import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoadMoreButton } from './LoadMoreButton';

describe('LoadMoreButton', () => {
  it('renders "Carregar mais" and calls onClick when hasMore is true', async () => {
    const onClick = vi.fn();
    render(<LoadMoreButton hasMore isLoading={false} onClick={onClick} />);

    await userEvent.click(screen.getByRole('button', { name: /carregar mais/i }));
    expect(onClick).toHaveBeenCalled();
  });

  it('shows a loading label while isLoading is true', () => {
    render(<LoadMoreButton hasMore isLoading onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveTextContent(/carregando/i);
  });

  it('renders nothing when hasMore is false', () => {
    const { container } = render(<LoadMoreButton hasMore={false} isLoading={false} onClick={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});

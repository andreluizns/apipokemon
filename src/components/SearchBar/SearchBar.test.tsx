import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

function TestWrapper({ onChangeSpy }: { onChangeSpy: (value: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <SearchBar
      value={value}
      onChange={(next) => {
        onChangeSpy(next);
        setValue(next);
      }}
    />
  );
}

describe('SearchBar', () => {
  it('shows the current value and calls onChange as the user types', async () => {
    const onChangeSpy = vi.fn();
    render(<TestWrapper onChangeSpy={onChangeSpy} />);

    const input = screen.getByPlaceholderText('Procurar Pokémon...') as HTMLInputElement;
    await userEvent.type(input, 'pika');

    expect(onChangeSpy).toHaveBeenCalledTimes(4);
    expect(input.value).toBe('pika');
  });
});

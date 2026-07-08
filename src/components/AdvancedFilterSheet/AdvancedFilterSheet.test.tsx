import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdvancedFilterSheet } from './AdvancedFilterSheet';

const emptyRange = { minHeight: null, maxHeight: null, minWeight: null, maxWeight: null, generation: null };

describe('AdvancedFilterSheet', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <AdvancedFilterSheet isOpen={false} value={emptyRange} onApply={vi.fn()} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onApply with parsed numeric bounds and selected generation', async () => {
    const onApply = vi.fn();
    render(<AdvancedFilterSheet isOpen value={emptyRange} onApply={onApply} onClose={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Altura mínima (m)'), '0.5');
    await userEvent.type(screen.getByLabelText('Altura máxima (m)'), '2');
    await userEvent.selectOptions(screen.getByLabelText('Geração'), 'generation-i');
    await userEvent.click(screen.getByRole('button', { name: /aplicar/i }));

    expect(onApply).toHaveBeenCalledWith({
      minHeight: 5,
      maxHeight: 20,
      minWeight: null,
      maxWeight: null,
      generation: 'generation-i',
    });
  });

  it('converts weight input in kg to hectograms for onApply', async () => {
    const onApply = vi.fn();
    render(<AdvancedFilterSheet isOpen value={emptyRange} onApply={onApply} onClose={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Peso mínimo (kg)'), '6.9');
    await userEvent.click(screen.getByRole('button', { name: /aplicar/i }));

    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ minWeight: 69 }));
  });

  it('displays stored dm/hg values converted to m/kg', () => {
    render(
      <AdvancedFilterSheet
        isOpen
        value={{ minHeight: 7, maxHeight: null, minWeight: 69, maxWeight: null, generation: null }}
        onApply={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Altura mínima (m)')).toHaveValue(0.7);
    expect(screen.getByLabelText('Peso mínimo (kg)')).toHaveValue(6.9);
  });

  it('closes without applying when the backdrop is clicked', async () => {
    const onApply = vi.fn();
    const onClose = vi.fn();
    render(<AdvancedFilterSheet isOpen value={emptyRange} onApply={onApply} onClose={onClose} />);

    await userEvent.click(screen.getByRole('dialog').parentElement!);

    expect(onClose).toHaveBeenCalled();
    expect(onApply).not.toHaveBeenCalled();
  });

  it('does not close when clicking inside the sheet outside a control', async () => {
    const onClose = vi.fn();
    render(<AdvancedFilterSheet isOpen value={emptyRange} onApply={vi.fn()} onClose={onClose} />);

    await userEvent.click(screen.getByText('Filtros avançados'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(<AdvancedFilterSheet isOpen value={emptyRange} onApply={vi.fn()} onClose={onClose} />);

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('discards edits made before canceling when reopened with the same value', async () => {
    const onApply = vi.fn();

    function Wrapper() {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <>
          <button type="button" onClick={() => setIsOpen(true)}>reabrir</button>
          <AdvancedFilterSheet
            isOpen={isOpen}
            value={emptyRange}
            onApply={onApply}
            onClose={() => setIsOpen(false)}
          />
        </>
      );
    }
    render(<Wrapper />);

    await userEvent.type(screen.getByLabelText('Altura mínima (m)'), '0.5');
    await userEvent.click(screen.getByRole('dialog').parentElement!);

    await userEvent.click(screen.getByRole('button', { name: 'reabrir' }));

    expect(screen.getByLabelText('Altura mínima (m)')).toHaveValue(null);

    await userEvent.click(screen.getByRole('button', { name: /aplicar/i }));

    expect(onApply).toHaveBeenLastCalledWith(emptyRange);
  });
});

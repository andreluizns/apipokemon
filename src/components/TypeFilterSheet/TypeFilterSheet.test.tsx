import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TypeFilterSheet } from './TypeFilterSheet';

describe('TypeFilterSheet', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <TypeFilterSheet isOpen={false} selectedType={null} onSelect={vi.fn()} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('lists "Todos os tipos" plus all 18 types with Portuguese labels', () => {
    render(<TypeFilterSheet isOpen selectedType={null} onSelect={vi.fn()} onClose={vi.fn()} />);

    expect(screen.getByText('Selecione o tipo')).toBeInTheDocument();
    expect(screen.getByText('Todos os tipos')).toBeInTheDocument();
    expect(screen.getByText('Água')).toBeInTheDocument();
    expect(screen.getByText('Dragão')).toBeInTheDocument();
    expect(screen.getByText('Fada')).toBeInTheDocument();
  });

  it('calls onSelect with the type name and onClose when a type is picked', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<TypeFilterSheet isOpen selectedType={null} onSelect={onSelect} onClose={onClose} />);

    await userEvent.click(screen.getByText('Fogo'));

    expect(onSelect).toHaveBeenCalledWith('fire');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onSelect with null when "Todos os tipos" is picked', async () => {
    const onSelect = vi.fn();
    render(<TypeFilterSheet isOpen selectedType="fire" onSelect={onSelect} onClose={vi.fn()} />);

    await userEvent.click(screen.getByText('Todos os tipos'));

    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('closes when the backdrop is clicked', async () => {
    const onClose = vi.fn();
    render(<TypeFilterSheet isOpen selectedType={null} onSelect={vi.fn()} onClose={onClose} />);

    await userEvent.click(screen.getByRole('dialog').parentElement!);

    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when clicking inside the sheet outside a button', async () => {
    const onClose = vi.fn();
    render(<TypeFilterSheet isOpen selectedType={null} onSelect={vi.fn()} onClose={onClose} />);

    await userEvent.click(screen.getByText('Selecione o tipo'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(<TypeFilterSheet isOpen selectedType={null} onSelect={vi.fn()} onClose={onClose} />);

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });
});

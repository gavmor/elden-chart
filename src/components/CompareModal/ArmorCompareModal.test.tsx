import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EquipmentCompareModal from './EquipmentCompareModal';
import { mockCustomSet } from './test-fixtures';

describe('EquipmentCompareModal', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <EquipmentCompareModal isOpen={false} onClose={() => {}} customSet={[]} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders the modal when isOpen is true', () => {
    render(
      <EquipmentCompareModal isOpen={true} onClose={() => {}} customSet={[]} />
    );
    expect(screen.getByText('Equipment Set Comparison')).toBeInTheDocument();
  });

  it('shows empty state when customSet is empty', () => {
    render(
      <EquipmentCompareModal isOpen={true} onClose={() => {}} customSet={[]} />
    );
    expect(
      screen.getByText('Your build set is empty. Click points on the plot to add equipment.')
    ).toBeInTheDocument();
  });

  it('shows the comparison table when customSet has items', () => {
    render(
      <EquipmentCompareModal isOpen={true} onClose={() => {}} customSet={mockCustomSet} />
    );
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('Damage Negation (%)')).toBeInTheDocument();
    expect(screen.getByText('Resistances & Poise')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <EquipmentCompareModal isOpen={true} onClose={onClose} customSet={[]} />
    );

    // Click on the backdrop overlay
    const overlay = screen.getByText('Equipment Set Comparison').closest('.fixed');
    await user.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when content is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <EquipmentCompareModal isOpen={true} onClose={onClose} customSet={mockCustomSet} />
    );

    // Click inside the modal content
    await user.click(screen.getByText('Equipment Set Comparison'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes via the header close button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <EquipmentCompareModal isOpen={true} onClose={onClose} customSet={[]} />
    );

    // The header has a close button
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes via the footer close button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <EquipmentCompareModal isOpen={true} onClose={onClose} customSet={[]} />
    );

    const buttons = screen.getAllByRole('button', { name: 'Close' });
    expect(buttons.length).toBeGreaterThan(0);
    await user.click(buttons[buttons.length - 1]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

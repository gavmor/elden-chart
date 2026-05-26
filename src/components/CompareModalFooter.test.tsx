import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompareModalFooter from './CompareModalFooter';

describe('CompareModalFooter', () => {
  it('renders a Close button', () => {
    render(<CompareModalFooter onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls onClose when clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<CompareModalFooter onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompareModalHeader from './CompareModalHeader';

describe('CompareModalHeader', () => {
  it('renders the title and subtitle', () => {
    render(<CompareModalHeader onClose={() => {}} />);
    expect(screen.getByText('Armor Set Comparison')).toBeInTheDocument();
    expect(
      screen.getByText('Compare stats across your selected build items side-by-side')
    ).toBeInTheDocument();
  });

  it('renders a close button that calls onClose when clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<CompareModalHeader onClose={onClose} />);

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

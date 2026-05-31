import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameToggle from './GameToggle';

describe('GameToggle', () => {
  it('renders both game options', () => {
    render(<GameToggle activeGame="elden-ring" onGameChange={() => {}} />);
    expect(screen.getByText('Elden Ring')).toBeInTheDocument();
    expect(screen.getByText('Deadlock')).toBeInTheDocument();
  });

  it('highlights the active game', () => {
    render(<GameToggle activeGame="elden-ring" onGameChange={() => {}} />);
    const eldenBtn = screen.getByRole('button', { name: /elden ring/i });
    expect(eldenBtn).toHaveAttribute('data-active', 'true');
  });

  it('calls onGameChange when clicking the inactive game', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<GameToggle activeGame="elden-ring" onGameChange={handleChange} />);
    
    const deadlockBtn = screen.getByRole('button', { name: /deadlock/i });
    await user.click(deadlockBtn);
    expect(handleChange).toHaveBeenCalledWith('deadlock');
  });

  it('does not call onGameChange when clicking the already-active game', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<GameToggle activeGame="elden-ring" onGameChange={handleChange} />);
    
    const eldenBtn = screen.getByRole('button', { name: /elden ring/i });
    await user.click(eldenBtn);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('switches active state for deadlock', () => {
    render(<GameToggle activeGame="deadlock" onGameChange={() => {}} />);
    const deadlockBtn = screen.getByRole('button', { name: /deadlock/i });
    expect(deadlockBtn).toHaveAttribute('data-active', 'true');
    
    const eldenBtn = screen.getByRole('button', { name: /elden ring/i });
    expect(eldenBtn).toHaveAttribute('data-active', 'false');
  });
});

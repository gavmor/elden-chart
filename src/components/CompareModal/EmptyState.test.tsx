import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompareModalEmptyState from './EmptyState';

describe('CompareModalEmptyState', () => {
  it('renders the empty state message', () => {
    render(<CompareModalEmptyState />);
    expect(
      screen.getByText('Your build set is empty. Click points on the plot to add equipment.')
    ).toBeInTheDocument();
  });

  it('renders a shield icon', () => {
    const { container } = render(<CompareModalEmptyState />);
    // lucide-react renders SVG elements
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

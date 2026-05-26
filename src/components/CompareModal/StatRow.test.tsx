import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompareModalStatRow from './StatRow';
import { mockCustomSet, helmItem } from './test-fixtures';

function renderRow(props: Partial<React.ComponentProps<typeof CompareModalStatRow>> = {}) {
  const defaults = {
    customSet: mockCustomSet,
    statName: 'Phy',
    label: 'Physical',
  };
  return render(
    <table>
      <tbody>
        <CompareModalStatRow {...defaults} {...props} />
      </tbody>
    </table>
  );
}

describe('CompareModalStatRow', () => {
  it('renders the label', () => {
    renderRow({ label: 'Physical' });
    expect(screen.getByText('Physical')).toBeInTheDocument();
  });

  it('renders stat values for each item', () => {
    renderRow({ statName: 'Phy' });
    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getByText('12.0')).toBeInTheDocument();
    expect(screen.getByText('3.0')).toBeInTheDocument();
  });

  it('applies custom formatValue', () => {
    renderRow({ statName: 'Immunity', formatValue: (n) => n.toFixed(0) });
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('applies labelClassName to the label cell', () => {
    const { container } = renderRow({ labelClassName: 'font-semibold' });
    const labelCell = container.querySelector('td');
    expect(labelCell).toHaveClass('font-semibold');
  });

  it('renders correct number of stat cells', () => {
    renderRow({ customSet: [helmItem], statName: 'weight' });
    const cells = screen.getAllByText(/^\d+(\.\d+)?$/);
    expect(cells).toHaveLength(1);
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompareModalWeightRow from './WeightRow';
import { mockCustomSet, helmItem, chestItem } from './test-fixtures';

function renderRow(items = mockCustomSet) {
  return render(
    <table>
      <tbody><CompareModalWeightRow customSet={items} /></tbody>
    </table>
  );
}

describe('CompareModalWeightRow', () => {
  it('renders "Weight" label', () => {
    renderRow();
    expect(screen.getByText('Weight')).toBeInTheDocument();
  });

  it('renders a cell for each item with weight formatted to 1 decimal', () => {
    renderRow();
    expect(screen.getByText('4.2')).toBeInTheDocument();
    expect(screen.getByText('11.5')).toBeInTheDocument();
    expect(screen.getByText('3.0')).toBeInTheDocument();
  });

  it('applies correct number of cells', () => {
    renderRow([helmItem]);
    expect(screen.getByText('4.2')).toBeInTheDocument();
  });

  it('highlights the lightest item (best/lowest weight) with amber text', () => {
    const { container } = renderRow();
    // gauntletsItem has the lowest weight (3.0)
    const cells = container.querySelectorAll('td');
    const bestCell = Array.from(cells).find(c => c.textContent === '3.0');
    expect(bestCell).toHaveClass('text-better');
  });

  it('shows delta cell when exactly 2 items are compared', () => {
    renderRow([helmItem, chestItem]);
    // helm=4.2, chest=11.5 → delta = +7.3
    expect(screen.getByText('+7.3')).toBeInTheDocument();
  });

  it('does not show delta cell with 3+ items', () => {
    renderRow(mockCustomSet);
    expect(screen.queryByText(/^[+-]/)).not.toBeInTheDocument();
  });
});

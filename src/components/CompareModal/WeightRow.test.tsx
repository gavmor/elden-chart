import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompareModalWeightRow from './WeightRow';
import { mockCustomSet, helmItem } from './test-fixtures';

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
});

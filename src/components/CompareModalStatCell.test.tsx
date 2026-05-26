import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompareModalStatCell from './CompareModalStatCell';

function renderCell(props: Partial<React.ComponentProps<typeof CompareModalStatCell>> = {}) {
  const defaults = { value: 10, min: 0, max: 100 };
  return render(
    <table>
      <tbody>
        <tr>
          <CompareModalStatCell {...defaults} {...props} />
        </tr>
      </tbody>
    </table>
  );
}

describe('CompareModalStatCell', () => {
  it('renders the formatted value with default toFixed(1)', () => {
    renderCell({ value: 7.5 });
    expect(screen.getByText('7.5')).toBeInTheDocument();
  });

  it('accepts a custom formatValue function', () => {
    renderCell({ value: 15, formatValue: (n) => n.toFixed(0) });
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('applies heatmap background style', () => {
    const { container } = renderCell({ value: 50, min: 0, max: 100 });
    const td = container.querySelector('td');
    expect(td).toHaveStyle({ backgroundColor: 'hsl(110, 30%, 18%)' });
  });

  it('applies inverted heatmap when invert is true', () => {
    const { container } = renderCell({ value: 90, min: 0, max: 100, invert: true });
    const td = container.querySelector('td');
    // invert=true with high value should look like low value (cool)
    expect(td).toHaveStyle({ backgroundColor: 'hsl(198, 30%, 18%)' });
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompareModalStatCell from './StatCell';

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
    expect(td).toHaveStyle({ backgroundColor: 'hsl(110, 50%, 22%)' });
  });

  it('applies inverted heatmap when invert is true', () => {
    const { container } = renderCell({ value: 90, min: 0, max: 100, invert: true });
    const td = container.querySelector('td');
    // invert=true with high value maps to low-ratio hue (toward red)
    expect(td).toHaveStyle({ backgroundColor: 'hsl(22, 50%, 22%)' });
  });

  it('renders with Frost Blue text and gold bottom glow when isBest is true', () => {
    const { container } = renderCell({ value: 100, min: 0, max: 100, isBest: true });
    const td = container.querySelector('td');
    expect(td).toHaveClass('text-better');
    expect(td!.style.boxShadow).toContain('inset');
    expect(td!.style.boxShadow).toContain('#C5A566');
  });

  it('renders with white text when isBest is false', () => {
    const { container } = renderCell({ value: 0, min: 0, max: 100, isBest: false });
    const td = container.querySelector('td');
    expect(td).toHaveClass('text-white');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompareModalItemHeader from './ItemHeader';
import { helmItem, chestItem } from './test-fixtures';

describe('CompareModalItemHeader', () => {
  it('renders the item name', () => {
    render(
      <table>
        <thead><tr><CompareModalItemHeader item={helmItem} /></tr></thead>
      </table>
    );
    expect(screen.getByText('Tree Sentinel Helm')).toBeInTheDocument();
  });

  it('renders the category badge', () => {
    render(
      <table>
        <thead><tr><CompareModalItemHeader item={helmItem} /></tr></thead>
      </table>
    );
    expect(screen.getByText('Helm')).toBeInTheDocument();
  });

  it('renders an image when item.image is set', () => {
    render(
      <table>
        <thead><tr><CompareModalItemHeader item={helmItem} /></tr></thead>
      </table>
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'http://example.com/helm.png');
    expect(img).toHaveAttribute('alt', 'Tree Sentinel Helm');
  });

  it('renders fallback icon when item.image is null', () => {
    const { container } = render(
      <table>
        <thead><tr><CompareModalItemHeader item={chestItem} /></tr></thead>
      </table>
    );
    // No img element since image is null
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    // Fallback icon is an SVG rendered by lucide-react
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('strips " Armor" suffix from category in badge', () => {
    render(
      <table>
        <thead><tr><CompareModalItemHeader item={chestItem} /></tr></thead>
      </table>
    );
    expect(screen.getByText('Chest')).toBeInTheDocument();
    expect(screen.queryByText('Chest Armor')).not.toBeInTheDocument();
  });
});

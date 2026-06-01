import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompareModalTable from './Table';
import { mockCustomSet, helmItem, chestItem } from './test-fixtures';
import type { EquipmentItem } from '../types';

describe('CompareModalTable', () => {
  it('renders section headings', () => {
    render(<CompareModalTable customSet={mockCustomSet} />);
    expect(screen.getByText('Damage Negation (%)')).toBeInTheDocument();
    expect(screen.getByText('Resistances & Poise')).toBeInTheDocument();
  });

  it('renders each item header (name)', () => {
    render(<CompareModalTable customSet={mockCustomSet} />);
    expect(screen.getByText('Tree Sentinel Helm')).toBeInTheDocument();
    expect(screen.getByText('Tree Sentinel Armor')).toBeInTheDocument();
    expect(screen.getByText('Tree Sentinel Gauntlets')).toBeInTheDocument();
  });

  it('renders the Stat column header', () => {
    render(<CompareModalTable customSet={mockCustomSet} />);
    expect(screen.getByText('Stat')).toBeInTheDocument();
  });

  it('renders weight row', () => {
    render(<CompareModalTable customSet={mockCustomSet} />);
    expect(screen.getByText('Weight')).toBeInTheDocument();
  });

  it('renders all negation stat rows', () => {
    render(<CompareModalTable customSet={mockCustomSet} />);
    expect(screen.getByText('Physical')).toBeInTheDocument();
    expect(screen.getByText('Strike')).toBeInTheDocument();
    expect(screen.getByText('Slash')).toBeInTheDocument();
    expect(screen.getByText('Pierce')).toBeInTheDocument();
    expect(screen.getByText('Magic')).toBeInTheDocument();
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Lightning')).toBeInTheDocument();
    expect(screen.getByText('Holy')).toBeInTheDocument();
  });

  it('renders all resistance stat rows', () => {
    render(<CompareModalTable customSet={mockCustomSet} />);
    expect(screen.getByText('Immunity')).toBeInTheDocument();
    expect(screen.getByText('Robustness')).toBeInTheDocument();
    expect(screen.getByText('Focus')).toBeInTheDocument();
    expect(screen.getByText('Vitality')).toBeInTheDocument();
    expect(screen.getByText('Poise')).toBeInTheDocument();
  });

  it('renders negation values formatted to 1 decimal', () => {
    render(<CompareModalTable customSet={mockCustomSet} />);
    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getByText('12.0')).toBeInTheDocument();
  });

  it('renders resistance values formatted to 0 decimals', () => {
    render(<CompareModalTable customSet={mockCustomSet} />);
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('renders with a single item', () => {
    render(<CompareModalTable customSet={[helmItem]} />);
    expect(screen.getByText('Tree Sentinel Helm')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
  });

  it('shows delta column header when exactly 2 items are compared', () => {
    render(<CompareModalTable customSet={[helmItem, chestItem]} />);
    expect(screen.getByText('Δ')).toBeInTheDocument();
  });

  it('does not show delta column header with 3+ items', () => {
    render(<CompareModalTable customSet={mockCustomSet} />);
    expect(screen.queryByText('Δ')).not.toBeInTheDocument();
  });

  it('renders Deadlock-specific headings and cost instead of damage negation and weight', () => {
    const deadlockItem: EquipmentItem = {
      id: 'dl-1',
      name: 'Restorative Locket',
      image: null,
      category: 'vitality',
      description: 'Restores health',
      weight: 500,
      kind: 'deadlock_upgrade',
      properties: [
        { name: 'BonusHealth', amount: 50 },
      ],
    };
    render(<CompareModalTable customSet={[deadlockItem]} />);
    expect(screen.getByText('Item Properties')).toBeInTheDocument();
    expect(screen.queryByText('Damage Negation (%)')).not.toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
    expect(screen.queryByText('Weight')).not.toBeInTheDocument();
  });
});

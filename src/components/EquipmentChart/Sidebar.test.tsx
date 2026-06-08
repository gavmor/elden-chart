import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { ChartDimensions } from '../domain/ChartDimensions';
import { CategoryFilter } from '../domain/CategoryFilter';
import { BuildSet } from '../domain/BuildSet';
import { SidebarProvider } from './SidebarContext';
import type { EquipmentKind } from '../types';

describe('Sidebar Axis Selectors', () => {
	const defaultProps = {
		search: '',
		onSearchChange: vi.fn(),
		dimensions: new ChartDimensions('weight', 'ehp', 'category'),
		onDimensionsChange: vi.fn(),
		statOptions: [
			{ id: 'weight', label: 'Weight', group: 'General' },
			{ id: 'ehp', label: 'Effective HP', group: 'Calculated Metrics' },
			{ id: 'ehp_per_soul', label: 'eHP / Soul', group: 'Calculated Metrics' }
		],
		traitCounts: {
			weight: 2,
			ehp: 1,
			ehp_per_soul: 1
		},
		statGroups: {
			'General': [{ id: 'weight', label: 'Weight', group: 'General' }],
			'Calculated Metrics': [
				{ id: 'ehp', label: 'Effective HP', group: 'Calculated Metrics' },
				{ id: 'ehp_per_soul', label: 'eHP / Soul', group: 'Calculated Metrics' }
			]
		},
		categoryGroups: [{ kind: 'armor' as EquipmentKind, categories: ['Helm'] }],
		categoryFilter: new CategoryFilter(),
		onCategoryFilterChange: vi.fn(),
		buildSet: new BuildSet(),
		activeGame: 'elden-ring' as const,
		showPareto: false,
		onShowParetoChange: vi.fn(),
		selectedHero: null,
		onHeroChange: vi.fn(),
		enemyAttacker: null,
		onEnemyAttackerChange: vi.fn(),
		hoveredItem: null,
		engagementDistance: 15,
		onEngagementDistanceChange: vi.fn(),
		onTargetBulletResistanceChange: vi.fn(),
		filteredData: [],
		metricFilters: {},
		metricBounds: {},
		onMetricFilterChange: vi.fn()
	};
	it('renders Calculated Metrics section in the axis selector dropdowns', () => {
		render(
			<SidebarProvider {...defaultProps}>
				<Sidebar />
			</SidebarProvider>
		);
		
		const optgroups = screen.getAllByRole('group');
		const calculatedGroup = optgroups.find(group => group.getAttribute('label') === 'Calculated Metrics');
		expect(calculatedGroup).toBeDefined();
	});

	it('allows calculated metrics to be selected for the Color theme', () => {
		render(
			<SidebarProvider {...defaultProps}>
				<Sidebar />
			</SidebarProvider>
		);
		
		const colorSelect = screen.getByRole('combobox', { name: /Color \(Point Theme\)/i });
		
		fireEvent.change(colorSelect, { target: { value: 'ehp' } });
		expect(defaultProps.onDimensionsChange).toHaveBeenCalledWith(
			expect.objectContaining({ color: 'ehp' })
		);
	});
});

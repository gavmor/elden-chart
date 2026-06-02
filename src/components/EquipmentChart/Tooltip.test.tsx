import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EquipmentChartTooltip from './Tooltip';
import type { EquipmentItem } from '../types';
import * as utils from '../utils';

describe('EquipmentChartTooltip', () => {
	const mockItem: EquipmentItem = {
		id: '1',
		name: 'Test Item',
		kind: 'deadlock_upgrade',
		category: 'vitality',
		description: '',
		weight: 1250,
		image: null,
		properties: [{ name: 'BonusHealth', amount: 500 }, { name: 'BulletResist', amount: 100 }],
	};

	it('displays Infinity symbol gracefully for infinite stats', () => {
		// Mock getItemStat to return Infinity for eHP
		vi.spyOn(utils, 'getItemStat').mockImplementation((_item, statName) => {
			if (statName === 'ehp') return Infinity;
			return 0;
		});

		render(
			<EquipmentChartTooltip
				item={mockItem}
				tooltipPos={{ x: 0, y: 0 }}
				xLabel="Effective HP"
				yLabel="Cost"
				xVar="ehp"
				yVar="weight"
				colorVar="category"
				colorMinMax={null}
			/>
		);

		// Should format Infinity as "∞" instead of "Infinity" or throwing
		const statValue = screen.getByText('∞');
		expect(statValue).toBeInTheDocument();

		vi.restoreAllMocks();
	});
});

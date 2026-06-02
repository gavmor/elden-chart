import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import EquipmentChartPlot from './Plot';
import type { EquipmentItem } from '../types';

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(callback: any) { this.callback = callback; }
  observe() { this.callback([{ contentRect: { width: 800, height: 600 } }]); }
  unobserve() {}
  disconnect() {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe('EquipmentChart Plot Active Item Indicator', () => {
	it('renders a distinct indicator for active items', () => {
		const mockData: EquipmentItem[] = [
			{ id: '1', name: 'Passive', kind: 'deadlock_upgrade', category: 'vitality', description: '', weight: 1000, properties: [{ name: 'BonusHealth', amount: 100 }], image: null, isActive: false },
			{ id: '2', name: 'Active', kind: 'deadlock_upgrade', category: 'vitality', description: '', weight: 1000, properties: [{ name: 'BonusHealth', amount: 100 }], image: null, isActive: true },
		];

		const { container } = render(
			<EquipmentChartPlot 
				filteredData={mockData} 
				xVar="weight" 
				yVar="ehp" 
				xLabel="Weight"
				yLabel="eHP"
				xLog={false}
				yLog={false}
				chartProps={null}
				colorVar="category" 
				colorMinMax={{min: 0, max: 1}} 
				hoveredItemId={null}
				showPareto={false} 
				customSet={[]} 
				onHoverItem={() => {}} 
				onLeavePlot={() => {}} 
				onClickItem={() => {}} 
			/>
		);

		// We expect SVG circles to be rendered by Plot.dot for active items.
		// Since Pareto and custom sets are disabled in this test, the only circles should be our active indicators.
		const svgs = container.querySelectorAll('svg');
		expect(svgs.length).toBeGreaterThan(0);
		
		const activeIndicators = container.querySelectorAll('circle');
		expect(activeIndicators.length).toBeGreaterThan(0);
	});

	it('applies translate transform to overlapping items', () => {
		const mockData: EquipmentItem[] = [
			{ id: '1', name: 'Item1', kind: 'armor', category: 'Helm', description: '', weight: 10, dmgNegation: [{ name: 'Phy', amount: 10 }], resistance: [], image: null, isActive: false },
			{ id: '2', name: 'Item2', kind: 'armor', category: 'Helm', description: '', weight: 10, dmgNegation: [{ name: 'Phy', amount: 10 }], resistance: [], image: null, isActive: false },
		];

		const { container } = render(
			<EquipmentChartPlot 
				filteredData={mockData} 
				xVar="weight" 
				yVar="total_negation" 
				xLabel="Weight"
				yLabel="Negation"
				xLog={false}
				yLog={false}
				chartProps={null}
				colorVar="category" 
				colorMinMax={{min: 0, max: 1}} 
				hoveredItemId={null}
				showPareto={false} 
				customSet={[]} 
				onHoverItem={() => {}} 
				onLeavePlot={() => {}} 
				onClickItem={() => {}} 
			/>
		);

		const images = container.querySelectorAll('image');
		expect(images.length).toBe(2);
		
		// The second image should have a translate transform because it overlaps with the first
		const transform1 = images[0].getAttribute('transform') || '';
		const transform2 = images[1].getAttribute('transform') || '';
		
		// At least one of them should have a translate applied due to identical stats
		expect(transform1.includes('translate') || transform2.includes('translate')).toBe(true);
	});
});

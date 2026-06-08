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
				chartProps={null}
				colorVar="category" 
				colorMinMax={{min: 0, max: 1}} 
				showPareto={false} 
				customSet={[]} 
				onHoverItem={() => {}} 
				onLeavePlot={() => {}} 
				onClickItem={() => {}} 
			/>
		);

		// We expect SVG text elements with ⚡ to be rendered by Plot.text for active items.
		const svgs = container.querySelectorAll('svg');
		expect(svgs.length).toBeGreaterThan(0);
		
		const activeIndicators = Array.from(container.querySelectorAll('text')).filter(t => t.textContent === '⚡');
		expect(activeIndicators.length).toBeGreaterThan(0);
	});
});

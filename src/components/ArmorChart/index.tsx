import React, { useState, useMemo, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

import type { ArmorItem, StatKey, ActiveCategories, ColorKey } from '../types';
import { CATEGORIES, STAT_OPTIONS } from '../types';
import ArmorChartHeader from './Header';
import ArmorChartSidebar from './Sidebar';
import ArmorChartPlot from './Plot';
import ArmorChartTooltip from './Tooltip';
import ArmorCompareModal from '../CompareModal/ArmorCompareModal';
import { getItemStat } from '../utils';

// Import our generated GraphQL document compiler
// @ts-ignore
import { graphql } from '../../gql/gql';

const GET_ARMOR_PAGE = graphql(/* GraphQL */ `
  query GetArmorPage($page: Int!, $limit: Int!) {
    armor(page: $page, limit: $limit) {
      id
      name
      image
      description
      category
      weight
      dmgNegation {
        name
        amount
      }
      resistance {
        name
        amount
      }
    }
  }
`);

export default function ArmorChart() {
  // Controls State
  const [xVar, setXVar] = useState<StatKey>('weight');
  const [yVar, setYVar] = useState<StatKey>('total_negation');
  const [colorVar, setColorVar] = useState<ColorKey>('category');
  const [search, setSearch] = useState<string>('');
  const [activeCategories, setActiveCategories] = useState<ActiveCategories>(
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: true }), {} as ActiveCategories)
  );
  const [showPareto, setShowPareto] = useState<boolean>(false);

  // Set Planner State
  const [customSet, setCustomSet] = useState<ArmorItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Interaction State
  const [hoveredItem, setHoveredItem] = useState<ArmorItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  // React Query Fetcher using graphql-request and our compiled GraphQL query
  const { data: armorsData = [], isLoading, error } = useQuery({
    queryKey: ['armors'],
    queryFn: async () => {
      const allArmors: any[] = [];
      
      // Fetch pages sequentially to prevent server parallel connection floods & JSON truncation
      for (let page = 0; page <= 5; page++) {
        try {
          const response = await request(
            'https://eldenring.fanapis.com/api/graphql',
            GET_ARMOR_PAGE,
            { page, limit: 100 }
          );
          const pageData = response.armor || [];
          if (pageData.length === 0) break;
          allArmors.push(...pageData);
        } catch (err: any) {
          // If the server throws a GraphQL validation/serialization error (e.g. Int cannot represent Float),
          // graphql-request throws an error containing the partial data!
          // We can catch it and recover the resolved items on that page.
          if (err.response && err.response.data && err.response.data.armor) {
            allArmors.push(...err.response.data.armor);
          } else {
            console.error("Fetch page failed:", err);
          }
        }
      }

      const processedData: ArmorItem[] = allArmors.map(item => {
        const safeFloat = (val: any): number => {
          if (typeof val === 'number') return val;
          if (!val) return 0;
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        };

        return {
          id: item.id || '',
          name: item.name || '',
          image: item.image || null,
          category: item.category || '',
          description: item.description || '',
          weight: safeFloat(item.weight),
          dmgNegation: (item.dmgNegation || []).map((s: any) => ({
            name: s.name || '',
            amount: safeFloat(s.amount)
          })),
          resistance: (item.resistance || []).map((s: any) => ({
            name: s.name || '',
            amount: safeFloat(s.amount)
          }))
        };
      });

      // Filter out duplicate names
      return Array.from(new Map(processedData.map(item => [item.name, item])).values());
    }
  });

  const filteredData = useMemo(() => {
    return armorsData.filter(item => {
      if (!activeCategories[item.category]) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [armorsData, activeCategories, search]);

  const colorMinMax = useMemo(() => {
    if (colorVar === 'category') return null;
    const values = filteredData.map(d => getItemStat(d, colorVar));
    if (values.length === 0) return null;
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [filteredData, colorVar]);

  const chartProps = useMemo(() => {
    if (filteredData.length === 0) return null;

    const xValues = filteredData.map(d => getItemStat(d, xVar));
    const yValues = filteredData.map(d => getItemStat(d, yVar));

    const xMinRaw = Math.min(...xValues);
    const xMaxRaw = Math.max(...xValues);
    const xRange = xMaxRaw - xMinRaw || 1;
    const xMin = Math.max(0, xMinRaw - xRange * 0.05);
    const xMax = xMaxRaw + xRange * 0.05;

    const yMinRaw = Math.min(...yValues);
    const yMaxRaw = Math.max(...yValues);
    const yRange = yMaxRaw - yMinRaw || 1;
    const yMin = Math.max(0, yMinRaw - yRange * 0.05);
    const yMax = yMaxRaw + yRange * 0.05;

    return { xMin, xMax, yMin, yMax };
  }, [filteredData, xVar, yVar]);

  const handleMouseMove = (e: React.MouseEvent, item: ArmorItem) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    
    let x = e.clientX - rect.left + 15;
    let y = e.clientY - rect.top + 15;
    
    if (x + 250 > rect.width) x -= 280; 
    if (y + 200 > rect.height) y -= 220;

    setTooltipPos({ x, y });
    setHoveredItem(item);
  };

  const handleCategoryToggle = (categoryName: string, checked: boolean) => {
    setActiveCategories(prev => ({ ...prev, [categoryName]: checked }));
  };

  const handleToggleSet = (item: ArmorItem) => {
    setCustomSet(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const xLabel = STAT_OPTIONS.find(o => o.id === xVar)?.label || '';
  const yLabel = STAT_OPTIONS.find(o => o.id === yVar)?.label || '';

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 font-sans overflow-hidden">
      <ArmorChartHeader loading={isLoading} itemCount={filteredData.length} />

      <div className="flex flex-1 overflow-hidden">
        <ArmorChartSidebar
          search={search}
          onSearchChange={setSearch}
          xVar={xVar}
          onXVarChange={setXVar}
          yVar={yVar}
          onYVarChange={setYVar}
          colorVar={colorVar}
          onColorVarChange={setColorVar}
          activeCategories={activeCategories}
          onCategoryToggle={handleCategoryToggle}
          customSet={customSet}
          onRemoveFromSet={handleToggleSet}
          onCompareSet={() => setIsCompareOpen(true)}
          showPareto={showPareto}
          onShowParetoChange={setShowPareto}
        />

        <main className="flex-1 relative p-6 bg-slate-900 flex flex-col" ref={chartRef}>
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Summoning Data...</h2>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Connection Lost</h2>
              <p className="text-slate-400">{(error as any).message || 'Failed to fetch'}</p>
            </div>
          ) : (
            <ArmorChartPlot
              filteredData={filteredData}
              xVar={xVar}
              yVar={yVar}
              xLabel={xLabel}
              yLabel={yLabel}
              chartProps={chartProps}
              colorVar={colorVar}
              colorMinMax={colorMinMax}
              hoveredItemId={hoveredItem ? hoveredItem.id : null}
              onHoverItem={handleMouseMove}
              onLeavePlot={() => setHoveredItem(null)}
              customSet={customSet}
              onClickItem={handleToggleSet}
              showPareto={showPareto}
            />
          )}

          {hoveredItem && !isLoading && (
            <ArmorChartTooltip
              item={hoveredItem}
              tooltipPos={tooltipPos}
              xLabel={xLabel}
              yLabel={yLabel}
              xVar={xVar}
              yVar={yVar}
              colorVar={colorVar}
              colorMinMax={colorMinMax}
            />
          )}
        </main>
      </div>

      <ArmorCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        customSet={customSet}
      />
    </div>
  );
}
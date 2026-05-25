import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import type { ArmorItem, StatKey, ActiveCategories } from './types';
import { CATEGORIES, STAT_OPTIONS } from './types';
import ArmorChartHeader from './ArmorChartHeader';
import ArmorChartSidebar from './ArmorChartSidebar';
import ArmorChartPlot from './ArmorChartPlot';
import ArmorChartTooltip from './ArmorChartTooltip';

interface ApiStat {
  name: string;
  amount: string | number;
}

interface ApiArmor {
  id: string;
  name: string;
  image: string | null;
  category: string;
  location?: string;
  weight: string | number;
  dmgNegation?: ApiStat[];
  resistance?: ApiStat[];
}

export default function ArmorChart() {
  const [data, setData] = useState<ArmorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Controls State
  const [xVar, setXVar] = useState<StatKey>('weight');
  const [yVar, setYVar] = useState<StatKey>('total_negation');
  const [search, setSearch] = useState<string>('');
  const [activeCategories, setActiveCategories] = useState<ActiveCategories>(
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: true }), {} as ActiveCategories)
  );

  // Interaction State
  const [hoveredItem, setHoveredItem] = useState<ArmorItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllArmors();
  }, []);

  const fetchAllArmors = async () => {
    setLoading(true);
    setError(null);
    try {
      const pages = [0, 1, 2, 3, 4, 5, 6];
      let loaded = 0;
      
      const fetchPage = async (page: number): Promise<ApiArmor[]> => {
        const res = await fetch(`https://eldenring.fanapis.com/api/armors?limit=100&page=${page}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        loaded++;
        setProgress(Math.round((loaded / pages.length) * 100));
        return json.data || [];
      };

      const results = await Promise.allSettled(pages.map(fetchPage));
      
      let allArmors: ApiArmor[] = [];
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allArmors = [...allArmors, ...result.value];
        }
      });

      if (allArmors.length === 0) throw new Error("Failed to load data from the fan API.");

      const processedData: ArmorItem[] = allArmors.map(item => {
        const getStat = (arr: ApiStat[] | undefined, searchStr: string): number => {
          if (!arr) return 0;
          const stat = arr.find(s => s.name.toLowerCase().includes(searchStr.toLowerCase()));
          return stat ? parseFloat(stat.amount as string) : 0;
        };

        const totalNegation = (item.dmgNegation || []).reduce((sum, s) => sum + parseFloat(s.amount as string || '0'), 0);
        const totalResistance = (item.resistance || [])
          .filter(s => !s.name.toLowerCase().includes('poise'))
          .reduce((sum, s) => sum + parseFloat(s.amount as string || '0'), 0);

        return {
          id: item.id,
          name: item.name,
          image: item.image,
          category: item.category,
          location: item.location || 'Unknown',
          weight: parseFloat(item.weight as string || '0'),
          
          total_negation: totalNegation,
          phy: getStat(item.dmgNegation, 'phy'),
          strike: getStat(item.dmgNegation, 'strike'),
          slash: getStat(item.dmgNegation, 'slash'),
          pierce: getStat(item.dmgNegation, 'pierce'),
          mag: getStat(item.dmgNegation, 'magic'),
          fire: getStat(item.dmgNegation, 'fire'),
          lite: getStat(item.dmgNegation, 'light'),
          holy: getStat(item.dmgNegation, 'holy'),

          total_resistance: totalResistance,
          immunity: getStat(item.resistance, 'immun'),
          robustness: getStat(item.resistance, 'robust'),
          focus: getStat(item.resistance, 'focus'),
          vitality: getStat(item.resistance, 'vital'),
          poise: getStat(item.resistance, 'poise')
        };
      });

      const uniqueData = Array.from(new Map(processedData.map(item => [item.name, item])).values());
      setData(uniqueData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (!activeCategories[item.category]) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, activeCategories, search]);

  const chartProps = useMemo(() => {
    if (filteredData.length === 0) return null;

    const xValues = filteredData.map(d => d[xVar]);
    const yValues = filteredData.map(d => d[yVar]);

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

  const xLabel = STAT_OPTIONS.find(o => o.id === xVar)?.label || '';
  const yLabel = STAT_OPTIONS.find(o => o.id === yVar)?.label || '';

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 font-sans overflow-hidden">
      <ArmorChartHeader loading={loading} itemCount={filteredData.length} />

      <div className="flex flex-1 overflow-hidden">
        <ArmorChartSidebar
          search={search}
          onSearchChange={setSearch}
          xVar={xVar}
          onXVarChange={setXVar}
          yVar={yVar}
          onYVarChange={setYVar}
          activeCategories={activeCategories}
          onCategoryToggle={handleCategoryToggle}
        />

        <main className="flex-1 relative p-6 bg-slate-900 flex flex-col" ref={chartRef}>
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Summoning Data...</h2>
              <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Connection Lost</h2>
              <p className="text-slate-400">{error}</p>
              <button 
                onClick={fetchAllArmors}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <ArmorChartPlot
              filteredData={filteredData}
              xVar={xVar}
              yVar={yVar}
              xLabel={xLabel}
              yLabel={yLabel}
              chartProps={chartProps}
              hoveredItemId={hoveredItem ? hoveredItem.id : null}
              onHoverItem={handleMouseMove}
              onLeavePlot={() => setHoveredItem(null)}
            />
          )}

          {hoveredItem && !loading && (
            <ArmorChartTooltip
              item={hoveredItem}
              tooltipPos={tooltipPos}
              xLabel={xLabel}
              yLabel={yLabel}
              xVar={xVar}
              yVar={yVar}
            />
          )}
        </main>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { LucideProps } from 'lucide-react';
import { 
  ShieldAlert, Weight, Info, Search, Loader2, AlertCircle, 
  HardHat, Shirt, Hand, Footprints, Circle, MapPin 
} from 'lucide-react';
import { generateColor } from '@marko19907/string-to-color';

export const CATEGORIES = ['Helm', 'Chest Armor', 'Gauntlets', 'Leg Armor'] as const;
export type Category = typeof CATEGORIES[number];

export interface ArmorItem {
  id: string;
  name: string;
  image: string | null;
  category: string;
  location: string;
  weight: number;
  
  total_negation: number;
  phy: number;
  strike: number;
  slash: number;
  pierce: number;
  mag: number;
  fire: number;
  lite: number;
  holy: number;

  total_resistance: number;
  immunity: number;
  robustness: number;
  focus: number;
  vitality: number;
  poise: number;
}

export type StatKey =
  | 'weight'
  | 'total_negation'
  | 'phy'
  | 'strike'
  | 'slash'
  | 'pierce'
  | 'mag'
  | 'fire'
  | 'lite'
  | 'holy'
  | 'total_resistance'
  | 'immunity'
  | 'robustness'
  | 'focus'
  | 'vitality'
  | 'poise';

export interface StatOption {
  id: StatKey;
  label: string;
  group: string;
}

export interface ActiveCategories {
  [key: string]: boolean;
}

const stringToColor = (str: string | undefined): string => {
  if (!str) return '#94a3b8';
  return generateColor(str, { saturation: 80, lightness: 65 });
};

const getCategoryIcon = (category: string, props: LucideProps) => {
  switch(category) {
    case 'Helm': return <HardHat {...props} />;
    case 'Chest Armor': return <Shirt {...props} />;
    case 'Gauntlets': return <Hand {...props} />;
    case 'Leg Armor': return <Footprints {...props} />;
    default: return <Circle {...props} />;
  }
};

export const STAT_OPTIONS: StatOption[] = [
  { id: 'weight', label: 'Weight', group: 'General' },
  { id: 'total_negation', label: 'Total Damage Negation', group: 'Negation' },
  { id: 'phy', label: 'Physical Negation', group: 'Negation' },
  { id: 'strike', label: 'Strike Negation', group: 'Negation' },
  { id: 'slash', label: 'Slash Negation', group: 'Negation' },
  { id: 'pierce', label: 'Pierce Negation', group: 'Negation' },
  { id: 'mag', label: 'Magic Negation', group: 'Negation' },
  { id: 'fire', label: 'Fire Negation', group: 'Negation' },
  { id: 'lite', label: 'Lightning Negation', group: 'Negation' },
  { id: 'holy', label: 'Holy Negation', group: 'Negation' },
  { id: 'total_resistance', label: 'Total Resistance', group: 'Resistance' },
  { id: 'immunity', label: 'Immunity', group: 'Resistance' },
  { id: 'robustness', label: 'Robustness', group: 'Resistance' },
  { id: 'focus', label: 'Focus', group: 'Resistance' },
  { id: 'vitality', label: 'Vitality', group: 'Resistance' },
  { id: 'poise', label: 'Poise', group: 'Resistance' },
];

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
      // Fetching multiple pages concurrently
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

  const xLabel = STAT_OPTIONS.find(o => o.id === xVar)?.label;
  const yLabel = STAT_OPTIONS.find(o => o.id === yVar)?.label;

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 font-sans overflow-hidden">
      <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between z-10 shadow-md">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-amber-500 w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Elden Ring Armor Chart</h1>
            <p className="text-xs text-slate-400">Interactive equipment visualizer</p>
          </div>
        </div>
        <div className="text-sm text-slate-400">
          {loading ? 'Fetching library...' : `${filteredData.length} items plotted`}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-slate-800/50 border-r border-slate-700 p-5 flex flex-col gap-6 overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search armor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Y-Axis (Vertical)</label>
              <select
                value={yVar}
                onChange={(e) => setYVar(e.target.value as StatKey)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500"
              >
                {STAT_OPTIONS.map(opt => (
                  <option key={`y-${opt.id}`} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">X-Axis (Horizontal)</label>
              <select
                value={xVar}
                onChange={(e) => setXVar(e.target.value as StatKey)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500"
              >
                {STAT_OPTIONS.map(opt => (
                  <option key={`x-${opt.id}`} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Categories</label>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={activeCategories[cat] || false}
                      onChange={(e) => setActiveCategories(prev => ({ ...prev, [cat]: e.target.checked }))}
                      className="sr-only"
                    />
                    <div 
                      className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                        activeCategories[cat] ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-slate-800 text-slate-500 border border-slate-700 group-hover:border-slate-500 group-hover:text-slate-400'
                      }`}
                    >
                      {getCategoryIcon(cat, { className: "w-4 h-4" })}
                    </div>
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-auto bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <h3 className="text-sm font-medium text-amber-500 flex items-center gap-2 mb-2">
              <Info className="w-4 h-4" /> Usage Tips
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hover over items for details.<br/><br/>
              <strong>Shapes</strong> represent armor type.<br/>
              <strong>Colors</strong> represent individual items.
            </p>
          </div>
        </aside>

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
          ) : filteredData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              No armor pieces match your filters.
            </div>
          ) : (
            <div className="flex-1 relative border-l border-b border-slate-700 ml-12 mb-12 mt-4 mr-4">
              {/* Y Axis Label */}
              <div className="absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                {yLabel}
              </div>
              
              {/* X Axis Label */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                {xLabel}
              </div>

              {chartProps && [0, 0.25, 0.5, 0.75, 1].map(tick => {
                const xVal = chartProps.xMin + tick * (chartProps.xMax - chartProps.xMin);
                const yVal = chartProps.yMin + tick * (chartProps.yMax - chartProps.yMin);
                return (
                  <React.Fragment key={`ticks-${tick}`}>
                    <div 
                      className="absolute -bottom-6 text-[10px] text-slate-500 -translate-x-1/2" 
                      style={{ left: `${tick * 100}%` }}
                    >
                      {xVal.toFixed(1)}
                    </div>
                    <div 
                      className="absolute -left-10 text-[10px] text-slate-500 -translate-y-1/2 text-right w-8" 
                      style={{ bottom: `${tick * 100}%` }}
                    >
                      {yVal.toFixed(1)}
                    </div>
                  </React.Fragment>
                );
              })}

              <svg 
                className="w-full h-full" 
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Grid Lines */}
                {[0.25, 0.5, 0.75].map(tick => (
                  <g key={`grid-${tick}`}>
                    <line x1="0" y1={`${tick * 100}%`} x2="100%" y2={`${tick * 100}%`} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1={`${tick * 100}%`} y1="0" x2={`${tick * 100}%`} y2="100%" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                  </g>
                ))}

                {/* Data Points */}
                {chartProps && filteredData.map(item => {
                  const cx = `${((item[xVar] - chartProps.xMin) / (chartProps.xMax - chartProps.xMin)) * 100}%`;
                  const cy = `${(1 - (item[yVar] - chartProps.yMin) / (chartProps.yMax - chartProps.yMin)) * 100}%`;
                  
                  const isHovered = hoveredItem?.id === item.id;
                  const size = isHovered ? 24 : 16;
                  const color = stringToColor(item.name);
                  
                  return (
                    <svg
                      key={item.id}
                      x={cx}
                      y={cy}
                      style={{ overflow: 'visible' }}
                      opacity={hoveredItem ? (isHovered ? 1 : 0.2) : 0.8}
                      className="transition-opacity duration-200 cursor-pointer"
                      onMouseEnter={(e) => handleMouseMove(e, item)}
                      onMouseMove={(e) => handleMouseMove(e, item)}
                    >
                      <g transform={`translate(-${size/2}, -${size/2})`}>
                        {getCategoryIcon(item.category, {
                          width: size,
                          height: size,
                          color: color,
                          strokeWidth: isHovered ? 2.5 : 1.5
                        })}
                      </g>
                    </svg>
                  );
                })}
              </svg>
            </div>
          )}

          {hoveredItem && !loading && (
            <div 
              className="absolute z-30 w-64 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl overflow-hidden pointer-events-none transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${tooltipPos.x}px, ${tooltipPos.y}px)`,
              }}
            >
              <div 
                className="h-1 w-full" 
                style={{ backgroundColor: stringToColor(hoveredItem.name) }} 
              />
              <div className="p-4">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded bg-slate-800 flex-shrink-0 flex items-center justify-center border border-slate-700 overflow-hidden">
                    {hoveredItem.image ? (
                      <img src={hoveredItem.image} alt={hoveredItem.name} className="w-full h-full object-contain" />
                    ) : (
                      getCategoryIcon(hoveredItem.category, { className: "w-6 h-6 text-slate-500" })
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight mb-1">{hoveredItem.name}</h4>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 w-fit">
                      {getCategoryIcon(hoveredItem.category, { className: "w-3 h-3" })}
                      {hoveredItem.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  {hoveredItem.location !== 'Unknown' && (
                    <div className="flex justify-between items-start text-sm mb-1 pb-2 border-b border-slate-700/50">
                      <span className="text-slate-400 flex items-center gap-1.5 whitespace-nowrap"><MapPin className="w-3.5 h-3.5" /> Location</span>
                      <span className="font-medium text-white text-right max-w-[130px] line-clamp-2" title={hoveredItem.location}>{hoveredItem.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5"><Weight className="w-3.5 h-3.5" /> Weight</span>
                    <span className="font-medium text-white">{hoveredItem.weight.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{xLabel}</span>
                    <span className="font-medium text-amber-400">{hoveredItem[xVar].toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{yLabel}</span>
                    <span className="font-medium text-amber-400">{hoveredItem[yVar].toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
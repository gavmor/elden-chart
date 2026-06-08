import { useState, useEffect, useRef } from 'react';
import RangeSliderImport from 'react-range-slider-input';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RangeSlider = (RangeSliderImport as any).default || RangeSliderImport;
import 'react-range-slider-input/dist/style.css';
import './DoubleSlider.css';

interface DoubleSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (val: number) => string;
}

export function DoubleSlider({
  min,
  max,
  step,
  value,
  onChange,
  formatValue = (val) => val.toString(),
}: DoubleSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value);
  }, [value]);

  const handleInput = (newVal: [number, number]) => {
    setLocalValue(newVal);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      onChange(newVal);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col justify-center">
      <div className="flex justify-between text-[10px] text-text-tertiary mb-3 uppercase tracking-wider font-semibold">
        <span>{formatValue(localValue[0])}</span>
        <span>{formatValue(localValue[1])}</span>
      </div>
      <RangeSlider
        min={min}
        max={max}
        step={step}
        value={localValue}
        onInput={handleInput}
      />
    </div>
  );
}

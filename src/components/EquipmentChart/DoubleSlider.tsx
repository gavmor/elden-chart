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
  return (
    <div className="relative w-full flex flex-col justify-center">
      <div className="flex justify-between text-[10px] text-text-tertiary mb-3 uppercase tracking-wider font-semibold">
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
      <RangeSlider
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={onChange}
      />
    </div>
  );
}

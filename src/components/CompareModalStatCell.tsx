import { getHeatmapBg } from './utils';

interface Props {
  value: number;
  min: number;
  max: number;
  invert?: boolean;
  formatValue?: (n: number) => string;
}

export default function CompareModalStatCell({
  value,
  min,
  max,
  invert = false,
  formatValue = (n) => n.toFixed(1),
}: Props) {
  return (
    <td
      className="p-3 text-center text-white font-medium transition-colors"
      style={{ backgroundColor: getHeatmapBg(value, min, max, invert) }}
    >
      {formatValue(value)}
    </td>
  );
}

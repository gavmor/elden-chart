import { getHeatmapBg } from '../display/styling';
import { formatStatForDisplay } from '../display/logic';

interface Props {
  value: number;
  min: number;
  max: number;
  invert?: boolean;
  isBest?: boolean;
  formatValue?: (n: number) => string;
}

export default function CompareModalStatCell({
  value,
  min,
  max,
  invert = false,
  isBest = false,
  formatValue = (n) => formatStatForDisplay('', n),
}: Props) {
  return (
    <td
      className={`p-3 text-center font-medium transition-colors ${
        isBest ? 'text-better' : 'text-white'
      }`}
      style={{
        backgroundColor: getHeatmapBg(value, min, max, invert),
        boxShadow: isBest ? 'inset 0 -2px 0 0 #C5A566' : undefined,
      }}
    >
      {formatValue(value)}
    </td>
  );
}

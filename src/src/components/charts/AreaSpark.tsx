export interface AreaSparkProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}
export function AreaSpark({
  data,
  width = 200,
  height = 80,
  color = '#3b82f6'
}: AreaSparkProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const points = data.map((value, index) => {
    const x = index / (data.length - 1) * width;
    const y = height - (value - min) / range * height;
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#areaGradient)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>;
}

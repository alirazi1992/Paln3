import { useState } from "react";
export interface DonutProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  size?: number;
  centerLabel?: string;
  direction?: "ltr" | "rtl";
}
export function Donut({
  data,
  size = 200,
  centerLabel = "Total",
  direction = "ltr",
}: DonutProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 70;
  const strokeWidth = 30;
  const center = 100;
  let currentAngle = -90;
  const segments = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    const startRad = startAngle * Math.PI / 180;
    const endRad = currentAngle * Math.PI / 180;
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;
    return {
      ...item,
      path: `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      percentage: Math.round(percentage * 100),
      index
    };
  });
  return <div className="relative" dir={direction} style={{
    width: size,
    height: size
  }}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        {segments.map(segment => <path key={segment.label} d={segment.path} fill={segment.color} opacity={hoveredIndex === null || hoveredIndex === segment.index ? 1 : 0.3} onMouseEnter={() => setHoveredIndex(segment.index)} onMouseLeave={() => setHoveredIndex(null)} className="transition-opacity cursor-pointer" />)}
        <circle cx={center} cy={center} r={radius - strokeWidth} fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <div className="text-2xl font-bold text-gray-900">{total}</div>
        <div className="text-xs text-gray-500">{centerLabel}</div>
      </div>
    </div>;
}

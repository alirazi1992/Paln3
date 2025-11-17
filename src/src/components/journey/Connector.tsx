export interface ConnectorProps {
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
  color?: string;
}
export function Connector({
  from,
  to,
  color = '#e5e7eb'
}: ConnectorProps) {
  const start = from.x <= to.x ? from : to;
  const end = start === from ? to : from;
  const midX = (start.x + end.x) / 2;
  const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
  return <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{
    zIndex: 0
  }}>
      <defs>
        <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="url(#connectorGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
    </svg>;
}

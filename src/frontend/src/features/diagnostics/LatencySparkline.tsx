import { ConnectivityMeasurement } from '../monitoring/types';

interface LatencySparklineProps {
  samples: ConnectivityMeasurement[];
}

export default function LatencySparkline({ samples }: LatencySparklineProps) {
  if (samples.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  const width = 800;
  const height = 120;
  const padding = { top: 10, right: 10, bottom: 20, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find max latency for scaling
  const maxLatency = Math.max(
    ...samples.filter(s => s.latency !== null).map(s => s.latency!),
    100
  );

  // Calculate points
  const points = samples.map((sample, idx) => {
    const x = padding.left + (idx / (samples.length - 1 || 1)) * chartWidth;
    const y = sample.latency !== null
      ? padding.top + chartHeight - (sample.latency / maxLatency) * chartHeight
      : padding.top + chartHeight / 2;
    return { x, y, sample };
  });

  // Create path
  const pathData = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x},${p.y}`)
    .join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="w-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding.top + chartHeight * (1 - ratio);
          return (
            <g key={ratio}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeDasharray="2,2"
              />
              <text
                x={padding.left - 5}
                y={y}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs fill-muted-foreground"
              >
                {Math.round(maxLatency * ratio)}ms
              </text>
            </g>
          );
        })}

        {/* Line chart */}
        <path
          d={pathData}
          fill="none"
          stroke="oklch(var(--chart-1))"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((point, idx) => (
          <circle
            key={idx}
            cx={point.x}
            cy={point.y}
            r={point.sample.success ? 3 : 4}
            fill={point.sample.success ? 'oklch(var(--chart-1))' : 'oklch(var(--destructive))'}
            className={point.sample.success ? '' : 'animate-pulse'}
          />
        ))}
      </svg>
    </div>
  );
}

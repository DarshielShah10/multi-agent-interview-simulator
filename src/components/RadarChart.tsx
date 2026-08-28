import React from 'react';

interface RadarChartProps {
  scores: {
    technical: number;   // 0-10
    culture: number;     // 0-10
    roi: number;         // 0-10
    riskInverse: number; // 0-10
  };
  labels?: {
    technical?: string;
    culture?: string;
    roi?: string;
    riskInverse?: string;
  };
}

export const RadarChart: React.FC<RadarChartProps> = ({
  scores,
  labels = {
    technical: 'Technical Depth',
    culture: 'Culture & Ethics',
    roi: 'Business Impact ROI',
    riskInverse: 'Integrity / Risk Inverse'
  }
}) => {
  const size = 300;
  const center = size / 2;
  const maxRadius = 105;

  // 4 Axes: Top (Technical), Right (Culture), Bottom (ROI), Left (Risk Inverse)
  // Angles: Top (-90 deg), Right (0 deg), Bottom (90 deg), Left (180 deg)
  const getCoordinates = (value: number, angleDegrees: number) => {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const r = (value / 10) * maxRadius;
    const x = center + r * Math.cos(angleRadians);
    const y = center + r * Math.sin(angleRadians);
    return { x, y };
  };

  const pTop = getCoordinates(scores.technical, -90);
  const pRight = getCoordinates(scores.culture, 0);
  const pBottom = getCoordinates(scores.roi, 90);
  const pLeft = getCoordinates(scores.riskInverse, 180);

  const polygonPoints = `${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`;

  // Concentric background grid rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-boardroom-900 border border-slate-800 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between w-full mb-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          4-Dimension Competency Radar
        </h4>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
          Calibrated
        </span>
      </div>

      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
          </radialGradient>
          <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* Concentric Grid Rings */}
        {rings.map((ring, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={maxRadius * ring}
            fill="none"
            stroke="rgba(51, 65, 85, 0.4)"
            strokeDasharray={idx < 3 ? "3 3" : undefined}
            strokeWidth={1}
          />
        ))}

        {/* Axis Cross Lines */}
        <line x1={center} y1={center - maxRadius} x2={center} y2={center + maxRadius} stroke="rgba(71, 85, 105, 0.5)" strokeWidth={1} />
        <line x1={center - maxRadius} y1={center} x2={center + maxRadius} y2={center} stroke="rgba(71, 85, 105, 0.5)" strokeWidth={1} />

        {/* Filled Data Polygon with Glow */}
        <polygon
          points={polygonPoints}
          fill="url(#radarGlow)"
          stroke="url(#polyGrad)"
          strokeWidth={2.5}
          className="transition-all duration-700 ease-out drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        />

        {/* Corner Data Vertex Points */}
        <circle cx={pTop.x} cy={pTop.y} r={4.5} fill="#38bdf8" stroke="#0f172a" strokeWidth={1.5} />
        <circle cx={pRight.x} cy={pRight.y} r={4.5} fill="#c084fc" stroke="#0f172a" strokeWidth={1.5} />
        <circle cx={pBottom.x} cy={pBottom.y} r={4.5} fill="#34d399" stroke="#0f172a" strokeWidth={1.5} />
        <circle cx={pLeft.x} cy={pLeft.y} r={4.5} fill="#fbbf24" stroke="#0f172a" strokeWidth={1.5} />

        {/* Outer Axis Labels */}
        <text x={center} y={center - maxRadius - 12} textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">
          {labels.technical} ({scores.technical})
        </text>
        <text x={center + maxRadius + 10} y={center + 4} textAnchor="start" fill="#d8b4fe" fontSize="10" fontWeight="bold">
          {labels.culture} ({scores.culture})
        </text>
        <text x={center} y={center + maxRadius + 18} textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="bold">
          {labels.roi} ({scores.roi})
        </text>
        <text x={center - maxRadius - 10} y={center + 4} textAnchor="end" fill="#fcd34d" fontSize="10" fontWeight="bold">
          {labels.riskInverse} ({scores.riskInverse})
        </text>
      </svg>
    </div>
  );
};

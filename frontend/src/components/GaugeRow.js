"use client";

export default function GaugeRow() {
  const gauges = [
    { label: "Stress Index", value: "HIGH", sub: "Autonomic overload", color: "var(--danger)" },
    { label: "Recovery Rate", value: "23%", sub: "Well below 60% target", color: "var(--warn)" },
    { label: "Days to Crash", value: "~6", sub: "If no intervention", color: "var(--danger)" },
  ];

  return (
    <div className="gauge-row dash-anim-3">
      {gauges.map((g, i) => (
        <div key={i} className="gauge-card">
          <div className="gauge-label">{g.label}</div>
          <div className="gauge-value" style={{ color: g.color }}>{g.value}</div>
          <div className="gauge-sub">{g.sub}</div>
        </div>
      ))}
    </div>
  );
}
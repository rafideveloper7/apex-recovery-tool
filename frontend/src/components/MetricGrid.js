"use client";

export default function MetricGrid() {
  const metrics = [
    { label: "Sleep debt", value: "-2.1h", delta: "↓ 31min worse vs last week", width: "82%", color: "var(--danger)", icon: "ti-moon" },
    { label: "Screen time", value: "9.8h", delta: "↑ 1.4h above baseline", width: "70%", color: "var(--warn)", icon: "ti-device-mobile" },
    { label: "Output score", value: "61%", delta: "↓ from 84% last week", width: "61%", color: "var(--warn)", icon: "ti-trending-down" },
    { label: "HRV avg", value: "38ms", delta: "↓ 12ms from baseline", width: "75%", color: "var(--danger)", icon: "ti-heart-rate-monitor" },
  ];

  return (
    <div className="metric-grid dash-anim-2" role="list">
      {metrics.map((m, i) => (
        <div key={i} className="metric-card" role="listitem" tabIndex={0}>
          <div 
            className="mc-glow" 
            style={{ background: `radial-gradient(circle, ${m.color === "var(--danger)" ? "rgba(239,68,68,.12)" : "rgba(245,158,11,.12)"} 0%, transparent 70%)` }}
          ></div>
          <div className="metric-label">
            <i className={`ti ${m.icon}`} aria-hidden="true"></i>
            {m.label}
          </div>
          <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
          <div className="metric-delta" style={{ color: m.color === "var(--danger)" ? "#f87171" : "var(--warn)" }}>{m.delta}</div>
          <div className="metric-mini-bar">
            <div className="metric-mini-fill animate" style={{ width: m.width, background: m.color }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
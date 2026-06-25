"use client";

export default function SignalList() {
  const signals = [
    { name: "Sleep quality", detail: "Avg 5.9h — fragmented, low REM (14%)", width: "82%", pct: "82%", color: "var(--danger)", icon: "ti-moon" },
    { name: "Work output", detail: "Tasks + commits — 40% variance spike", width: "67%", pct: "67%", color: "var(--warn)", icon: "ti-chart-line" },
    { name: "Screen exposure", detail: "9.8h avg — 3.8h above safe limit", width: "75%", pct: "75%", color: "var(--warn)", icon: "ti-device-desktop" },
    { name: "HRV (autonomic load)", detail: "38ms — 18% below 50ms baseline", width: "78%", pct: "78%", color: "var(--danger)", icon: "ti-heart-rate-monitor" },
    { name: "Mood stability", detail: "Irritable / flat — 3 consecutive days", width: "58%", pct: "58%", color: "var(--warn)", icon: "ti-mood-sad" },
  ];

  return (
    <>
      <div className="section-hd">
        <span className="section-title">Signal breakdown</span>
        <button className="btn-sm btn-ghost"><i className="ti ti-chart-bar"></i> Full Analysis</button>
      </div>
      <div className="signal-list" role="list">
        {signals.map((s, i) => (
          <div key={i} className="signal-row anim-in" role="listitem" tabIndex={0}>
            <div className={`signal-icon ${s.color === "var(--danger)" ? "sig-red" : "sig-warn"}`}>
              <i className={`ti ${s.icon}`} aria-hidden="true"></i>
            </div>
            <div className="signal-text">
              <div className="signal-name">{s.name}</div>
              <div className="signal-detail">{s.detail}</div>
            </div>
            <div className="sig-bar-wrap">
              <div className="sig-track">
                <div className="sig-fill animate" style={{ width: s.width, background: s.color }}></div>
              </div>
              <div className="sig-pct">{s.pct}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
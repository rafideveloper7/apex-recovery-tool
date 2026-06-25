"use client";

export default function RecoveryCard() {
  const steps = [
    { num: "01", title: "Sleep recovery block — tonight", desc: "Set a hard stop at 9:30pm. Devices off. No screens from 8pm. Target: 8.5h in bed tonight and for 3 consecutive nights." },
    { num: "02", title: "Reduce screen time — today", desc: "Cap total screen at 6h. Use app timers. Remove social apps from phone for 48h. Replace evening scroll with 20-min walk." },
    { num: "03", title: "Defer non-critical work — this week", desc: "Identify 3 tasks you can push to next week. Energy is a finite resource — protect it for what only you can do." },
    { num: "04", title: "Talk to someone — within 24h", desc: "Share what you're carrying. Isolation accelerates burnout. A trusted person or our AI Advisor can help you process." },
  ];

  return (
    <div className="recovery-card dash-anim-8">
      <h3><i className="ti ti-shield-check"></i> Immediate Recovery Protocol</h3>
      <div className="recovery-steps-wrapper">
        {steps.map((s, i) => (
          <div key={i} className="recovery-step">
            <div className="step-num">{s.num}</div>
            <div className="step-text">
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="recovery-actions-panel" style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button className="btn-sm btn-blue"><i className="ti ti-message-chatbot"></i> Talk to AI Advisor</button>
        <button className="btn-sm btn-ghost"><i className="ti ti-download"></i> Save Plan</button>
      </div>
    </div>
  );
}
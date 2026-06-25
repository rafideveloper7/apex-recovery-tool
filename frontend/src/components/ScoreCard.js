"use client";

export default function ScoreCard() {
  return (
    <div className="score-card dash-anim-4" aria-label="Overall burnout risk score: 74 out of 100">
      <div className="score-left">
        <div className="score-label">Burnout risk score</div>
        <div className="score-num">74</div>
        <div className="score-desc">High risk zone. Rolling 7-day window across 4 biometric signals. You are <strong style={{ color: "#b07030" }}>23 points above the danger threshold</strong> of 51.</div>
        <div className="score-actions">
          <button className="btn-sm btn-danger"><i className="ti ti-first-aid-kit"></i> Emergency Plan</button>
          <button className="btn-sm btn-ghost"><i className="ti ti-refresh"></i> Re-assess</button>
          <button className="btn-sm btn-ghost"><i className="ti ti-message"></i> Discuss</button>
        </div>
      </div>
      <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <filter id="glow-ring">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="9"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--warn)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray="251" strokeDashoffset="251" transform="rotate(-90 50 50)"
          className="score-ring-animated"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)" }} filter="url(#glow-ring)"/>
        <text x="50" y="46" textAnchor="middle" fontSize="16" fontWeight="600" fill="#E8A25A" fontFamily="'JetBrains Mono',monospace">74</text>
        <text x="50" y="60" textAnchor="middle" fontSize="9" fill="#8892A4" fontFamily="sans-serif">/ 100</text>
      </svg>
    </div>
  );
}
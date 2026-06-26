"use client";

export default function Hero() {
  return (
    <div className="hero" role="banner">
      <div className="hero-scanlines" aria-hidden="true"></div>
      <div className="hero-grid" aria-hidden="true"></div>
      <div className="hero-glow" aria-hidden="true"></div>
      <div className="hero-glow2" aria-hidden="true"></div>
      <div className="hero-streak" aria-hidden="true"></div>

      <div className="hero-content">
        <div className="hero-tag"><i className="ti ti-radar"></i> Weekly Analysis — Active</div>
        <h1 className="hero-title">Free <em>AI Burnout Detection</em> Tool — Know Before You Crash</h1>
        <p className="hero-sub">Your biometric pattern matches a pre-burnout signature. Sleep debt accumulating, HRV trending down, output crashing — the body signals before the mind registers.</p>

        {/* <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div className="float1" style={{ background: "rgba(192,57,43,.15)", border: "1px solid rgba(192,57,43,.3)", borderRadius: "10px", padding: "8px 13px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>😰</span>
            <div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".8px" }}>Risk</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#fca5a5", fontFamily: "'JetBrains Mono',monospace" }}>74/100</div>
            </div>
          </div>
          <div className="float2" style={{ background: "rgba(232,162,90,.12)", border: "1px solid rgba(232,162,90,.25)", borderRadius: "10px", padding: "8px 13px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>🌙</span>
            <div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".8px" }}>Sleep</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#fcd34d", fontFamily: "'JetBrains Mono',monospace" }}>−2.1h</div>
            </div>
          </div>
          <div className="float3" style={{ background: "rgba(75,123,229,.12)", border: "1px solid rgba(75,123,229,.25)", borderRadius: "10px", padding: "8px 13px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>💓</span>
            <div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".8px" }}>HRV</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#93c5fd", fontFamily: "'JetBrains Mono',monospace" }}>38ms</div>
            </div>
          </div>
        </div> */}

        <div className="hero-actions">
          <a href="/checkin" className="btn-hero btn-accent"><i className="ti ti-activity"></i> Run Assessment</a>
          <a href="/advisor" className="btn-hero btn-ghost"><i className="ti ti-message-chatbot"></i> Talk to AI Advisor</a>
          <button className="btn-hero btn-warn"><i className="ti ti-urgent"></i> Emergency Plan</button>
        </div>
      </div>
    </div>
  );
}
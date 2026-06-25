"use client";

import Link from "next/link";

export default function InsightsPage() {
  return (
    <>
      <style>{`
        .insight-cards{padding:18px 20px;display:flex;flex-direction:column;gap:14px}
        .insight-card{background:#FFFFFF;border:1px solid var(--border);border-radius:14px;padding:20px;transition:all .2s;box-shadow:0 1px 4px rgba(26,39,68,.05)}
        .insight-card:hover{border-color:#4B7BE5;box-shadow:0 4px 16px rgba(26,39,68,.1)}
        .insight-badge{display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:10px;letter-spacing:1px;text-transform:uppercase;font-family:var(--mono)}
        .badge-red{background:rgba(192,57,43,.08);color:#C0392B;border:1px solid rgba(192,57,43,.2)}
        .insight-card h3{font-size:14px;font-weight:600;color:var(--text);margin-bottom:7px}
        .insight-card p{font-size:12px;color:var(--text2);line-height:1.65}
        .insight-actions{display:flex;gap:7px;margin-top:14px;flex-wrap:wrap}
        .app-footer{padding:28px 20px 32px;text-align:center;border-top:1px solid var(--border);background:var(--bg2);position:relative}
        .footer-logo{font-family:var(--serif);font-size:14px;font-style:italic;color:var(--text3)}
        .footer-links{display:flex;justify-content:center;gap:14px;margin-top:10px;flex-wrap:wrap}
        .footer-links a{font-size:13px;color:var(--text3);text-decoration:none;transition:color .2s;padding:6px 4px;min-height:40px;display:inline-flex;align-items:center}
        .footer-copy{font-size:12px;color:var(--text3);margin-top:10px;letter-spacing:0.3px;line-height:1.6}
      `}</style>

      <div className="ins-hero">
        <h2>Burnout insights</h2>
        <p>Pattern analysis across your last 30 days of signals</p>
      </div>

      <div className="insight-cards">
        <div className="insight-card">
          <div className="insight-badge badge-red"><i className="ti ti-flame" aria-hidden="true"></i> Critical pattern</div>
          <h3>Sleep-screen feedback loop</h3>
          <p>When your screen time exceeds 9h, sleep drops below 6h with 89% consistency. Late-night blue light is compressing your REM window.</p>
          <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
            <button className="btn-sm btn-danger"><i className="ti ti-message"></i> Get fix advice</button>
            <button className="btn-sm btn-ghost"><i className="ti ti-device-mobile-off"></i> Screen block</button>
          </div>
        </div>
      </div>

      <div className="app-footer">
        <div className="footer-logo">Powered by <strong>Apex Recovery</strong> intelligence</div>
        <div className="footer-links">
          <Link href="/">About Us</Link>
          <Link href="/">Medical Disclaimer</Link>
          <Link href="/">Privacy Policy</Link>
        </div>
        <div className="footer-copy">© 2026 Apex Recovery · Not medical advice · For wellness awareness only</div>
      </div>
    </>
  );
}
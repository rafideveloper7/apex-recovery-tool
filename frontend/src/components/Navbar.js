"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch {}
    }
  }, []);

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav-logo">
        <div className="nav-logo-dot" role="img" aria-label="Live burnout monitoring status indicator"></div>
        apex <em>recovery</em>
      </div>

      <div className="nav-tabs" role="tablist" id="nav-tabs-desktop">
        <a href="/" className="nav-tab active">Dashboard</a>
        <a href="/checkin" className="nav-tab">Check-in</a>
        <a href="/advisor" className="nav-tab">AI Advisor</a>
        <a href="/insights" className="nav-tab">Insights</a>
        <a href="/blog" className="nav-tab">📰 Blog</a>
      </div>

      <div className="nav-right">
        <div className="nav-badge"><span className="live-dot"></span>LIVE</div>
        <button className="nav-btn" style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }} onClick={() => {
          const panel = document.getElementById("activity-panel");
          if (panel) panel.style.display = "block";
        }}>
          <i className="ti ti-user-circle"></i> <span>{user ? user.name : "My Activity"}</span>
        </button>
        <button className="nav-btn"><i className="ti ti-download"></i> Export</button>
      </div>
    </nav>
  );
}
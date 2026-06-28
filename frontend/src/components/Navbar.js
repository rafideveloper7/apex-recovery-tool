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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav-logo">
        <div className="nav-logo-dot" role="img" aria-label="Live burnout monitoring status indicator"></div>
        apex <em>recovery</em>
      </div>

      <div className="nav-tabs" role="tablist" id="nav-tabs-desktop">
        <a href="/" className="nav-tab">Dashboard</a>
        <a href="/checkin" className="nav-tab">Check-in</a>
        <a href="/advisor" className="nav-tab">AI Advisor</a>
        <a href="/insights" className="nav-tab">Insights</a>
        <a href="/blog" className="nav-tab">📰 Blog</a>
      </div>

      <div className="nav-right">
        <div className="nav-badge"><span className="live-dot"></span>LIVE</div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {user.profileImage && (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
              />
            )}
            <span style={{ color: "var(--text3)", fontSize: "13px" }}>{user.name}</span>
            <button onClick={handleLogout} className="nav-btn" style={{ background: "var(--bg3)", color: "var(--text)" }}>
              <i className="ti ti-logout"></i> Logout
            </button>
          </div>
        ) : (
          <button className="nav-btn" onClick={() => window.location.href = "/auth"}>
            <i className="ti ti-user-circle"></i> Login
          </button>
        )}
        <button className="nav-btn"><i className="ti ti-download"></i> Export</button>
      </div>
    </nav>
  );
}
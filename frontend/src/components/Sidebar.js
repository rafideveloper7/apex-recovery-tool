"use client";

export default function Sidebar({ isOpen, onClose }) {
  const navLinks = [
    { label: "Dashboard", href: "/", icon: "ti-layout-dashboard" },
    { label: "Check-in", href: "/checkin", icon: "ti-activity" },
    { label: "AI Advisor", href: "/advisor", icon: "ti-message-chatbot" },
    { label: "Insights", href: "/insights", icon: "ti-chart-bar" },
    { label: "Blog", href: "/blog", icon: "ti-book" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-label="Main Navigation">
      {/* Brand Header */}
      <div className="sidebar-brand">
        apex <span>recovery</span>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1 }}>
        <ul className="sidebar-nav">
          {navLinks.map((link, i) => (
            <li key={i}>
              <a 
                href={link.href} 
                className={`sidebar-link ${link.label === "Dashboard" ? "active" : ""}`}
              >
                <i className={`ti ${link.icon}`}></i>
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Optional Sidebar Footer (e.g., Export/Sign Out) */}
      <div className="sidebar-footer">
        <button className="sidebar-link" style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}>
          <i className="ti ti-download"></i>
          <span>Export Data</span>
        </button>
      </div>
    </aside>
  );
}
"use client";

import { useState } from "react";
import "./../styles/globals.css";
import ActivityPanel from "./ActivityPanel";
import Sidebar from "./../components/Sidebar";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <html lang="en">
      <head>
        {/* Load Tabler Icons globally if not loaded via npm modules */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      </head>
      <body>
        {/* Mobile Top Header containing Right-aligned Hamburger */}
        <header className="mobile-top-bar">
          <div className="mobile-brand">
            apex <em>recovery</em>
          </div>
          <button 
            className="mobile-hamburger" 
            onClick={toggleSidebar}
            aria-label="Toggle navigation drawer"
          >
            <i className={`ti ${isSidebarOpen ? "ti-x" : "ti-menu-2"}`}></i>
          </button>
        </header>

        {/* Sidebar Navigation Context */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Mobile Drawer Dark Backdrop Overlay */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        {/* Core Layout Target Viewport Container */}
        <div className="main-content">
          {children}
        </div>

        {/* Interactive Modules */}
        <ActivityPanel />

        {/* Fixed Mobile Bottom Thumb Menu Layout */}
        <nav className="mobile-bottom-menu">
          <a href="/" className="mobile-menu-item active">
            <i className="ti ti-layout-dashboard"></i>
            <span>Dashboard</span>
          </a>
          <a href="/checkin" className="mobile-menu-item">
            <i className="ti ti-activity"></i>
            <span>Check-in</span>
          </a>
          <a href="/advisor" className="mobile-menu-item">
            <i className="ti ti-message-chatbot"></i>
            <span>AI Advisor</span>
          </a>
          <button 
            className="mobile-menu-item" 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => {
              const panel = document.getElementById("activity-panel");
              if (panel) panel.style.display = "block";
            }}
          >
            <i className="ti ti-user-circle"></i>
            <span>Activity</span>
          </button>
        </nav>
      </body>
    </html>
  );
}
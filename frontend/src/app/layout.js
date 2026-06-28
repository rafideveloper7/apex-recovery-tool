"use client";

import "./../styles/globals.css";
import ActivityPanel from "./ActivityPanel";
import Sidebar from "../components/Sidebar";
import AuthWrapper from "../components/AuthWrapper";
import { useState } from "react";

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <head />
      <body>
        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <i className="ti ti-menu-2"></i>
        </button>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </div>
        <ActivityPanel />
      </body>
    </html>
  );
}
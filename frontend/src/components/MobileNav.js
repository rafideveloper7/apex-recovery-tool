"use client";

import Link from "next/link";

export default function MobileNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <Link href="/" className="mbn-tab"><i className="ti ti-layout-dashboard"></i><span>Home</span></Link>
      <Link href="/checkin" className="mbn-tab"><i className="ti ti-activity"></i><span>Check-in</span></Link>
      <Link href="/advisor" className="mbn-tab"><i className="ti ti-message-chatbot"></i><span>Advisor</span></Link>
      <Link href="/blog" className="mbn-tab"><i className="ti ti-news"></i><span>Blog</span></Link>
      <button className="mbn-tab" onClick={() => {
        const panel = document.getElementById("activity-panel");
        if (panel) panel.style.display = "block";
      }} aria-label="My Activity"><i className="ti ti-user-circle"></i><span>Me</span></button>
    </nav>
  );
}
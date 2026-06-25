"use client";

import React from "react";

export default function StatsBar() {
  const stats = [
    { value: 74, label: "Risk Score", color: "var(--danger)" },
    { value: -2.1, label: "Sleep Debt", suffix: "h", color: "var(--warn)" }, 
    { value: 38, label: "HRV Now", suffix: "ms", color: "var(--warn)" }, 
    { value: 61, label: "Output", suffix: "%", color: "var(--danger)" }, 
  ];

  return (
    <div className="stats-bar dash-anim-1" role="list" aria-label="Key health statistics">
      {stats.map((stat, i) => (
        <div key={i} className="stat-item" role="listitem">
          <div className="stat-num" style={{ color: stat.color }}>
            {stat.suffix && stat.label === "Sleep Debt" ? "-" : ""}{stat.value}{stat.suffix || ""}
          </div>
          <div className="stat-lbl">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
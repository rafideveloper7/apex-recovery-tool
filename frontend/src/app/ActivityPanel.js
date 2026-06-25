"use client";

export default function ActivityPanel() {
  return (
    <div id="activity-panel" style={{ display: "none", position: "fixed", top: "0", right: "0", width: "340px", height: "100vh", background: "var(--surface)", borderLeft: "1px solid var(--border)", zIndex: "500", overflowY: "auto", boxShadow: "-4px 0 32px rgba(26,39,68,.12)" }}>
      <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: "0", background: "var(--surface)", zIndex: "2" }}>
        <div>
          <div style={{ fontWeight: "700", color: "var(--text)", fontSize: "16px" }}>My Activity</div>
          <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>🔒 Your personal data</div>
        </div>
        <button onClick={() => {
          const panel = document.getElementById("activity-panel");
          if (panel) panel.style.display = "none";
        }} style={{ border: "none", background: "var(--bg3)", cursor: "pointer", color: "var(--text2)", fontSize: "14px", padding: "6px 10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
          ✕
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--border)" }}>
        <div style={{ background: "var(--surface)", padding: "16px 10px", textAlign: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--blue)", fontFamily: "var(--mono)" }}>0</div>
          <div style={{ fontSize: "10px", color: "var(--text3)", marginTop: "3px" }}>Sessions</div>
        </div>
        <div style={{ background: "var(--surface)", padding: "16px 10px", textAlign: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--blue)", fontFamily: "var(--mono)" }}>0</div>
          <div style={{ fontSize: "10px", color: "var(--text3)", marginTop: "3px" }}>AI Chats</div>
        </div>
        <div style={{ background: "var(--surface)", padding: "16px 10px", textAlign: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--blue)", fontFamily: "var(--mono)" }}>0</div>
          <div style={{ fontSize: "10px", color: "var(--text3)", marginTop: "3px" }}>Check-ins</div>
        </div>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button style={{ width: "100%", padding: "12px", background: "var(--blue3)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "var(--sans)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          📄 Download My Report as PDF
        </button>
        <button style={{ width: "100%", padding: "10px", border: "1.5px solid rgba(192,57,43,.3)", background: "rgba(192,57,43,.04)", color: "var(--danger)", borderRadius: "10px", fontSize: "12px", cursor: "pointer", fontFamily: "var(--sans)" }}>
          🗑️ Clear All My Data
        </button>
      </div>
    </div>
  );
}
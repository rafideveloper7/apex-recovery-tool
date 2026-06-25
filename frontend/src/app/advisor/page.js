import AIChat from "../../components/AIChat";

export default function AdvisorPage() {
  return (
    <>
      <style>{`
        .ins-hero{background:linear-gradient(160deg,#0D1B3E,#1A2B52);padding:24px 20px;border-bottom:1px solid var(--border);position:relative;overflow:hidden}
        .ins-hero::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(75,123,229,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(75,123,229,.06) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
        .ins-hero h2{font-family:var(--serif);font-size:24px;color:#fff;margin-bottom:6px;position:relative;z-index:1}
        .ins-hero p{font-size:13px;color:rgba(255,255,255,.6);position:relative;z-index:1}
      `}</style>

      <div className="ins-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🤖</div>
            <h2>AI Recovery Advisor</h2>
          </div>
          <p>Share your story, symptoms, or situation. Get expert, evidence-based guidance — immediately.</p>
        </div>
      </div>

      <div className="content">
        <AIChat />
      </div>
    </>
  );
}
import CheckInForm from "../../components/CheckInForm";

export default function CheckinPage() {
  return (
    <>
      <style>{`
        .ci-hero{background:linear-gradient(160deg,#0D1B3E,#1A2B52);padding:24px 22px 20px;border-bottom:1px solid var(--border);position:relative;overflow:hidden}
        .ci-hero::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(75,123,229,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(75,123,229,.07) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
        .ci-hero h2{font-family:var(--serif);font-size:24px;color:#fff;margin-bottom:6px;position:relative;z-index:1}
        .ci-hero p{font-size:13px;color:rgba(255,255,255,.6);position:relative;z-index:1}
      `}</style>

      <div className="ci-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📋</div>
            <h2>Daily Check-in</h2>
          </div>
          <p>Takes 60 seconds. Watch your risk score update <em style={{ color: "#93c5fd", fontStyle: "normal", fontWeight: "600" }}>live</em> as you answer.</p>
        </div>
      </div>

      <div className="content">
        <CheckInForm />
      </div>
    </>
  );
}
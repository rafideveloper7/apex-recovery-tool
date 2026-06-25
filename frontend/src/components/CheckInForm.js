"use client";

import { useState } from "react";

export default function CheckInForm() {
  const [sliders, setSliders] = useState({
    sleep: 7,
    screen: 8,
    energy: 5,
    focus: 5,
  });

  const [selects, setSelects] = useState({
    output: 2,
    mood: 2,
    breaks: 2,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCheckin = async () => {
    setLoading(true);
    
    const { sleep, screen, energy, focus } = sliders;
    const { output, mood, breaks } = selects;

    let s = 0;
    if (sleep < 5) s += 36;
    else if (sleep < 6) s += 26;
    else if (sleep < 7) s += 16;
    else s += 3;

    if (screen > 12) s += 28;
    else if (screen > 9) s += 20;
    else if (screen > 7) s += 12;
    else s += 3;

    if (energy < 3) s += 20;
    else if (energy < 5) s += 13;
    else if (energy < 7) s += 6;
    else s += 1;

    if (focus < 3) s += 14;
    else if (focus < 6) s += 8;
    else s += 1;

    if (output === 0) s += 22;
    else if (output === 1) s += 12;
    else if (output === 2) s += 5;
    else s += 1;

    if (mood === 0) s += 16;
    else if (mood === 1) s += 8;
    else if (mood === 2) s += 2;

    if (breaks === 1) s += 8;
    else if (breaks === 2) s += 3;

    s = Math.min(Math.round(s), 100);

    let level, desc, tips;
    const scoreColor = s > 65 ? '#C0392B' : s > 35 ? '#E8A25A' : '#4B7BE5';

    if (s > 65) {
      level = 'Intervene now — before this escalates.';
      desc = 'Your inputs match a pre-burnout signature. Your nervous system is under sustained overload.';
      tips = [
        'Take a full sleep recovery night — aim for 8.5h.',
        'Cap screen time at 5h tomorrow.',
        'Leave work on time today.',
        '30-minute walk without your phone.',
        'Tell one trusted person what you\'re carrying.',
        'Open the Emergency Recovery Plan.',
      ];
    } else if (s > 35) {
      level = 'Act this week — warning signs are present.';
      desc = 'Warning signs are present. You have a window to course-correct.';
      tips = [
        'Protect tonight\'s sleep — 8h minimum.',
        'Reduce screen time by 2h today.',
        '20-minute outdoor break at midday.',
        'Identify one stressor you can drop.',
        'Take three 5-minute breathing breaks.',
      ];
    } else {
      level = 'Looking good — protect what\'s working.';
      desc = 'Your patterns are healthy today.';
      tips = [
        'Maintain sleep consistency.',
        'Schedule a midweek rest block.',
        'Track your HRV weekly.',
        'Acknowledge that you\'re doing well.',
      ];
    }

    setResult({ score: s, level, desc, tips, color: scoreColor });
    loading && setLoading(false);
  };

  return (
    <div className="checkbox-form " style={{  margin: "0" }}>
      {/* Top Banner Accent */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px", padding: "14px 16px", background: "linear-gradient(135deg, rgba(75,123,229,.07), rgba(75,123,229,.02))", borderRadius: "12px", border: "1px solid rgba(75,123,229,.15)" }}>
        <div style={{ fontSize: "24px" }}>✍️</div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text)" }}>How are you doing today?</div>
          <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px", letterSpacing: "0.2px" }}>Answer honestly — parameters are private.</div>
        </div>
      </div>

      {/* --- Sliders Area --- */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" }}>
        <div className="slider-group">
          <div className="slider-label" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
            <span style={{ color: "var(--text2)", fontWeight: "500" }}>🌙 Hours slept last night</span> 
            <span className="slider-val" style={{ fontFamily: "var(--mono)", fontWeight: "600", color: "var(--blue)" }}>{sliders.sleep.toFixed(1)}h</span>
          </div>
          <div className="slider-track " style={{ position: "relative" }}>
            <div className="slider-fill" style={{  width: `${((sliders.sleep - 3) / 7 * 100).toFixed(0)}%` }}></div>
            <input type="range" min="3" max="10" step="0.5" value={sliders.sleep} style={{width: "100%", height: "8px"}}  onChange={(e) => setSliders({ ...sliders, sleep: parseFloat(e.target.value) })} />
          </div>
        </div>

        <div className="slider-group">
          <div className="slider-label" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
            <span style={{ color: "var(--text2)", fontWeight: "500" }}>📱 Screen time today</span> 
            <span className="slider-val" style={{ fontFamily: "var(--mono)", fontWeight: "600", color: "var(--blue)" }}>{sliders.screen.toFixed(1)}h</span>
          </div>
          <div className="slider-track" style={{ position: "relative" }}>
            <div className="slider-fill" style={{ width: `${((sliders.screen - 1) / 15 * 100).toFixed(0)}%` }}></div>
            <input type="range" min="1" max="16" step="0.5" value={sliders.screen} style={{width: "100%", height: "8px"}} onChange={(e) => setSliders({ ...sliders, screen: parseFloat(e.target.value) })} />
          </div>
        </div>

        <div className="slider-group">
          <div className="slider-label" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
            <span style={{ color: "var(--text2)", fontWeight: "500" }}>⚡ Energy level</span> 
            <span className="slider-val" style={{ fontFamily: "var(--mono)", fontWeight: "600", color: "var(--blue)" }}>{sliders.energy}/10</span>
          </div>
          <div className="slider-track" style={{ position: "relative" }}>
            <div className="slider-fill" style={{ width: `${((sliders.energy - 1) / 9 * 100).toFixed(0)}%` }}></div>
            <input type="range" min="1" max="10" step="1" value={sliders.energy} style={{width: "100%", height: "8px"}} onChange={(e) => setSliders({ ...sliders, energy: parseInt(e.target.value) })} />
          </div>
        </div>

        <div className="slider-group">
          <div className="slider-label" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
            <span style={{ color: "var(--text2)", fontWeight: "500" }}>🎯 Focus / concentration</span> 
            <span className="slider-val" style={{ fontFamily: "var(--mono)", fontWeight: "600", color: "var(--blue)" }}>{sliders.focus}/10</span>
          </div>
          <div className="slider-track" style={{ position: "relative" }}>
            <div className="slider-fill" style={{ width: `${((sliders.focus - 1) / 9 * 100).toFixed(0)}%` }}></div>
            <input type="range" min="1" max="10" step="1" value={sliders.focus} style={{width: "100%", height: "8px"}} onChange={(e) => setSliders({ ...sliders, focus: parseInt(e.target.value) })} />
          </div>
        </div>
      </div>

      {/* --- Premium Custom Card Selectors Grid --- */}
      <div style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "28px" }}>
        
        {/* 1. Work Output */}
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text3)", marginBottom: "8px" }}>💼 Work output feeling</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px" }}>
            {[
              { val: 3, lbl: "Flow State", desc: "High output" },
              { val: 2, lbl: "Grinding", desc: "Medium load" },
              { val: 1, lbl: "Struggling", desc: "Low efficiency" },
              { val: 0, lbl: "Shutdown", desc: "Zero output" }
            ].map((opt) => (
              <div 
                key={opt.val}
                onClick={() => setSelects({ ...selects, output: opt.val })}
                style={{
                  padding: "12px 10px", borderRadius: "10px", cursor: "pointer", border: selects.output === opt.val ? "1px solid var(--blue2)" : "1px solid var(--border)",
                  background: selects.output === opt.val ? "rgba(75,123,229,.07)" : "var(--bg3)", transition: "all 0.2s"
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: "600", color: selects.output === opt.val ? "var(--blue)" : "var(--text)" }}>{opt.lbl}</div>
                <div style={{ fontSize: "10px", color: "var(--text3)", marginTop: "2px" }}>{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Emotional State */}
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text3)", marginBottom: "8px" }}>😶 Emotional state</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px" }}>
            {[
              { val: 3, lbl: "Energized", desc: "Positive layout" },
              { val: 2, lbl: "Stable", desc: "Neutral zone" },
              { val: 1, lbl: "Overwhelmed", desc: "Anxious / Flat" },
              { val: 0, lbl: "Exhausted", desc: "Empty signature" }
            ].map((opt) => (
              <div 
                key={opt.val}
                onClick={() => setSelects({ ...selects, mood: opt.val })}
                style={{
                  padding: "12px 10px", borderRadius: "10px", cursor: "pointer", border: selects.mood === opt.val ? "1px solid var(--blue2)" : "1px solid var(--border)",
                  background: selects.mood === opt.val ? "rgba(75,123,229,.07)" : "var(--bg3)", transition: "all 0.2s"
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: "600", color: selects.mood === opt.val ? "var(--blue)" : "var(--text)" }}>{opt.lbl}</div>
                <div style={{ fontSize: "10px", color: "var(--text3)", marginTop: "2px" }}>{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Breaks Taken */}
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text3)", marginBottom: "8px" }}>☕ Breaks taken today</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px" }}>
            {[
              { val: 3, lbl: "Proper Rest", desc: "Left screen completely" },
              { val: 2, lbl: "Minimal", desc: "Ate lunch at desk" },
              { val: 1, lbl: "No Breaks", desc: "Sustained grinding" }
            ].map((opt) => (
              <div 
                key={opt.val}
                onClick={() => setSelects({ ...selects, breaks: opt.val })}
                style={{
                  padding: "12px 10px", borderRadius: "10px", cursor: "pointer", border: selects.breaks === opt.val ? "1px solid var(--blue2)" : "1px solid var(--border)",
                  background: selects.breaks === opt.val ? "rgba(75,123,229,.07)" : "var(--bg3)", transition: "all 0.2s"
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: "600", color: selects.breaks === opt.val ? "var(--blue)" : "var(--text)" }}>{opt.lbl}</div>
                <div style={{ fontSize: "10px", color: "var(--text3)", marginTop: "2px" }}>{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Action Trigger Row */}
      <div className="ci-actions">
        <button className="btn-full btn-blue" onClick={runCheckin} style={{ width: "100%", padding: "14px", fontWeight: "600", fontSize: "14px", display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
          🔍 Run My Assessment
        </button>
      </div>

      {/* --- Performance Metric Diagnostic View (Result Window) --- */}
      {result && (
        <div className="result-box" role="status" aria-live="polite" style={{ marginTop: "24px", padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                <div style={{ fontSize: "46px", fontWeight: "800", fontFamily: "var(--mono)", color: result.color, letterSpacing: "-1px" }}>{result.score}</div>
                <div style={{ fontSize: "15px", color: "var(--text3)", fontFamily: "var(--mono)" }}>/100</div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", letterSpacing: "0.6px", textTransform: "uppercase", fontFamily: "var(--mono)", marginBottom: "12px", background: result.score > 65 ? "rgba(192,57,43,.12)" : result.score > 35 ? "rgba(232,162,90,.12)" : "rgba(75,123,229,.12)", color: result.color, border: `1px solid ${result.color}40` }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: result.color, display: "inline-block" }}></span>
                {result.score > 65 ? "HIGH RISK" : result.score > 35 ? "MEDIUM RISK" : "HEALTHY SIGNATURE"}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text)", marginBottom: "4px" }}>{result.level}</div>
              <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: "1.6" }}>{result.desc}</p>
            </div>
          </div>

          <div className="result-tips" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {result.tips.map((tip, i) => (
              <div key={i} className="tip-row" style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "12.5px", color: "var(--text2)", lineHeight: "1.5" }}>
                <i className="ti ti-shield-check" style={{ color: result.color, fontSize: "16px", marginTop: "1px" }} aria-hidden="true"></i>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: "11px", color: "var(--text3)", textAlign: "center", marginTop: "20px", letterSpacing: "0.1px" }}>
        Not medical advice. For personal wellness profiling and cognitive optimization support only.
      </p>
    </div>
  );
}
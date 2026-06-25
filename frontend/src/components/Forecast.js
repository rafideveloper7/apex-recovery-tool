"use client";

export default function Forecast() {
  const forecastData = [
    { day: "TODAY", score: 74 },
    { day: "TUE", score: 79 },
    { day: "WED", score: 85 },
    { day: "THU", score: 91 },
    { day: "FRI", score: 95 },
    { day: "SAT", score: 99 },
    { day: "SUN", score: 100 },
  ];

  const getColor = (score) => {
    if (score > 75) return "var(--danger)";
    if (score > 65) return "var(--warn)";
    return "var(--blue)";
  };

  return (
    <>
      <div className="section-hd">
        <span className="section-title">Next 7 days forecast</span>
        <button className="btn-sm btn-ghost"><i className="ti ti-refresh"></i> Refresh</button>
      </div>
      <div className="forecast-row" role="list" aria-label="7-day risk forecast">
        {forecastData.map((f, i) => (
          <div key={i} className={`forecast-day ${i === 0 ? "today" : ""}`} role="listitem">
            <div className="fd-day">{f.day}</div>
            <div className="fd-score" style={{ color: getColor(f.score) }}>
              {i === forecastData.length - 1 ? "💥" : f.score}
            </div>
            <div className="fd-bar" style={{ background: getColor(f.score) }}></div>
          </div>
        ))}
      </div>
    </>
  );
}
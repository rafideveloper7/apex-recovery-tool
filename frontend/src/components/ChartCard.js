"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartCard({ title, subtitle }) {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Risk score",
        data: [38, 44, 51, 59, 67, 71, 74],
        borderColor: "#4B7BE5",
        backgroundColor: "rgba(75,123,229,0.07)",
        borderWidth: 2.5,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#4B7BE5",
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="chart-card dash-anim-5">
      <div className="chart-header">
        <div>
          <div className="chart-title">{title}</div>
          <div className="chart-sub">{subtitle}</div>
        </div>
        <div className="chart-badge cb-up">+36pts this week</div>
      </div>
      <div className="chart-wrap" style={{ position: 'relative', width: '100%', height: '240px' }}>
        <Line data={chartData} options={options} />
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
        <button className="btn-sm btn-ghost"><i className="ti ti-calendar-week"></i> 14-day</button>
        <button className="btn-sm btn-ghost"><i className="ti ti-calendar-month"></i> 30-day</button>
        <button className="btn-sm btn-ghost"><i className="ti ti-share"></i> Share</button>
      </div>
    </div>
  );
}
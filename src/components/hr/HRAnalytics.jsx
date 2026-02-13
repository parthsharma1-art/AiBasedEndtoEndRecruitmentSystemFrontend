import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function HRAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(CONFIG.BACKEND_URL + "/recruiter/analytics", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json().catch(() => null))
      .then(setData);
  }, []);

  return (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>AI Analytics</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        <div className="eval-section">
          <h3>Skill distribution among applicants</h3>
          <div className="chart-placeholder">
            {data?.skillDistribution ? "Chart data loaded" : "Chart: Skill distribution (connect backend)"}
          </div>
        </div>
        <div className="eval-section">
          <h3>Average interview score</h3>
          <div className="chart-placeholder">
            {data?.avgInterviewScore != null ? `${data.avgInterviewScore}%` : "Chart: Average interview score"}
          </div>
        </div>
        <div className="eval-section">
          <h3>Hiring time analytics</h3>
          <div className="chart-placeholder">
            Hiring funnel metrics (connect backend)
          </div>
        </div>
      </div>
    </div>
  );
}

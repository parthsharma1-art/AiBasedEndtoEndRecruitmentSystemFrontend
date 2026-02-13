import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function CandidateResults() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(CONFIG.BACKEND_URL + "/candidate/results", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json().catch(() => null))
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-content"><h2>Loading results...</h2></div>;

  const status = data?.finalStatus ?? data?.status ?? "Under Review";
  const statusColor = status === "Selected" ? "#22c55e" : status === "Rejected" ? "#ef4444" : "#f59e0b";

  return (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>Results</h1>
      <div className="score-grid" style={{ marginBottom: 24 }}>
        <div className="score-box">
          <span className="label">Resume Match Score</span>
          <span className="val">{data?.resumeMatchScore ?? "—"}</span>
        </div>
        <div className="score-box">
          <span className="label">Test Score</span>
          <span className="val">{data?.testScore ?? "—"}</span>
        </div>
        <div className="score-box">
          <span className="label">Interview Score</span>
          <span className="val">{data?.interviewScore ?? "—"}</span>
        </div>
      </div>
      <div className="eval-section">
        <h3>Final Status</h3>
        <p style={{ fontSize: "1.25rem", fontWeight: 700, color: statusColor }}>{status}</p>
        {data?.aiFeedback && <p><strong>AI Feedback:</strong> {data.aiFeedback}</p>}
      </div>
    </div>
  );
}

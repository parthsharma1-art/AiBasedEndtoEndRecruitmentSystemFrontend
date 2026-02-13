import React from "react";
import "../../styles/dashboard.css";

export default function HRSettings() {
  return (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>Settings</h1>
      <div className="eval-section">
        <p style={{ color: "#64748b" }}>Profile and notification settings. Use Profile in the top menu or Company for company details.</p>
      </div>
    </div>
  );
}

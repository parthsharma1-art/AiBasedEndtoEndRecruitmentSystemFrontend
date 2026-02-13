import React, { useState } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function HRReports() {
  const [loading, setLoading] = useState(false);

  const exportShortlisted = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(CONFIG.BACKEND_URL + "/recruiter/reports/shortlisted?format=csv", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "shortlisted-candidates.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Export not available. Connect backend endpoint /recruiter/reports/shortlisted");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>Reports</h1>
      <div className="eval-section">
        <h3>Export &amp; Reports</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <button
            className="btn-sm btn-view"
            style={{ padding: "10px 20px" }}
            onClick={exportShortlisted}
            disabled={loading}
          >
            Export shortlisted candidates (CSV)
          </button>
          <button
            className="btn-sm btn-edit"
            style={{ padding: "10px 20px" }}
            onClick={() => alert("Interview transcripts – connect backend")}
          >
            Interview transcripts
          </button>
          <button
            className="btn-sm btn-edit"
            style={{ padding: "10px 20px" }}
            onClick={() => alert("Assessment performance report – connect backend")}
          >
            Assessment performance report
          </button>
          <button
            className="btn-sm btn-edit"
            style={{ padding: "10px 20px" }}
            onClick={() => alert("Hiring statistics – connect backend")}
          >
            Hiring statistics
          </button>
        </div>
      </div>
    </div>
  );
}

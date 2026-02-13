import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

const STEPS = ["Resume Uploaded", "Matched", "Test", "Interview", "Final Status"];

export default function CandidateDashboardHome() {
  const [candidate, setCandidate] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(CONFIG.BACKEND_URL + "/candidate/get", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json().catch(() => null))
      .then((data) => {
        setCandidate(data);
        if (data?.progress != null) setProgress(data.progress);
        else if (data?.resumeId) setProgress(1);
        else setProgress(0);
      });
  }, []);

  const name = candidate?.name || "Candidate";

  return (
    <div className="dashboard-content">
      <div className="welcome-card">
        <h2>Welcome Back, {name}!</h2>
        <p>Track your application progress and next steps here.</p>
      </div>

      <div className="eval-section">
        <h3>Your Progress</h3>
        <div className="progress-tracker">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={"progress-step " + (i < progress ? "done" : i === progress ? "active" : "")}
            >
              {label}
            </div>
          ))}
        </div>
        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
          Resume Uploaded → Matched → Test → Interview → Final Status
        </p>
      </div>
    </div>
  );
}

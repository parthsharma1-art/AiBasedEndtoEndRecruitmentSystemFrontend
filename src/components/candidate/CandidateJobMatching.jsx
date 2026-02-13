import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function CandidateJobMatching() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(CONFIG.BACKEND_URL + "/candidate/jobs/matching", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json().catch(() => []))
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = (job) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(CONFIG.BACKEND_URL + "/candidate/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ jobId: job.id || job.jobId }),
    })
      .then((r) => r.json().catch(() => ({})))
      .then(() => alert("Application submitted."))
      .catch(() => alert("Apply failed. Connect backend."));
  };

  if (loading) return <div className="dashboard-content"><h2>Loading...</h2></div>;

  return (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>Job Matching</h1>

      {!selected ? (
        <>
          <p style={{ marginBottom: 16, color: "#64748b" }}>Jobs with your match percentage. Click a job to see JD and skills.</p>
          {jobs.length === 0 && <p>No matching jobs yet. Upload your resume first.</p>}
          {jobs.map((job, i) => (
            <div key={job.id || job.jobId || i} className="job-match-row">
              <div>
                <strong>{job.title}</strong>
                {job.companyName && <span style={{ color: "#64748b", marginLeft: 8 }}>{job.companyName}</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span className="match-pct">{job.matchPercent ?? job.matchScore ?? "—"}%</span>
                <button type="button" className="apply-btn" onClick={() => setSelected(job)}>View</button>
                <button type="button" className="apply-btn" onClick={() => handleApply(job)}>Apply</button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="eval-section">
          <button type="button" style={{ marginBottom: 16 }} onClick={() => setSelected(null)}>← Back to list</button>
          <h3>{selected.title}</h3>
          <p>{selected.description}</p>
          <p><strong>Matching skills:</strong> {Array.isArray(selected.matchingSkills) ? selected.matchingSkills.join(", ") : selected.matchingSkills || "—"}</p>
          <p><strong>Missing skills:</strong> {Array.isArray(selected.missingSkills) ? selected.missingSkills.join(", ") : selected.missingSkills || "—"}</p>
          <button type="button" className="apply-btn" onClick={() => handleApply(selected)}>Apply for this job</button>
        </div>
      )}
    </div>
  );
}

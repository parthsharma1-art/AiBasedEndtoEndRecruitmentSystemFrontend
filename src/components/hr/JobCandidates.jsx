import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function JobCandidates() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([
      fetch(CONFIG.BACKEND_URL + "/profile/jobs/" + jobId, { headers: { Authorization: "Bearer " + token } }).then((r) => r.json().catch(() => null)),
      fetch(CONFIG.BACKEND_URL + "/recruiter/jobs/" + jobId + "/candidates", { headers: { Authorization: "Bearer " + token } }).then((r) => r.json().catch(() => [])),
    ]).then(([jobData, list]) => {
      setJob(jobData);
      setCandidates(Array.isArray(list) ? list : []);
    }).finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <div className="dashboard-content"><h2>Loading...</h2></div>;

  return (
    <div className="dashboard-content">
      <button type="button" onClick={() => navigate("/dashboard/jobs")} style={{ marginBottom: 16, padding: "8px 16px", cursor: "pointer" }}>← Back to Jobs</button>
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>
        Candidates {job?.title ? `– ${job.title}` : ""}
      </h1>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Match Score</th>
            <th>Test Score</th>
            <th>Interview Score</th>
            <th>Ranking</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: "center", padding: 40 }}>No candidates for this job yet.</td></tr>
          )}
          {candidates.map((c, i) => (
            <tr key={c.id || c.candidateId || i}>
              <td>{c.name || c.email}</td>
              <td>{c.matchScore ?? c.resumeMatchScore ?? "—"}</td>
              <td>{c.testScore ?? c.mcqScore ?? "—"}</td>
              <td>{c.interviewScore ?? "—"}</td>
              <td>{c.ranking ?? "—"}</td>
              <td>
                <button type="button" className="btn-sm btn-view" onClick={() => navigate("/dashboard/candidates/evaluate/" + (c.id || c.candidateId))}>Evaluate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(CONFIG.BACKEND_URL + "/profile/jobs", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json().catch(() => []))
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const viewCandidates = (job) => {
    navigate("/dashboard/jobs/" + (job.id || job.jobId) + "/candidates");
  };

  if (loading) return <div className="dashboard-content"><h2>Loading jobs...</h2></div>;

  return (
    <div className="dashboard-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b" }}>Manage Jobs</h1>
        <button
          type="button"
          className="btn-sm btn-view"
          style={{ padding: "10px 20px" }}
          onClick={() => navigate("/dashboard/jobs/create")}
        >
          + Post New Job
        </button>
      </div>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Applications</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 && (
            <tr><td colSpan={4} style={{ textAlign: "center", padding: 40 }}>No jobs found. Post a job first.</td></tr>
          )}
          {jobs.map((job) => (
            <tr key={job.id || job.jobId}>
              <td>{job.title}</td>
              <td>{job.applicationCount ?? job.applications ?? 0}</td>
              <td>{job.active ? "Active" : "Closed"}</td>
              <td>
                <div className="actions">
                  <button type="button" className="btn-sm btn-view" onClick={() => viewCandidates(job)}>View</button>
                  <button type="button" className="btn-sm btn-edit" onClick={() => navigate("/dashboard/jobs/create?edit=" + (job.id || job.jobId))}>Edit</button>
                  <button type="button" className="btn-sm btn-close">Close</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

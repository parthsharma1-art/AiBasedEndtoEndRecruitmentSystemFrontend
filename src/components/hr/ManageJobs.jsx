import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      setLoading(false);
      setError("No authentication token found. Please login again.");
      navigate("/");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API endpoint: /api/jobs (GET)
      // Backend expects: @GetMapping("/jobs") with Authorization header
      const apiUrl = `${CONFIG.BACKEND_URL}/jobs`;
      
      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // 10 second timeout
      });
      
      // Handle response - backend returns List<JobPostingsResponse>
      let jobsData = [];
      if (Array.isArray(res.data)) {
        // Direct array response (expected format)
        jobsData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        // Wrapped in data property
        jobsData = res.data.data;
      } else if (res.data && Array.isArray(res.data.jobs)) {
        // Wrapped in jobs property
        jobsData = res.data.jobs;
      } else if (res.data && typeof res.data === 'object') {
        // If it's a single object, wrap it in an array
        jobsData = [res.data];
      }
      
      setJobs(jobsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      
      let errorMessage = "Error fetching jobs. ";
      if (err.code === 'ECONNABORTED') {
        errorMessage += "Request timed out. Please check your connection.";
      } else if (err.response) {
        errorMessage += err.response.data?.message || `Status: ${err.response.status}`;
        if (err.response.status === 401) {
          errorMessage += " - Unauthorized. Please login again.";
          localStorage.removeItem("token");
          navigate("/");
        } else if (err.response.status === 404) {
          errorMessage += " - Endpoint not found.";
        }
      } else if (err.request) {
        errorMessage += "No response from server. Please check if the backend is running.";
      } else {
        errorMessage += err.message || "Unknown error occurred.";
      }
      
      setError(errorMessage);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const viewCandidates = (job) => {
    navigate("/dashboard/jobs/" + (job.id || job.jobId) + "/candidates");
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <h2>Loading jobs...</h2>
        <p style={{ color: "#64748b", marginTop: 10 }}>Please wait while we fetch your jobs from the server...</p>
      </div>
    );
  }

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
          + Create Job
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: 16, 
          background: "#fee2e2", 
          border: "1px solid #fca5a5", 
          borderRadius: 8, 
          marginBottom: 24,
          color: "#991b1b"
        }}>
          <p style={{ margin: "0 0 12px", fontWeight: "bold" }}>Error Loading Jobs</p>
          <p style={{ margin: "0 0 12px" }}>{error}</p>
          <button
            onClick={fetchJobs}
            style={{
              padding: "8px 16px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!error && jobs.length === 0 && (
        <div style={{ 
          padding: 40, 
          textAlign: "center", 
          background: "#f9fafb", 
          borderRadius: 8,
          border: "1px solid #e5e7eb"
        }}>
          <p style={{ color: "#64748b", marginBottom: 16 }}>No jobs found. Create your first job posting!</p>
          <button
            type="button"
            className="btn-sm btn-view"
            style={{ padding: "10px 20px" }}
            onClick={() => navigate("/dashboard/jobs/create")}
          >
            + Create Job
          </button>
        </div>
      )}

      {!error && jobs.length > 0 && (
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
            {jobs.map((job, index) => (
              <tr key={job.id || job.jobId || index}>
                <td>{job.title || "No Title"}</td>
                <td>{job.applicationCount ?? job.applications ?? 0}</td>
                <td>{job.active !== undefined ? (job.active ? "Active" : "Closed") : "Unknown"}</td>
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
      )}
    </div>
  );
}

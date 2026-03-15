import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function HRDashboardHome() {
  const [hrName, setHrName] = useState("");
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalCandidates: 0,
    totalResumes: 0,
    activeJobs: 0,
    selected: 0,
    rejected: 0,
  });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
    fetchHrName();
  }, []);

  const fetchHrName = async () => {
    const token = localStorage.getItem("token");
    const cached = localStorage.getItem("hrName");
    if (cached) setHrName(cached);
    if (!token) return;
    try {
      const res = await fetch(CONFIG.BACKEND_URL + "/recruiter/get", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json().catch(() => ({}));
      if (data?.name) {
        setHrName(data.name);
        localStorage.setItem("hrName", data.name);
      }
    } catch {
      // keep cached or empty
    }
  };

  const fetchOverview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(CONFIG.BACKEND_URL + "/recruiter/overview", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json().catch(() => ({}));
      setStats({
        totalJobs: data.totalJobs ?? 0,
        totalApplications: data.totalApplications ?? 0,
        totalCandidates: data.totalCandidates ?? 0,
        totalResumes: data.totalResumes ?? 0,
        activeJobs: data.activeJobs ?? 0,
        selected: data.selected ?? 0,
        rejected: data.rejected ?? 0,
      });
      if (Array.isArray(data.recentActivity)) setActivity(data.recentActivity);
      else
        setActivity([
          "New resume uploaded",
          "Candidate completed AI test",
          "Interview completed",
          "Candidate shortlisted",
        ]);
    } catch (err) {
      console.error("Overview error:", err);
      setActivity([
        "New resume uploaded",
        "Candidate completed AI test",
        "Interview completed",
        "Candidate shortlisted",
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-content hr-dashboard-home">
      <div className="hr-dashboard-welcome">
        <h1 className="hr-dashboard-welcome-title">
          Welcome{hrName ? `, ${hrName}` : ""}!
        </h1>
        <p className="hr-dashboard-welcome-sub">Here’s what’s happening with your hiring pipeline.</p>
      </div>
      <h2 className="hr-dashboard-overview-heading">Dashboard Overview</h2>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Jobs Posted</h3>
          <div className="value">{stats.totalJobs}</div>
        </div>
        <div className="summary-card">
          <h3>Total Applications</h3>
          <div className="value">{stats.totalApplications}</div>
        </div>
        <div className="summary-card">
          <h3>Total Candidates</h3>
          <div className="value">{stats.totalCandidates}</div>
        </div>
        <div className="summary-card">
          <h3>Active Jobs</h3>
          <div className="value">{stats.activeJobs}</div>
        </div>
        <div className="summary-card">
          <h3>Selected</h3>
          <div className="value">{stats.selected}</div>
        </div>
        <div className="summary-card">
          <h3>Rejected</h3>
          <div className="value">{stats.rejected}</div>
        </div>
      </div>

      <div className="pipeline-section">
        <h3>Hiring Pipeline</h3>
        <div className="pipeline-funnel">
          <div className="pipeline-stage"><span>{stats.totalApplications}</span>Applications</div>
          <span className="pipeline-arrow">→</span>
          <div className="pipeline-stage"><span>{stats.totalCandidates}</span>Candidates</div>
          <span className="pipeline-arrow">→</span>
          <div className="pipeline-stage"><span>{stats.activeJobs}</span>Active Jobs</div>
          <span className="pipeline-arrow">→</span>
          <div className="pipeline-stage"><span>{stats.selected}</span>Selected</div>
          <span className="pipeline-arrow">→</span>
          <div className="pipeline-stage"><span>{stats.rejected}</span>Rejected</div>
        </div>
      </div>

      <div className="activity-feed">
        <h3>Recent Activity</h3>
        {activity.length === 0 ? (
          <p style={{ color: "#64748b" }}>No recent activity.</p>
        ) : (
          activity.map((item, i) => (
            <div key={i} className="activity-item">
              {typeof item === "string" ? item : item.message || item.text || JSON.stringify(item)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

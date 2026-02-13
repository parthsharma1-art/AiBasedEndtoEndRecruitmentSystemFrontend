import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function HRDashboardHome() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    interviewCompleted: 0,
    selected: 0,
    rejected: 0,
  });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

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
        totalApplications: data.totalCandidates ?? data.totalResumes ?? 0,
        shortlisted: data.shortlisted ?? 0,
        interviewCompleted: data.interviewCompleted ?? 0,
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
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>Dashboard Overview</h1>

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
          <h3>Shortlisted</h3>
          <div className="value">{stats.shortlisted}</div>
        </div>
        <div className="summary-card">
          <h3>Interview Completed</h3>
          <div className="value">{stats.interviewCompleted}</div>
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
          <div className="pipeline-stage"><span>{stats.shortlisted}</span>Resume Matched</div>
          <span className="pipeline-arrow">→</span>
          <div className="pipeline-stage"><span>{stats.interviewCompleted}</span>Test Passed</div>
          <span className="pipeline-arrow">→</span>
          <div className="pipeline-stage"><span>{stats.selected}</span>Interview Passed</div>
          <span className="pipeline-arrow">→</span>
          <div className="pipeline-stage"><span>{stats.selected}</span>Selected</div>
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

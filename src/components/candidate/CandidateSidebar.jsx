import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/dashboard.css";

const menuItems = [
  { path: "/candidate-dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/candidate-dashboard/resume", label: "Upload Resume", icon: "📄" },
  { path: "/candidate-dashboard/jobs", label: "Job Matching", icon: "🔍" },
  { path: "/candidate-dashboard/assessment", label: "Assessment", icon: "📝" },
  { path: "/candidate-dashboard/interview", label: "AI Interview", icon: "🎤" },
  { path: "/candidate-dashboard/results", label: "Results", icon: "📊" },
  { path: "/candidate-dashboard/profile", label: "Profile", icon: "👤" },
];

export default function CandidateSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: 260,
        background: "#0f172a",
        color: "white",
        height: "100%",
        padding: 20,
        boxSizing: "border-box",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      <div>
        <h2 style={{ marginBottom: 30 }}>Candidate</h2>
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: "14px 0",
              borderBottom: "1px solid #1f2937",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: location.pathname === item.path ? "rgba(79, 70, 229, 0.2)" : "transparent",
              marginLeft: -20,
              marginRight: -20,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: "8px 16px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          width: "100%",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
    </div>
  );
}

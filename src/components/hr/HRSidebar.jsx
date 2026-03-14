import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import showToast from "../../utils/toast";
import "../../styles/dashboard.css";

const menuItems = [
  { path: "/dashboard", label: "Dashboard Overview", icon: "📊" },
  { path: "/dashboard/jobs/create", label: "Post New Job", icon: "➕" },
  { path: "/dashboard/jobs", label: "Manage Jobs", icon: "📂" },
  { path: "/dashboard/candidates", label: "Candidates", icon: "👥" },
  { path: "/dashboard/chats", label: "Chats", icon: "💬" },
  { path: "/dashboard/ai-analytics", label: "AI Analytics", icon: "🧠" },
  { path: "/dashboard/reports", label: "Reports", icon: "📄" },
  { path: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function HRSidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = window.innerWidth <= 768;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: isMobile ? 240 : 260,
        background: "#0f172a",
        color: "white",
        height: "100vh",
        padding: 20,
        boxSizing: "border-box",
        overflowY: "auto"
      }}
    >
      {isMobile && onClose && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>HR Panel</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              padding: "4px 8px"
            }}
          >
            ✕
          </button>
        </div>
      )}
      {!isMobile && (
        <h2 style={{ marginBottom: 30 }}>HR Panel</h2>
      )}
      <div>
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
      <div>
        <button
          onClick={() => navigate("/dashboard/profile")}
          style={{
            padding: "8px 16px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            width: "100%",
            marginBottom: 10,
            fontWeight: "bold",
          }}
        >
          Profile
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            showToast("Logged out successfully", "success");
            navigate("/");
          }}
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
    </div>
  );
}

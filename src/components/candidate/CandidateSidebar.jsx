import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/dashboard.css";

const menuItems = [
  { path: "/candidate-dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/candidate-dashboard/resume", label: "Upload Resume", icon: "📄" },
  { path: "/candidate-dashboard/jobs", label: "Jobs", icon: "🔍" },
  { path: "/candidate-dashboard/chats", label: "Chats", icon: "💬" },
  { path: "/candidate-dashboard/assessment", label: "Assessment", icon: "📝" },
  { path: "/candidate-dashboard/interview", label: "AI Interview", icon: "🎤" },
  { path: "/candidate-dashboard/results", label: "Results", icon: "📊" },
  { path: "/candidate-dashboard/profile", label: "Profile", icon: "👤" },
];

export default function CandidateSidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const sidebarWidth = isMobile ? 280 : 260;

  return (
    <div
      className="candidate-sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: sidebarWidth,
        maxWidth: "85vw",
        background: "#0f172a",
        color: "white",
        height: "100%",
        minHeight: isMobile ? "100vh" : undefined,
        padding: 20,
        boxSizing: "border-box",
        flexShrink: 0,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div>
        {isMobile && onClose && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Candidate</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: 24,
                cursor: "pointer",
                padding: "4px 8px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        )}
        {!isMobile && <h2 style={{ marginBottom: 30, fontSize: "1.25rem" }}>Candidate</h2>}
        {menuItems.map((item) => {
          const handleClick = () => {
            if (onClose) onClose();
            if (item.path === "/candidate-dashboard/jobs") {
              navigate("/candidate-dashboard/jobs");
            } else {
              navigate(item.path);
            }
          };

          const isActive =
            item.path === "/candidate-dashboard/jobs"
              ? location.pathname === "/candidate-dashboard/jobs"
              : location.pathname === item.path;

          return (
            <div
              key={item.path}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick();
                }
              }}
              style={{
                padding: "14px 0",
                borderBottom: "1px solid #1f2937",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: isActive ? "rgba(79, 70, 229, 0.2)" : "transparent",
                marginLeft: -20,
                marginRight: -20,
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        style={{
          padding: "10px 16px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          width: "100%",
          fontWeight: "bold",
          fontSize: "0.95rem",
        }}
      >
        Logout
      </button>
    </div>
  );
}

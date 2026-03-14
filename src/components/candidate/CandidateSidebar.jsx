import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import showToast from "../../utils/toast";
import "../../styles/dashboard.css";

const menuItems = [
  { path: "/candidate-dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/candidate-dashboard/resume", label: "Upload Resume", icon: "📄" },
  // Jobs should open the public browse jobs page
  { path: "/browse-jobs", label: "Jobs", icon: "🔍" },
  { path: "/candidate-dashboard/applied-jobs", label: "Applied Jobs", icon: "📋" },
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
    showToast("Logged out successfully", "success");
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
        maxWidth: isMobile ? "85vw" : "none",
        minWidth: 0,
        background: "#0f172a",
        color: "white",
        height: "100%",
        minHeight: isMobile ? "100vh" : undefined,
        padding: 20,
        boxSizing: "border-box",
        flexShrink: 0,
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <div className="candidate-sidebar-menu" style={{ flex: 1, minHeight: 0, minWidth: 0, overflowX: "hidden", overflowY: "auto" }}>
        {isMobile && onClose && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexShrink: 0,
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
                minWidth: 44,
                minHeight: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
            navigate(item.path);
          };

          const isActive = location.pathname === item.path;

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
                minWidth: 0,
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{item.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ flexShrink: 0 }}>
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
    </div>
  );
}

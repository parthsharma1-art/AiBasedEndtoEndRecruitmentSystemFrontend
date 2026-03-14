import React, { useState, useEffect } from "react";
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
  { path: "/dashboard/profile", label: "Profile", icon: "👤" },
];

export default function HRSidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNav = (path) => {
    if (onClose) onClose();
    navigate(path);
  };

  return (
    <div
      className="hr-sidebar"
      style={{
        width: isMobile ? 280 : 260,
        maxWidth: isMobile ? "85vw" : "none",
        background: "#0f172a",
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 20,
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Header - always visible at top when scrolling */}
      <div style={{ flexShrink: 0 }}>
        {isMobile && onClose ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>HR Panel</h2>

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
                minWidth: 44,
                minHeight: 44,
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <h2 style={{ marginBottom: 20, fontSize: "1.25rem" }}>HR Panel</h2>
        )}
      </div>

      {/* Menu list - scrolls with sidebar */}
      <div
        className="hr-sidebar-menu"
        style={{
          flex: "0 0 auto",
          marginLeft: -20,
          marginRight: -20,
        }}
      >
        {menuItems.map((item) => (
          <div
            key={item.path}
            role="button"
            tabIndex={0}
            onClick={() => handleNav(item.path)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNav(item.path);
              }
            }}
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #1f2937",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background:
                location.pathname === item.path
                  ? "rgba(79, 70, 229, 0.2)"
                  : "transparent",
            }}
          >
            <span>{item.icon}</span>

            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Logout Footer - always at bottom of sidebar, visible when user scrolls down */}
      <div style={{ flexShrink: 0, paddingTop: 16, paddingBottom: 8 }}>
        <button
          type="button"
          onClick={() => {
            if (onClose) onClose();
            localStorage.clear();
            showToast("Logged out successfully", "success");
            navigate("/");
          }}
          style={{
            padding: "10px 16px",
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

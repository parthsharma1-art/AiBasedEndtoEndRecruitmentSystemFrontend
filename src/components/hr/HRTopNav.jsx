import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Config from "../../config/config";

export default function HRTopNav() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${Config.BACKEND_URL}/recruiter/get`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    setShowDropdown(false);
    if (!token) {
      localStorage.clear();
      navigate("/");
      return;
    }
    try {
      await fetch(`${Config.BACKEND_URL}/recruiter/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {}
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="top-nav">
      <div className="top-nav-logo">AI-Based Recruitment System</div>
      <div className="top-nav-right">
        <div className="top-nav-notify" title="Notifications">
          <span>🔔</span>
          <span className="top-nav-notify-badge" aria-hidden />
        </div>
        <div className="top-nav-profile">
          <button
            type="button"
            className="top-nav-profile-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>{profile?.name || "HR"}</span>
            <span>▼</span>
          </button>
          {showDropdown && (
            <>
              <div
                role="presentation"
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
                onClick={() => setShowDropdown(false)}
              />
              <div className="top-nav-dropdown">
                <button type="button" onClick={() => { setShowDropdown(false); navigate("/dashboard"); }}>
                  Dashboard
                </button>
                <button type="button" onClick={() => { setShowDropdown(false); navigate("/dashboard/profile"); }}>
                  Profile
                </button>
                <button type="button" onClick={() => { setShowDropdown(false); navigate("/dashboard/settings"); }}>
                  Settings
                </button>
                <button type="button" onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

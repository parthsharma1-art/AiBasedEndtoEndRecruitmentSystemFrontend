import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CandidateTopNav() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="top-nav">
      <div className="top-nav-logo">AI-Based Recruitment System</div>
      <div className="top-nav-right">
        <div className="top-nav-notify" title="Notifications">
          <span>🔔</span>
        </div>
        <div className="top-nav-profile">
          <button
            type="button"
            className="top-nav-profile-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>Profile</span>
            <span>▼</span>
          </button>
          {showDropdown && (
            <>
              <div role="presentation" style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setShowDropdown(false)} />
              <div className="top-nav-dropdown">
                <button type="button" onClick={() => { setShowDropdown(false); navigate("/candidate-dashboard/profile"); }}>Profile</button>
                <button type="button" onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

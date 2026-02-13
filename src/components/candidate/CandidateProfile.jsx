import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(CONFIG.BACKEND_URL + "/candidate/get", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json().catch(() => null))
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-content"><h2>Loading profile...</h2></div>;
  if (!profile) return <div className="dashboard-content"><h2>Profile not found.</h2></div>;

  return (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>Profile</h1>
      <div className="eval-section">
        <h3>Personal Info</h3>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Mobile:</strong> {profile.mobileNumber ?? "—"}</p>
      </div>
      <div className="eval-section">
        <h3>Education</h3>
        <p>{profile.education ?? "—"}</p>
      </div>
      <div className="eval-section">
        <h3>Skills</h3>
        <p>{Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills ?? "—"}</p>
      </div>
      <div className="eval-section">
        <h3>LinkedIn</h3>
        <p>{profile.linkedIn ? <a href={profile.linkedIn} target="_blank" rel="noreferrer">{profile.linkedIn}</a> : "—"}</p>
      </div>
      <p style={{ color: "#64748b" }}>Edit profile – connect backend PATCH /candidate/update</p>
    </div>
  );
}

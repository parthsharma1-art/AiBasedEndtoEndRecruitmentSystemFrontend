import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function CandidateEvaluation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(CONFIG.BACKEND_URL + "/recruiter/candidate/" + id, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json().catch(() => null))
      .then((data) => {
        setCandidate(data);
        setScores({
          resumeMatch: data.resumeMatchScore ?? data.matchScore ?? 0,
          mcq: data.mcqScore ?? 0,
          coding: data.codingScore ?? 0,
          interview: data.interviewScore ?? 0,
          overall: data.overallScore ?? data.compositeScore ?? 0,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action) => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;
    try {
      const res = await fetch(CONFIG.BACKEND_URL + "/recruiter/candidate/" + id + "/action", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        alert("Action recorded.");
        navigate("/dashboard/candidates");
      } else {
        alert("Action failed. Connect backend for " + action);
      }
    } catch (e) {
      alert("Action failed. Connect backend for " + action);
    }
  };

  if (loading) return <div className="dashboard-content"><h2>Loading...</h2></div>;
  if (!candidate && !id) return <div className="dashboard-content"><h2>Select a candidate from the list.</h2></div>;
  if (!candidate) return <div className="dashboard-content"><h2>Candidate not found.</h2></div>;

  const resumeUrl = candidate.resumeUrl || (candidate.resumeId ? `${CONFIG.BACKEND_URL}/file/${candidate.resumeId}` : null);
  const profileImageUrl = candidate.profileImageId ? `${CONFIG.BACKEND_URL}/file/${candidate.profileImageId}` : null;
  const skillsList = Array.isArray(candidate.skills) ? candidate.skills : candidate.skills ? [candidate.skills] : [];

  return (
    <div className="dashboard-content">
      <button type="button" className="btn-back-to-candidates" onClick={() => navigate("/dashboard/candidates")}>← Back to Candidates</button>
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>Candidate Details</h1>

      <div className="eval-section">
        <h3>Candidate Profile</h3>
        <div className="eval-profile-header">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt={candidate.name} className="eval-profile-avatar" onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
          ) : null}
          <div className="eval-profile-avatar-placeholder" style={{ display: profileImageUrl ? "none" : "flex" }}>
            {(candidate.name || "?")[0].toUpperCase()}
          </div>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: 600 }}>{candidate.name || "—"}</p>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>{candidate.email || "—"}</p>
          </div>
        </div>
        <dl className="candidate-details-dl">
          <dt>ID</dt><dd>{candidate.id || "—"}</dd>
          <dt>Name</dt><dd>{candidate.name || "—"}</dd>
          <dt>Email</dt><dd>{candidate.email || "—"}</dd>
          <dt>Mobile</dt><dd>{candidate.mobileNumber || "—"}</dd>
          <dt>Age</dt><dd>{candidate.age != null ? candidate.age : "—"}</dd>
          <dt>Gender</dt><dd>{candidate.gender || "—"}</dd>
          <dt>Location</dt><dd>{candidate.location || "—"}</dd>
          <dt>Highest qualification</dt><dd>{candidate.highestQualification || "—"}</dd>
          <dt>Skills</dt>
          <dd>
            {skillsList.length > 0 ? (
              <ul className="candidate-skills-list">
                {skillsList.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              "—"
            )}
          </dd>
        </dl>
      </div>

      {resumeUrl && (
        <div className="eval-section">
          <h3>Resume</h3>
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn-open-resume">Open Resume</a>
        </div>
      )}

      <div className="eval-section">
        <h3>AI Scores</h3>
        <div className="score-grid">
          <div className="score-box"><span className="label">Resume Match</span><span className="val">{scores.resumeMatch}</span></div>
          <div className="score-box"><span className="label">MCQ Score</span><span className="val">{scores.mcq}</span></div>
          <div className="score-box"><span className="label">Coding Score</span><span className="val">{scores.coding}</span></div>
          <div className="score-box"><span className="label">Interview Score</span><span className="val">{scores.interview}</span></div>
          <div className="score-box"><span className="label">Overall</span><span className="val">{scores.overall}</span></div>
        </div>
      </div>

      <div className="eval-section">
        <h3>AI Explanation</h3>
        <p>{candidate.aiExplanation || candidate.whyShortlisted || "Key matching skills and weak areas (connect backend for explainable AI)."}</p>
        <p><strong>Key matching skills:</strong> {candidate.matchingSkills || "—"}</p>
        <p><strong>Weak areas:</strong> {candidate.weakAreas || "—"}</p>
      </div>

      <div className="eval-section">
        <h3>HR Actions</h3>
        <div className="hr-actions">
          <button type="button" className="btn-shortlist" onClick={() => handleAction("shortlist")}>Shortlist</button>
          <button type="button" className="btn-reject" onClick={() => handleAction("reject")}>Reject</button>
          <button type="button" className="btn-final" onClick={() => handleAction("final_round")}>Move to Final Round</button>
          <button type="button" className="btn-offer" onClick={() => handleAction("offer")}>Offer Letter</button>
        </div>
      </div>
    </div>
  );
}

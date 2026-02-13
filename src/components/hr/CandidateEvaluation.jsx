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

  return (
    <div className="dashboard-content">
      <button type="button" onClick={() => navigate("/dashboard/candidates")} style={{ marginBottom: 16, padding: "8px 16px", cursor: "pointer" }}>← Back to Candidates</button>
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>Candidate Evaluation</h1>

      <div className="eval-section">
        <h3>Candidate Profile</h3>
        <p><strong>Name:</strong> {candidate.name}</p>
        <p><strong>Email:</strong> {candidate.email}</p>
        <p><strong>Experience:</strong> {candidate.experience ?? 0} yrs</p>
        <p><strong>Parsed skills:</strong> {Array.isArray(candidate.skills) ? candidate.skills.join(", ") : candidate.skills || "—"}</p>
        <p><strong>Education:</strong> {candidate.education || "—"}</p>
        {resumeUrl && (
          <a href={resumeUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 8, color: "#4f46e5" }}>Download Resume</a>
        )}
      </div>

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

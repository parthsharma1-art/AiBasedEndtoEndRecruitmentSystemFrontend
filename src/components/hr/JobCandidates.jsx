import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function JobCandidates() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatModal, setChatModal] = useState({ open: false, candidate: null });
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [recruiterId, setRecruiterId] = useState(null);

  useEffect(() => {
    fetchRecruiterId();
    if (!jobId) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([
      fetch(CONFIG.BACKEND_URL + "/profile/jobs/" + jobId, { headers: { Authorization: "Bearer " + token } }).then((r) => r.json().catch(() => null)),
      fetch(CONFIG.BACKEND_URL + "/recruiter/jobs/" + jobId + "/candidates", { headers: { Authorization: "Bearer " + token } }).then((r) => r.json().catch(() => [])),
    ]).then(([jobData, list]) => {
      setJob(jobData);
      setCandidates(Array.isArray(list) ? list : []);
    }).finally(() => setLoading(false));
  }, [jobId]);

  const fetchRecruiterId = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await axios.get(CONFIG.BACKEND_URL + "/recruiter/get", {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.data && res.data.id) {
        setRecruiterId(res.data.id);
      }
    } catch (e) {
      console.error("Failed to fetch recruiter ID:", e);
    }
  };

  const handleChatClick = (candidate) => {
    setChatModal({ open: true, candidate });
    setChatMessage("");
  };

  const handleChatClose = () => {
    setChatModal({ open: false, candidate: null });
    setChatMessage("");
  };

  const handleChatSubmit = async () => {
    if (!chatModal.candidate || !recruiterId || !chatMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    const candidateId = chatModal.candidate.id || chatModal.candidate.candidateId;
    if (!candidateId) {
      alert("Candidate ID not found");
      return;
    }

    try {
      setChatLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        CONFIG.BACKEND_URL + "/recruiter/chats",
        {
          recruiterId: recruiterId,
          candidateId: candidateId,
          message: chatMessage.trim(),
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      handleChatClose();
      // Navigate to chats view with the new chat ID
      if (res.data && res.data.id) {
        navigate(`/dashboard/chats/${res.data.id}`);
      } else {
        navigate(`/dashboard/chats`);
      }
    } catch (e) {
      console.error("Failed to create chat:", e);
      const errorMsg = e.response?.data?.message || e.message || "Failed to create chat";
      alert(errorMsg);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return <div className="dashboard-content"><h2>Loading...</h2></div>;

  return (
    <div className="dashboard-content">
      <button type="button" onClick={() => navigate("/dashboard/jobs")} style={{ marginBottom: 16, padding: "8px 16px", cursor: "pointer" }}>← Back to Jobs</button>
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>
        Candidates {job?.title ? `– ${job.title}` : ""}
      </h1>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Match Score</th>
            <th>Test Score</th>
            <th>Interview Score</th>
            <th>Ranking</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: "center", padding: 40 }}>No candidates for this job yet.</td></tr>
          )}
          {candidates.map((c, i) => (
            <tr key={c.id || c.candidateId || i}>
              <td>{c.name || c.email}</td>
              <td>{c.matchScore ?? c.resumeMatchScore ?? "—"}</td>
              <td>{c.testScore ?? c.mcqScore ?? "—"}</td>
              <td>{c.interviewScore ?? "—"}</td>
              <td>{c.ranking ?? "—"}</td>
              <td>
                <div className="actions">
                  <button type="button" className="btn-sm btn-view" onClick={() => navigate("/dashboard/candidates/evaluate/" + (c.id || c.candidateId))}>Evaluate</button>
                  <button type="button" className="btn-sm btn-chat" onClick={() => handleChatClick(c)} style={{ background: "#10b981", color: "#fff", marginLeft: "8px" }}>
                    <ChatIcon /> Chat
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chat Modal */}
      {chatModal.open && (
        <div className="chat-modal-overlay" onClick={handleChatClose}>
          <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="chat-modal-header">
              <h3>Chat with {chatModal.candidate?.name || chatModal.candidate?.email || "Candidate"}</h3>
              <button type="button" className="chat-modal-close" onClick={handleChatClose}>×</button>
            </div>
            <div className="chat-modal-body">
              <textarea
                className="chat-modal-textarea"
                placeholder="Enter your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                rows={6}
                disabled={chatLoading}
              />
            </div>
            <div className="chat-modal-footer">
              <button type="button" className="btn-chat-cancel" onClick={handleChatClose} disabled={chatLoading}>
                Cancel
              </button>
              <button type="button" className="btn-chat-send" onClick={handleChatSubmit} disabled={chatLoading || !chatMessage.trim()}>
                {chatLoading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

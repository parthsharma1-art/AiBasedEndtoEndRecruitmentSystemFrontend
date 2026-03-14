import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "./config/config";
import showToast from "./utils/toast";

const API = Config.BACKEND_URL + "/recruiter";
const FILE_BASE = Config.BACKEND_URL + "/file";

/* Internal CSS for Recruiter Candidates page - self-contained, no external dashboard.css dependency */
const candidatesPageStyles = `
.rc-page-wrap { flex: 1; min-height: 100%; min-height: min(100%, 100vh); display: flex; flex-direction: column; background: #f1f5f9; padding: 24px; box-sizing: border-box; }
.rc-card { background: #fff; border-radius: 14px; padding: 28px 32px; box-shadow: 0 2px 8px rgba(0,0,0,.06); max-width: 1200px; width: 100%; margin: 0 auto; border: 1px solid #e2e8f0; flex-shrink: 0; }
.rc-title { margin: 0 0 24px; font-size: 1.4rem; color: #1e293b; font-weight: 600; letter-spacing: -0.02em; }
.rc-loading, .rc-empty { margin: 24px 0; color: #64748b; font-size: 1rem; }
.rc-list-wrap { border: 1px solid #e2e8f0; border-radius: 12px; overflow: auto; background: #fff; width: 100%; }
.rc-list { width: 100%; border-collapse: collapse; table-layout: fixed; }
.rc-list thead tr { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.rc-list th { padding: 16px 20px; text-align: left; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
.rc-list th.rc-th-name { width: 28%; min-width: 160px; }
.rc-list th.rc-th-contact { width: 32%; min-width: 160px; }
.rc-list th.rc-th-id { width: 14%; min-width: 90px; text-align: right; padding-right: 24px; }
.rc-list th.rc-th-details { width: 26%; min-width: 140px; text-align: right; padding-right: 24px; }
.rc-list tbody tr { cursor: pointer; background: #fff; border-bottom: 1px solid #f1f5f9; transition: background 0.15s; }
.rc-list tbody tr:last-child { border-bottom: none; }
.rc-list tbody tr:hover { background: #f8fafc; }
.rc-list td { padding: 18px 20px; vertical-align: middle; }
.rc-list td.rc-td-id { text-align: right; padding-right: 24px; }
.rc-list td.rc-td-actions { text-align: right; padding-right: 24px; }
.rc-name-inner { display: flex; align-items: center; gap: 16px; min-width: 0; }
.rc-avatar-wrap { flex-shrink: 0; }
.rc-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; display: block; }
.rc-avatar-placeholder { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); color: #4f46e5; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.95rem; }
.rc-avatar-initials { color: #4338ca; font-weight: 700; letter-spacing: 0.02em; }
.rc-name { font-weight: 600; font-size: 1rem; color: #1e293b; }
.rc-contact-cell { font-size: 0.9rem; color: #475569; }
.rc-contact-item { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.rc-contact-item:last-child { margin-bottom: 0; }
.rc-contact-icon { color: #94a3b8; flex-shrink: 0; display: inline-flex; }
.rc-contact-empty { color: #94a3b8; }
.rc-id-badge { display: inline-block; padding: 6px 10px; background: #f1f5f9; color: #475569; font-size: 0.8rem; font-weight: 600; border-radius: 6px; font-family: ui-monospace, monospace; }
.rc-actions-cell { vertical-align: middle; }
.rc-actions-inner { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
.rc-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 14px; font-size: 0.8125rem; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background 0.2s, color 0.2s; white-space: nowrap; border: none; font-family: inherit; text-decoration: none; box-sizing: border-box; min-width: 120px; max-width: 140px; }
.rc-btn-resume { background: #2563eb; color: #fff; }
.rc-btn-resume:hover { background: #1d4ed8; color: #fff; }
.rc-btn-chat { background: #10b981; color: #fff; }
.rc-btn-chat:hover { background: #059669; color: #fff; }
.rc-btn-details { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }
.rc-btn-details:hover { background: #f1f5f9; color: #1e293b; border-color: #cbd5e1; }
.rc-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.rc-modal-content { background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 100%; max-width: 500px; max-height: 90vh; display: flex; flex-direction: column; }
.rc-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
.rc-modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 600; color: #1e293b; }
.rc-modal-close { background: none; border: none; font-size: 28px; color: #64748b; cursor: pointer; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; }
.rc-modal-close:hover { background: #f1f5f9; color: #1e293b; }
.rc-modal-body { padding: 20px 24px; flex: 1; min-height: 0; overflow: auto; }
.rc-modal-textarea { width: 100%; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; font-family: inherit; resize: vertical; box-sizing: border-box; }
.rc-modal-footer { display: flex; gap: 12px; justify-content: flex-end; padding: 16px 24px; border-top: 1px solid #e5e7eb; }
.rc-btn-cancel { padding: 10px 20px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #475569; font-weight: 500; cursor: pointer; }
.rc-btn-cancel:hover { background: #f8fafc; }
.rc-btn-send { padding: 10px 20px; border-radius: 8px; border: none; background: #2563eb; color: #fff; font-weight: 600; cursor: pointer; }
.rc-btn-send:hover { background: #1d4ed8; }
.rc-btn-send:disabled, .rc-btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PersonIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

function getInitials(name) {
  if (!name || typeof name !== "string") return null;
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function CandidateAvatar({ candidate, fileBase }) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const hasImage = candidate.profileImageId && !imageFailed;
  const initials = getInitials(candidate.name);

  return (
    <div className="rc-avatar-wrap">
      {candidate.profileImageId && !imageFailed ? (
        <img
          src={`${fileBase}/${candidate.profileImageId}`}
          alt=""
          className="rc-avatar"
          onError={() => setImageFailed(true)}
        />
      ) : null}
      <div className="rc-avatar-placeholder" style={{ display: hasImage ? "none" : "flex" }} aria-hidden="true">
        {initials ? <span className="rc-avatar-initials">{initials}</span> : <PersonIcon />}
      </div>
    </div>
  );
}

function formatCandidateId(id) {
  if (id == null || id === "") return "—";
  const s = String(id);
  return s.startsWith("cd_") ? s : `cd_${s}`;
}

function CandidateRow({ candidate: c, index, onOpenDetail, onChatClick, fileBase }) {
  return (
    <tr
      onClick={(e) => { if (!e.target.closest(".rc-actions-cell")) onOpenDetail(); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !e.target.closest(".rc-actions-cell") && onOpenDetail()}
    >
      <td>
        <div className="rc-name-inner">
          <CandidateAvatar candidate={c} fileBase={fileBase} />
          <span className="rc-name">{c.name || "—"}</span>
        </div>
      </td>
      <td className="rc-contact-cell">
        {c.mobileNumber && (
          <div className="rc-contact-item">
            <span className="rc-contact-icon" aria-hidden="true"><PhoneIcon /></span>
            <span>{c.mobileNumber}</span>
          </div>
        )}
        {c.email && (
          <div className="rc-contact-item">
            <span className="rc-contact-icon" aria-hidden="true"><EmailIcon /></span>
            <span>{c.email}</span>
          </div>
        )}
        {!c.mobileNumber && !c.email && <span className="rc-contact-empty">—</span>}
      </td>
      <td className="rc-td-id">
        <span className="rc-id-badge">{formatCandidateId(c.id ?? c.candidateId)}</span>
      </td>
      <td className="rc-td-actions rc-actions-cell" onClick={(e) => e.stopPropagation()}>
        <div className="rc-actions-inner">
          {c.resumeId && (
            <a href={`${fileBase}/${c.resumeId}`} target="_blank" rel="noreferrer" className="rc-btn rc-btn-resume">
              View Resume
            </a>
          )}
          <button type="button" className="rc-btn rc-btn-chat" onClick={() => onChatClick()}>
            <ChatIcon /> Chat
          </button>
          <button type="button" className="rc-btn rc-btn-details" onClick={() => onOpenDetail()}>
            View details →
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Candidates() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatModal, setChatModal] = useState({ open: false, candidate: null });
    const [chatMessage, setChatMessage] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [recruiterId, setRecruiterId] = useState(null);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(API + "/candidate/get-all", {
                headers: token ? { Authorization: "Bearer " + token } : {},
            });
            setList(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.log(e);
            showToast("Failed to load candidates", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
        fetchRecruiterId();
    }, []);

    const fetchRecruiterId = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const res = await axios.get(API + "/get", {
                headers: { Authorization: "Bearer " + token },
            });
            if (res.data && res.data.id) {
                setRecruiterId(res.data.id);
            }
        } catch (e) {
            console.error("Failed to fetch recruiter ID:", e);
        }
    };

    const openCandidateDetail = (c, index) => {
        const id = c.id || c.candidateId || index;
        navigate("/dashboard/candidates/evaluate/" + id);
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
            showToast("Please enter a message", "error");
            return;
        }

        const candidateId = chatModal.candidate.id || chatModal.candidate.candidateId;
        if (!candidateId) {
            showToast("Candidate ID not found", "error");
            return;
        }

        try {
            setChatLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.post(
                Config.BACKEND_URL + "/recruiter/chats",
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
            showToast(errorMsg, "error");
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="rc-page-wrap">
            <style>{candidatesPageStyles}</style>
            <div className="rc-card">
                <h2 className="rc-title">Candidates</h2>

                {loading && <p className="rc-loading">Loading candidates...</p>}

                {!loading && list.length === 0 && <p className="rc-empty">No candidates found</p>}

                {!loading && list.length > 0 && (
                    <div className="rc-list-wrap">
                        <table className="rc-list" cellSpacing={0} cellPadding={0}>
                            <thead>
                                <tr>
                                    <th className="rc-th-name" scope="col">Candidate</th>
                                    <th className="rc-th-contact" scope="col">Contact</th>
                                    <th className="rc-th-id" scope="col">Candidate ID</th>
                                    <th className="rc-th-details" scope="col">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((c, index) => (
                                    <CandidateRow
                                        key={c.id || c.candidateId || index}
                                        candidate={c}
                                        index={index}
                                        onOpenDetail={() => openCandidateDetail(c, index)}
                                        onChatClick={() => handleChatClick(c)}
                                        fileBase={FILE_BASE}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {chatModal.open && (
                <div className="rc-modal-overlay" onClick={handleChatClose}>
                    <div className="rc-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="rc-modal-header">
                            <h3>Chat with {chatModal.candidate?.name || "Candidate"}</h3>
                            <button type="button" className="rc-modal-close" onClick={handleChatClose}>×</button>
                        </div>
                        <div className="rc-modal-body">
                            <textarea
                                className="rc-modal-textarea"
                                placeholder="Enter your message..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                rows={6}
                                disabled={chatLoading}
                            />
                        </div>
                        <div className="rc-modal-footer">
                            <button type="button" className="rc-btn-cancel" onClick={handleChatClose} disabled={chatLoading}>
                                Cancel
                            </button>
                            <button type="button" className="rc-btn-send" onClick={handleChatSubmit} disabled={chatLoading || !chatMessage.trim()}>
                                {chatLoading ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

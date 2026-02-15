import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "./config/config";
import "./styles/dashboard.css";

const API = Config.BACKEND_URL + "/recruiter";
const FILE_BASE = Config.BACKEND_URL + "/file";

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

export default function Candidates() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

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
            alert("Failed to load candidates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const openCandidateDetail = (c, index) => {
        const id = c.id || c.candidateId || index;
        navigate("/dashboard/candidates/evaluate/" + id);
    };

    return (
        <div className="candidates-page-wrap">
            <div className="candidates-card">
                <h2 className="candidates-title">Candidates</h2>

                {loading && <p className="candidates-loading">Loading candidates...</p>}

                {!loading && list.length === 0 && <p className="candidates-empty">No candidates found</p>}

                {!loading && list.length > 0 && (
                    <div className="candidates-list">
                        <div className="candidates-list-header">
                            <span className="candidates-list-header-name">Candidate</span>
                            <span className="candidates-list-header-contact">Contact</span>
                            <span className="candidates-list-header-id">Candidate ID</span>
                            <span className="candidates-list-header-details">Details</span>
                        </div>
                        {list.map((c, index) => (
                            <div
                                key={c.id || index}
                                className="candidate-row"
                                onClick={(e) => { if (!e.target.closest(".candidate-row-actions-cell")) openCandidateDetail(c, index); }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === "Enter" && !e.target.closest(".candidate-row-actions-cell") && openCandidateDetail(c, index)}
                            >
                                <div className="candidate-row-name-cell">
                                    <div className="candidate-row-avatar-wrap">
                                        {c.profileImageId ? (
                                            <img
                                                src={`${FILE_BASE}/${c.profileImageId}`}
                                                alt=""
                                                className="candidate-row-avatar"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    e.target.nextSibling.style.display = "flex";
                                                }}
                                            />
                                        ) : null}
                                        <div className="candidate-row-avatar-placeholder" style={{ display: c.profileImageId ? "none" : "flex" }}>
                                            <PersonIcon />
                                        </div>
                                    </div>
                                    <span className="candidate-row-name">{c.name || "—"}</span>
                                </div>
                                <div className="candidate-row-contact-cell">
                                    {c.mobileNumber && (
                                        <div className="candidate-row-contact-item">
                                            <span className="candidate-row-contact-icon" aria-hidden="true"><PhoneIcon /></span>
                                            <span>{c.mobileNumber}</span>
                                        </div>
                                    )}
                                    {c.email && (
                                        <div className="candidate-row-contact-item">
                                            <span className="candidate-row-contact-icon" aria-hidden="true"><EmailIcon /></span>
                                            <span>{c.email}</span>
                                        </div>
                                    )}
                                    {!c.mobileNumber && !c.email && <span className="candidate-row-contact-empty">—</span>}
                                </div>
                                <div className="candidate-row-id-cell">
                                    <span className="candidate-id-badge">{c.id || c.candidateId || "—"}</span>
                                </div>
                                <div className="candidate-row-actions-cell" onClick={(e) => e.stopPropagation()}>
                                    {c.resumeId && (
                                        <a
                                            href={`${FILE_BASE}/${c.resumeId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-candidate-resume"
                                        >
                                            View Resume
                                        </a>
                                    )}
                                    <button type="button" className="btn-candidate-details" onClick={() => openCandidateDetail(c, index)}>
                                        View details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

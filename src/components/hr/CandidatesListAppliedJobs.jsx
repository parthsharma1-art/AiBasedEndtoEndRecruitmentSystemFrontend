import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

const FILE_BASE = CONFIG.BACKEND_URL + "/file";

export default function CandidateListAppliedJobs() {
  const location = useLocation();
  const navigate = useNavigate();
  const jobID = location.state?.jobId;

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobID) {
      fetchCandidates();
    }
  }, [jobID]);

  const fetchCandidates = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `${CONFIG.BACKEND_URL}/profile/job/get/${jobID}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const mappedCandidates = (res.data || []).map((item) => ({
        id: item.id,
        candidateName: item.candidateName,
        resumeId: item.resumeId,
        profileImageId: item.profileImageId,
        applyDate: item.applyDate,
        status: item.status,
        candidateSkills: item.candidateSkills || [],
        atsScore: item.atsScore,
      }));

      setCandidates(mappedCandidates);
    } catch (err) {
      console.error("Error loading candidates", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <h2>Loading Candidates...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-content candidates-applied-page">
      {/* Back Button */}
      <button
        className="btn-back btn-back-applied"
        onClick={() => navigate("/dashboard/jobs")}
      >
        ← Back to Dashboard
      </button>

      <h1 className="candidates-applied-title">Applied Candidates</h1>

      {candidates.length === 0 ? (
        <p className="candidates-applied-empty">No candidates applied yet.</p>
      ) : (
        <>
          <div className="candidate-table-wrap">
            <div className="candidate-table">
            <table className="dashboard-table candidates-applied-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Skills</th>
                  <th>ATS Score</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Resume</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((c) => (
                  <tr key={c.id}>
                    {/* Candidate */}
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px"
                        }}
                      >
                        <img
                          src={
                            c.profileImageId
                              ? `${FILE_BASE}/${c.profileImageId}`
                              : "/default-profile.png"
                          }
                          alt={c.candidateName}
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1px solid #e5e7eb"
                          }}
                          onError={(e) =>
                            (e.target.src = "/default-profile.png")
                          }
                        />

                        <div style={{display:"flex",flexDirection:"column"}}>
                          <span style={{fontWeight:"600"}}>
                            {c.candidateName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Skills */}
                    <td>
                      <div className="skills">
                        {c.candidateSkills.map((s, i) => (
                          <span key={i} className="skill">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* ATS Score */}
                    <td>{c.atsScore ?? "N/A"}</td>

                    {/* Status */}
                    <td>
                      <span className="status">{c.status}</span>
                    </td>

                    {/* Date */}
                    <td>
                      {c.applyDate
                        ? new Date(c.applyDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* Resume */}
                    <td>
                      {c.resumeId ? (
                        <a
                          href={`${FILE_BASE}/${c.resumeId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-sm btn-view"
                        >
                          View Resume
                        </a>
                      ) : (
                        "No Resume"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>

          {/* Mobile Cards */}
          <div className="candidate-cards">
            {candidates.map((c) => (
              <div className="candidate-card" key={c.id}>
                <div className="card-header">
                  <img
                    src={
                      c.profileImageId
                        ? `${FILE_BASE}/${c.profileImageId}`
                        : "/default-profile.png"
                    }
                    alt="profile"
                    className="candidate-avatar"
                    onError={(e) =>
                      (e.target.src = "/default-profile.png")
                    }
                  />

                  <div>
                    <h3>{c.candidateName}</h3>
                    <span className="status">{c.status}</span>
                  </div>
                </div>

                <div className="card-body">
                  <p><strong>Skills:</strong></p>

                  <div className="skills">
                    {c.candidateSkills.map((s, i) => (
                      <span key={i} className="skill">
                        {s}
                      </span>
                    ))}
                  </div>

                  <p>
                    <strong>ATS Score:</strong> {c.atsScore ?? "N/A"}
                  </p>

                  <p>
                    <strong>Applied:</strong>{" "}
                    {c.applyDate
                      ? new Date(c.applyDate).toLocaleDateString()
                      : "N/A"}
                  </p>

                  {c.resumeId && (
                    <a
                      href={`${FILE_BASE}/${c.resumeId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-sm btn-view"
                    >
                      View Resume
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

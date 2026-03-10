import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

const FILE_BASE = CONFIG.BACKEND_URL + "/file";

export default function AppliedCandidates() {
  const { jobId } = useParams();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `${CONFIG.BACKEND_URL}/profile/job/get/${jobId}/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCandidates(res.data || []);
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
    <div className="dashboard-content">
      <h1>Applied Candidates</h1>

      {candidates.length === 0 ? (
        <p>No candidates applied yet.</p>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Candidate Name</th>
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
                <td>{c.candidateName}</td>

                {/* Skills */}
                <td>
                  {c.candidateSkills && c.candidateSkills.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      {c.candidateSkills.map((skill, index) => (
                        <span
                          key={index}
                          style={{
                            background: "#eef2ff",
                            color: "#4338ca",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>

                <td>{c.atsScore ?? "N/A"}</td>

                <td>{c.status}</td>

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
      )}
    </div>
  );
}
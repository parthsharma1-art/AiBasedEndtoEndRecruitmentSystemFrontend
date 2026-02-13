import React, { useEffect, useState } from "react";
import axios from "axios";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

// Hook for responsive design
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export default function CandidateJobMatching() {
  console.log("CandidateJobMatching component rendering");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    console.log("CandidateJobMatching component mounted");
    console.log("CONFIG:", CONFIG);
    console.log("CONFIG.BACKEND_URL:", CONFIG?.BACKEND_URL);
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching jobs from:", CONFIG.BACKEND_URL + "/public/jobs");
      const res = await axios.get(CONFIG.BACKEND_URL + "/public/jobs");
      console.log("Jobs response:", res.data);
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError("Failed to load jobs. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to apply for jobs.");
      return;
    }

    try {
      await axios.post(
        CONFIG.BACKEND_URL + "/candidate/apply",
        { jobId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Error applying:", err);
      alert(err.response?.data?.message || "Failed to submit application. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content" style={{ padding: "20px" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: 16
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e2e8f0",
            borderTopColor: "#4f46e5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1e293b", fontWeight: 600 }}>Loading jobs...</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Please wait while we fetch available jobs...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content" style={{ padding: "20px" }}>
        <div style={{
          padding: "20px 24px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "12px",
          color: "#991b1b"
        }}>
          <p style={{ margin: 0, fontWeight: 600 }}>⚠️ {error}</p>
          <button
            onClick={fetchJobs}
            style={{
              marginTop: "12px",
              padding: "8px 16px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log("Rendering CandidateJobMatching - jobs:", jobs.length, "loading:", loading, "error:", error);

  return (
    <div className="dashboard-content" style={{ padding: "20px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: "15px"
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: isMobile ? "1.5rem" : isTablet ? "1.75rem" : "1.875rem",
            color: "#1e293b",
            fontWeight: 700,
            letterSpacing: "-0.025em"
          }}>
            Available Jobs ({jobs.length})
          </h1>
          <p style={{
            margin: "8px 0 0",
            color: "#64748b",
            fontSize: isMobile ? "0.85rem" : "0.95rem"
          }}>
            Browse and apply to exciting opportunities
          </p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div style={{
          padding: "60px 40px",
          textAlign: "center",
          background: "#fff",
          borderRadius: "12px",
          border: "2px dashed #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>📋</div>
          <h3 style={{
            margin: "0 0 12px",
            fontSize: "1.25rem",
            color: "#1e293b",
            fontWeight: 600
          }}>
            No Jobs Available
          </h3>
          <p style={{
            color: "#64748b",
            margin: "0 auto",
            fontSize: "0.95rem",
            maxWidth: "400px"
          }}>
            Check back later for new job opportunities!
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
              ? "repeat(auto-fill, minmax(300px, 1fr))"
              : "repeat(auto-fill, minmax(400px, 1fr))",
          gap: isMobile ? "15px" : "20px"
        }}>
          {jobs.map((job, index) => {
            const j = job?.jobPostingsResponse;
            if (!j) return null;

            return (
              <div
                key={job.id || index}
                style={{
                  background: "#fff",
                  padding: isMobile ? "16px" : "24px",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = "#4f46e5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                {/* Status Badge */}
                {j.active !== undefined && (
                  <div style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: j.active ? "#dcfce7" : "#fee2e2",
                    color: j.active ? "#166534" : "#991b1b"
                  }}>
                    {j.active ? "✓ Active" : "✗ Inactive"}
                  </div>
                )}

                {/* Company Name */}
                {job.companyName && (
                  <p style={{
                    margin: "0 0 8px",
                    fontSize: "0.85rem",
                    color: "#4f46e5",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    🏢 {job.companyName}
                  </p>
                )}

                {/* Job Title */}
                <h3 style={{
                  margin: "0 0 12px",
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                  color: "#1e293b",
                  fontWeight: 700,
                  paddingRight: isMobile ? "80px" : "100px",
                  lineHeight: 1.3
                }}>
                  {j.title || "Untitled Job"}
                </h3>

                {/* Description */}
                <p style={{
                  margin: "0 0 20px",
                  fontSize: "0.9rem",
                  color: "#64748b",
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {j.description || "No description available"}
                </p>

                {/* Profile Section */}
                {j.profile && (
                  <div style={{
                    marginBottom: "16px",
                    padding: "12px 16px",
                    background: "linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%)",
                    borderRadius: "8px",
                    border: "1px solid #c7d2fe"
                  }}>
                    <p style={{
                      margin: "0 0 6px",
                      fontSize: "0.75rem",
                      color: "#4f46e5",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      👤 Profile
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: "#1e293b",
                      fontWeight: 600
                    }}>
                      {j.profile}
                    </p>
                  </div>
                )}

                {/* Job Details Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isMobile ? "10px" : "12px",
                  marginBottom: "16px",
                  padding: isMobile ? "12px" : "16px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <div>
                    <p style={{
                      margin: "0 0 4px",
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      💰 Salary
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: "#1e293b",
                      fontWeight: 600
                    }}>
                      {j.salaryRange || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p style={{
                      margin: "0 0 4px",
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      🏢 Type
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: "#1e293b",
                      fontWeight: 600
                    }}>
                      {j.jobType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p style={{
                      margin: "0 0 4px",
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      ⭐ Experience
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: "#1e293b",
                      fontWeight: 600
                    }}>
                      {j.experienceRequired !== undefined ? `${j.experienceRequired} yrs` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p style={{
                      margin: "0 0 4px",
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      📅 Posted
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: "#1e293b",
                      fontWeight: 600
                    }}>
                      {j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {j.skillsRequired && j.skillsRequired.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{
                      margin: "0 0 8px",
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      🛠️ Skills Required
                    </p>
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px"
                    }}>
                      {j.skillsRequired.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "4px 10px",
                            background: "#e0e7ff",
                            color: "#4f46e5",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 500
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {j.skillsRequired.length > 5 && (
                        <span style={{
                          padding: "4px 10px",
                          background: "#f1f5f9",
                          color: "#64748b",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 500
                        }}>
                          +{j.skillsRequired.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <button
                  onClick={() => handleApply(j.id || job.id)}
                  style={{
                    width: "100%",
                    padding: "12px 24px",
                    background: "#4f46e5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
                    transition: "all 0.2s",
                    marginTop: "8px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#4338ca";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(79, 70, 229, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#4f46e5";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.2)";
                  }}
                >
                  Apply Now
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CONFIG from "./config/config";
import "./styles/dashboard.css";

export default function AllJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("AllJobs component mounted - fetching jobs");
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            navigate("/");
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // API endpoint: /api/profile/jobs (GET)
            // Backend returns list of jobs
            const apiUrl = `${CONFIG.BACKEND_URL}/profile/jobs`;
            
            console.log("AllJobs: Fetching jobs from:", apiUrl);
            const res = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            });
            
            // Handle response - backend returns List<JobPostingsResponse>
            let jobsData = [];
            if (Array.isArray(res.data)) {
                jobsData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                jobsData = res.data.data;
            } else if (res.data && Array.isArray(res.data.jobs)) {
                jobsData = res.data.jobs;
            } else if (res.data && typeof res.data === 'object') {
                jobsData = [res.data];
            }
            
            setJobs(jobsData);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            let errorMessage = "Error fetching jobs. ";
            if (err.response) {
                errorMessage += err.response.data?.message || `Status: ${err.response.status}`;
                if (err.response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
            } else {
                errorMessage += err.message || "Unknown error occurred.";
            }
            setError(errorMessage);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-content">
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
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Please wait while we fetch your jobs from the server...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            {/* Back Button */}
            <button
                onClick={() => navigate("/dashboard")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    marginBottom: "20px",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    color: "#475569",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                    e.currentTarget.style.color = "#1e293b";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#475569";
                }}
            >
                <span style={{ fontSize: "1.2rem" }}>←</span>
                <span>Back to Dashboard</span>
            </button>

            {/* Header Section */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: 32,
                paddingBottom: 20,
                borderBottom: "2px solid #e2e8f0"
            }}>
                <div>
                    <h1 style={{ 
                        margin: 0, 
                        fontSize: "1.875rem", 
                        color: "#1e293b",
                        fontWeight: 700,
                        letterSpacing: "-0.025em"
                    }}>
                        All Posted Jobs
                    </h1>
                    <p style={{ 
                        margin: "8px 0 0", 
                        color: "#64748b", 
                        fontSize: "0.95rem" 
                    }}>
                        Manage and view all your job postings
                    </p>
                </div>
                <button
                    type="button"
                    className="btn-sm btn-view"
                    style={{ 
                        padding: "12px 24px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
                        transition: "all 0.2s",
                        cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 4px 8px rgba(79, 70, 229, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.2)";
                    }}
                    onClick={() => navigate("/dashboard/jobs/create")}
                >
                    + Create New Job
                </button>
            </div>

            {error && (
                <div style={{ 
                    padding: "20px 24px", 
                    background: "#fef2f2", 
                    border: "1px solid #fecaca", 
                    borderRadius: "12px", 
                    marginBottom: 24,
                    color: "#991b1b"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <span style={{ fontSize: "1.5rem" }}>⚠️</span>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "1rem" }}>Error Loading Jobs</p>
                    </div>
                    <p style={{ margin: "0 0 16px", fontSize: "0.95rem", color: "#7f1d1d" }}>{error}</p>
                    <button
                        onClick={fetchJobs}
                        style={{
                            padding: "10px 20px",
                            background: "#4f46e5",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#4338ca";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "#4f46e5";
                        }}
                    >
                        🔄 Retry
                    </button>
                </div>
            )}

            {!error && jobs.length === 0 && (
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
                        No Jobs Found
                    </h3>
                    <p style={{ 
                        color: "#64748b", 
                        marginBottom: 24,
                        fontSize: "0.95rem",
                        maxWidth: "400px",
                        margin: "0 auto 24px"
                    }}>
                        Get started by creating your first job posting. Reach out to qualified candidates today!
                    </p>
                    <button
                        type="button"
                        className="btn-sm btn-view"
                        style={{ 
                            padding: "12px 24px",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
                            transition: "all 0.2s",
                            cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 4px 8px rgba(79, 70, 229, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.2)";
                        }}
                        onClick={() => navigate("/dashboard/jobs/create")}
                    >
                        + Create Your First Job
                    </button>
                </div>
            )}

            {!error && jobs.length > 0 && (
                <div>
                    <div style={{ 
                        marginBottom: 20, 
                        padding: "12px 16px",
                        background: "#f8fafc",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0"
                    }}>
                        <p style={{ 
                            margin: 0, 
                            fontSize: "0.9rem", 
                            color: "#475569",
                            fontWeight: 500
                        }}>
                            📊 Total Jobs: <strong style={{ color: "#1e293b" }}>{jobs.length}</strong>
                        </p>
                    </div>
                    <div style={{ 
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                        gap: 20
                    }}>
                        {jobs.map((job) => (
                            <div
                                key={job.id || job.jobId}
                                style={{
                                    background: "#fff",
                                    padding: "24px",
                                    borderRadius: "12px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                    border: "1px solid #e2e8f0",
                                    transition: "all 0.2s",
                                    cursor: "pointer",
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
                                <div style={{
                                    position: "absolute",
                                    top: 16,
                                    right: 16,
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    background: job.active ? "#dcfce7" : "#fee2e2",
                                    color: job.active ? "#166534" : "#991b1b"
                                }}>
                                    {job.active ? "✓ Active" : "✗ Inactive"}
                                </div>

                                {/* Job Title */}
                                <h3 style={{ 
                                    margin: "0 0 12px", 
                                    fontSize: "1.25rem", 
                                    color: "#1e293b",
                                    fontWeight: 700,
                                    paddingRight: "100px",
                                    lineHeight: 1.3
                                }}>
                                    {job.title || "Untitled Job"}
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
                                    {job.description || "No description available"}
                                </p>

                                {/* Profile Section - Prominent Display */}
                                {job.profile && (
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
                                            {job.profile}
                                        </p>
                                    </div>
                                )}

                                {/* Job Details Grid */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "12px",
                                    marginBottom: "16px",
                                    padding: "16px",
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
                                            {job.salaryRange || "Not specified"}
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
                                            {job.jobType || "N/A"}
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
                                            {job.experienceRequired ? `${job.experienceRequired} yrs` : "N/A"}
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
                                            📅 Created
                                        </p>
                                        <p style={{ 
                                            margin: 0, 
                                            fontSize: "0.95rem", 
                                            color: "#1e293b",
                                            fontWeight: 600
                                        }}>
                                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}
                                        </p>
                                    </div>
                                </div>

                                {/* Skills */}
                                {job.skillsRequired && job.skillsRequired.length > 0 && (
                                    <div style={{ marginTop: "16px" }}>
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
                                            {job.skillsRequired.slice(0, 5).map((skill, idx) => (
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
                                            {job.skillsRequired.length > 5 && (
                                                <span style={{
                                                    padding: "4px 10px",
                                                    background: "#f1f5f9",
                                                    color: "#64748b",
                                                    borderRadius: "6px",
                                                    fontSize: "0.8rem",
                                                    fontWeight: 500
                                                }}>
                                                    +{job.skillsRequired.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}



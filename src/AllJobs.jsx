import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CONFIG from "./config/config";
import "./styles/dashboard.css";

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

export default function AllJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [updateForm, setUpdateForm] = useState({
        title: "",
        description: "",
        skillsRequired: "",
        salaryRange: "",
        jobType: "FULL_TIME",
        experienceRequired: "",
        profile: "",
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

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

    const fetchJobDetails = async (jobId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token not found. Please login again.");
            return;
        }

        try {
            setUpdateLoading(true);
            const response = await axios.get(`${CONFIG.BACKEND_URL}/profile/job/get/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const job = response.data;
            setUpdateForm({
                title: job.title || "",
                description: job.description || "",
                skillsRequired: Array.isArray(job.skillsRequired) ? job.skillsRequired.join(", ") : job.skillsRequired || "",
                salaryRange: job.salaryRange || "",
                jobType: job.jobType || "FULL_TIME",
                experienceRequired: job.experienceRequired?.toString() || "",
                profile: job.profile || "",
            });
            setSelectedJobId(jobId);
            setShowUpdateModal(true);
        } catch (err) {
            console.error("Error fetching job details:", err);
            alert(err.response?.data?.message || "Error fetching job details. Please try again.");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token not found. Please login again.");
            return;
        }

        if (!selectedJobId) return;

        const skillsArray = updateForm.skillsRequired
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const payload = {
            title: updateForm.title,
            description: updateForm.description,
            skillsRequired: skillsArray,
            salaryRange: updateForm.salaryRange,
            jobType: updateForm.jobType,
            experienceRequired: parseInt(updateForm.experienceRequired) || 0,
        };

        if (updateForm.profile && updateForm.profile.trim() !== "") {
            payload.profile = updateForm.profile.trim();
        }

        try {
            setUpdateLoading(true);
            await axios.put(`${CONFIG.BACKEND_URL}/profile/job/update/${selectedJobId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setMessage({ type: "success", text: "Job updated successfully!" });
            setShowUpdateModal(false);
            setSelectedJobId(null);
            fetchJobs(); // Refresh the job list
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (err) {
            console.error("Error updating job:", err);
            setMessage({ type: "error", text: err.response?.data?.message || "Error updating job. Please try again." });
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDelete = (jobId) => {
        // Find the job to show its title in confirmation dialog
        const job = jobs.find(j => (j.id || j.jobId) === jobId);
        setJobToDelete({ id: jobId, title: job?.title || "this job" });
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!jobToDelete) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token not found. Please login again.");
            setShowDeleteDialog(false);
            setJobToDelete(null);
            return;
        }

        try {
            setDeleteLoading({ ...deleteLoading, [jobToDelete.id]: true });
            const response = await axios.delete(`${CONFIG.BACKEND_URL}/profile/job/delete/${jobToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data === true) {
                setMessage({ type: "success", text: "Job deleted successfully!" });
                setShowDeleteDialog(false);
                setJobToDelete(null);
                fetchJobs(); // Refresh the job list
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            } else {
                setMessage({ type: "error", text: "Failed to delete job. Please try again." });
                setShowDeleteDialog(false);
                setJobToDelete(null);
                setTimeout(() => setMessage({ type: "", text: "" }), 5000);
            }
        } catch (err) {
            console.error("Error deleting job:", err);
            setMessage({ type: "error", text: err.response?.data?.message || "Error deleting job. Please try again." });
            setShowDeleteDialog(false);
            setJobToDelete(null);
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } finally {
            setDeleteLoading({ ...deleteLoading, [jobToDelete.id]: false });
        }
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false);
        setJobToDelete(null);
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
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between", 
                alignItems: isMobile ? "flex-start" : "center", 
                marginBottom: isMobile ? 24 : 32,
                paddingBottom: 20,
                borderBottom: "2px solid #e2e8f0",
                gap: isMobile ? "16px" : "0"
            }}>
                <div>
                    <h1 style={{ 
                        margin: 0, 
                        fontSize: isMobile ? "1.5rem" : isTablet ? "1.75rem" : "1.875rem", 
                        color: "#1e293b",
                        fontWeight: 700,
                        letterSpacing: "-0.025em"
                    }}>
                        All Posted Jobs
                    </h1>
                    <p style={{ 
                        margin: "8px 0 0", 
                        color: "#64748b", 
                        fontSize: isMobile ? "0.85rem" : "0.95rem" 
                    }}>
                        Manage and view all your job postings
                    </p>
                </div>
                <button
                    type="button"
                    className="btn-sm btn-view"
                    style={{ 
                        padding: isMobile ? "10px 20px" : "12px 24px",
                        fontSize: isMobile ? "0.85rem" : "0.95rem",
                        fontWeight: 600,
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
                        transition: "all 0.2s",
                        cursor: "pointer",
                        width: isMobile ? "100%" : "auto"
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

            {/* Success/Error Message */}
            {message.text && (
                <div style={{ 
                    padding: "16px 20px", 
                    background: message.type === "success" ? "#dcfce7" : "#fef2f2", 
                    border: `1px solid ${message.type === "success" ? "#86efac" : "#fecaca"}`, 
                    borderRadius: "12px", 
                    marginBottom: 24,
                    color: message.type === "success" ? "#166534" : "#991b1b",
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                }}>
                    <span style={{ fontSize: "1.5rem" }}>{message.type === "success" ? "✓" : "⚠️"}</span>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{message.text}</p>
                </div>
            )}

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
                        gridTemplateColumns: isMobile 
                            ? "1fr" 
                            : isTablet 
                                ? "repeat(auto-fill, minmax(300px, 1fr))" 
                                : "repeat(auto-fill, minmax(400px, 1fr))",
                        gap: isMobile ? "15px" : "20px"
                    }}>
                        {jobs.map((job) => (
                            <div
                                key={job.id || job.jobId}
                                style={{
                                    background: "#fff",
                                    padding: isMobile ? "16px" : "24px",
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
                                    fontSize: isMobile ? "1.1rem" : "1.25rem", 
                                    color: "#1e293b",
                                    fontWeight: 700,
                                    paddingRight: isMobile ? "80px" : "100px",
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
                                    <div style={{ marginTop: "16px", marginBottom: "16px" }}>
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

                                {/* Action Buttons */}
                                <div style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "20px",
                                    flexWrap: "wrap"
                                }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fetchJobDetails(job.id || job.jobId);
                                        }}
                                        disabled={updateLoading}
                                        style={{
                                            flex: 1,
                                            minWidth: "120px",
                                            padding: "10px 16px",
                                            background: "#10b981",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: updateLoading ? "not-allowed" : "pointer",
                                            fontSize: "0.9rem",
                                            fontWeight: 600,
                                            transition: "all 0.2s",
                                            opacity: updateLoading ? 0.6 : 1
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!updateLoading) {
                                                e.target.style.background = "#059669";
                                                e.target.style.transform = "translateY(-2px)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!updateLoading) {
                                                e.target.style.background = "#10b981";
                                                e.target.style.transform = "translateY(0)";
                                            }
                                        }}
                                    >
                                        {updateLoading ? "Loading..." : "✏️ Update"}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(job.id || job.jobId);
                                        }}
                                        disabled={deleteLoading[job.id || job.jobId]}
                                        style={{
                                            flex: 1,
                                            minWidth: "120px",
                                            padding: "10px 16px",
                                            background: "#ef4444",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: deleteLoading[job.id || job.jobId] ? "not-allowed" : "pointer",
                                            fontSize: "0.9rem",
                                            fontWeight: 600,
                                            transition: "all 0.2s",
                                            opacity: deleteLoading[job.id || job.jobId] ? 0.6 : 1
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!deleteLoading[job.id || job.jobId]) {
                                                e.target.style.background = "#dc2626";
                                                e.target.style.transform = "translateY(-2px)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!deleteLoading[job.id || job.jobId]) {
                                                e.target.style.background = "#ef4444";
                                                e.target.style.transform = "translateY(0)";
                                            }
                                        }}
                                    >
                                        {deleteLoading[job.id || job.jobId] ? "Deleting..." : "🗑️ Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Update Job Modal */}
            {showUpdateModal && (
                <>
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.5)",
                            zIndex: 1000,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: isMobile ? "20px" : "0"
                        }}
                        onClick={() => {
                            if (!updateLoading) {
                                setShowUpdateModal(false);
                                setSelectedJobId(null);
                            }
                        }}
                    >
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: "12px",
                                padding: isMobile ? "20px" : "30px",
                                maxWidth: "600px",
                                width: "100%",
                                maxHeight: "90vh",
                                overflowY: "auto",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                                position: "relative"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "24px"
                            }}>
                                <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b", fontWeight: 700 }}>
                                    Update Job Posting
                                </h2>
                                <button
                                    onClick={() => {
                                        if (!updateLoading) {
                                            setShowUpdateModal(false);
                                            setSelectedJobId(null);
                                        }
                                    }}
                                    disabled={updateLoading}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        fontSize: "24px",
                                        cursor: updateLoading ? "not-allowed" : "pointer",
                                        color: "#64748b",
                                        padding: "4px 8px",
                                        lineHeight: 1
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#1e293b" }}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={updateForm.title}
                                    onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #d1d5db",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#1e293b" }}>
                                    Description
                                </label>
                                <textarea
                                    value={updateForm.description}
                                    onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #d1d5db",
                                        fontSize: "0.95rem",
                                        minHeight: "100px",
                                        resize: "vertical",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#1e293b" }}>
                                    Skills Required (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={updateForm.skillsRequired}
                                    onChange={(e) => setUpdateForm({ ...updateForm, skillsRequired: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #d1d5db",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#1e293b" }}>
                                    Salary Range
                                </label>
                                <input
                                    type="text"
                                    value={updateForm.salaryRange}
                                    onChange={(e) => setUpdateForm({ ...updateForm, salaryRange: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #d1d5db",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#1e293b" }}>
                                    Job Type
                                </label>
                                <select
                                    value={updateForm.jobType}
                                    onChange={(e) => setUpdateForm({ ...updateForm, jobType: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #d1d5db",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box"
                                    }}
                                >
                                    <option value="FULL_TIME">Full-time</option>
                                    <option value="INTERNSHIP">Internship</option>
                                    <option value="REMOTE">Remote</option>
                                    <option value="HYBRID">Hybrid</option>
                                    <option value="ONSITE">Onsite</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#1e293b" }}>
                                    Experience Required (years)
                                </label>
                                <input
                                    type="number"
                                    value={updateForm.experienceRequired}
                                    onChange={(e) => setUpdateForm({ ...updateForm, experienceRequired: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #d1d5db",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#1e293b" }}>
                                    Profile
                                </label>
                                <input
                                    type="text"
                                    value={updateForm.profile}
                                    onChange={(e) => setUpdateForm({ ...updateForm, profile: e.target.value })}
                                    placeholder="Enter profile information"
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #d1d5db",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div style={{
                                display: "flex",
                                gap: "12px",
                                justifyContent: "flex-end"
                            }}>
                                <button
                                    onClick={() => {
                                        if (!updateLoading) {
                                            setShowUpdateModal(false);
                                            setSelectedJobId(null);
                                        }
                                    }}
                                    disabled={updateLoading}
                                    style={{
                                        padding: "12px 24px",
                                        background: "#64748b",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: updateLoading ? "not-allowed" : "pointer",
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        opacity: updateLoading ? 0.6 : 1
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={updateLoading || !updateForm.title.trim() || !updateForm.description.trim()}
                                    style={{
                                        padding: "12px 24px",
                                        background: updateLoading || !updateForm.title.trim() || !updateForm.description.trim() ? "#9ca3af" : "#4f46e5",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: updateLoading || !updateForm.title.trim() || !updateForm.description.trim() ? "not-allowed" : "pointer",
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!updateLoading && updateForm.title.trim() && updateForm.description.trim()) {
                                            e.target.style.background = "#4338ca";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!updateLoading && updateForm.title.trim() && updateForm.description.trim()) {
                                            e.target.style.background = "#4f46e5";
                                        }
                                    }}
                                >
                                    {updateLoading ? "Updating..." : "Update Job"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && jobToDelete && (
                <>
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.5)",
                            zIndex: 2000,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: isMobile ? "20px" : "0",
                            animation: "fadeIn 0.2s ease"
                        }}
                        onClick={cancelDelete}
                    >
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: "12px",
                                padding: isMobile ? "24px" : "32px",
                                maxWidth: "500px",
                                width: "100%",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                                position: "relative",
                                animation: "slideUp 0.3s ease"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{
                                textAlign: "center",
                                marginBottom: "24px"
                            }}>
                                <div style={{
                                    width: "64px",
                                    height: "64px",
                                    margin: "0 auto 16px",
                                    borderRadius: "50%",
                                    background: "#fef2f2",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <span style={{ fontSize: "2rem" }}>⚠️</span>
                                </div>
                                <h2 style={{
                                    margin: "0 0 12px",
                                    fontSize: isMobile ? "1.25rem" : "1.5rem",
                                    color: "#1e293b",
                                    fontWeight: 700
                                }}>
                                    Delete Job Posting?
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: "0.95rem",
                                    color: "#64748b",
                                    lineHeight: 1.6
                                }}>
                                    Are you sure you want to delete <strong style={{ color: "#1e293b" }}>"{jobToDelete.title}"</strong>? This action cannot be undone.
                                </p>
                            </div>

                            <div style={{
                                display: "flex",
                                gap: "12px",
                                justifyContent: "flex-end",
                                flexWrap: "wrap"
                            }}>
                                <button
                                    onClick={cancelDelete}
                                    disabled={deleteLoading[jobToDelete.id]}
                                    style={{
                                        padding: "12px 24px",
                                        background: "#f1f5f9",
                                        color: "#475569",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: deleteLoading[jobToDelete.id] ? "not-allowed" : "pointer",
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        transition: "all 0.2s",
                                        opacity: deleteLoading[jobToDelete.id] ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!deleteLoading[jobToDelete.id]) {
                                            e.target.style.background = "#e2e8f0";
                                            e.target.style.color = "#1e293b";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!deleteLoading[jobToDelete.id]) {
                                            e.target.style.background = "#f1f5f9";
                                            e.target.style.color = "#475569";
                                        }
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleteLoading[jobToDelete.id]}
                                    style={{
                                        padding: "12px 24px",
                                        background: deleteLoading[jobToDelete.id] ? "#9ca3af" : "#ef4444",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: deleteLoading[jobToDelete.id] ? "not-allowed" : "pointer",
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        transition: "all 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!deleteLoading[jobToDelete.id]) {
                                            e.target.style.background = "#dc2626";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!deleteLoading[jobToDelete.id]) {
                                            e.target.style.background = "#ef4444";
                                        }
                                    }}
                                >
                                    {deleteLoading[jobToDelete.id] ? (
                                        <>
                                            <span style={{
                                                width: "16px",
                                                height: "16px",
                                                border: "2px solid #fff",
                                                borderTopColor: "transparent",
                                                borderRadius: "50%",
                                                animation: "spin 0.6s linear infinite"
                                            }}></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        "Yes, Delete Job"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideUp {
                            from { 
                                transform: translateY(20px);
                                opacity: 0;
                            }
                            to { 
                                transform: translateY(0);
                                opacity: 1;
                            }
                        }
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </>
            )}
        </div>
    );
}



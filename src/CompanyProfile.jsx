import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Config from "./config/config";

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

export default function CompanyProfile() {
    const { subdomain } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

    useEffect(() => {
        if (!subdomain) return;
        fetchCompany();
    }, [subdomain]);

    const fetchCompany = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${Config.BACKEND_URL}/public/${subdomain}`);
            setCompany(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load company");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
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
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1e293b", fontWeight: 600 }}>Loading company...</h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Please wait while we fetch company details...</p>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }
    
    if (!company) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                gap: 16,
                padding: "40px 20px"
            }}>
                <div style={{ fontSize: "4rem", marginBottom: 16 }}>🔍</div>
                <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b", fontWeight: 600 }}>Company not found</h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem", textAlign: "center" }}>
                    The company you're looking for doesn't exist or has been removed.
                </p>
            </div>
        );
    }

    const handleLogin = () => {
        // navigate to candidate login page, passing subdomain if needed
        navigate("/candidate-auth", { state: { subdomain } });
    };

    const handleApply = (jobId) => {
        alert(`Applying to job ID: ${jobId}`);
    };

    return (
        <>
            {/* NAVBAR */}
            <div style={{
                ...navbar,
                padding: isMobile ? "15px 20px" : "15px 30px",
                flexWrap: "wrap",
                gap: "15px"
            }}>
                <h1 style={{ 
                    margin: 0,
                    fontSize: isMobile ? "1.25rem" : isTablet ? "1.5rem" : "1.75rem",
                    color: "#1e293b",
                    fontWeight: 700
                }}>
                    {company.basicSetting?.companyName}
                </h1>
                <div style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}>
                    <button 
                        style={{
                            ...backHomeBtn,
                            fontSize: isMobile ? "0.9rem" : "1rem",
                            padding: isMobile ? "8px 14px" : "8px 16px"
                        }} 
                        onClick={() => navigate("/")}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#475569";
                            e.target.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "#64748b";
                            e.target.style.transform = "translateY(0)";
                        }}
                    >
                        ← Back to Home
                    </button>
                    <button 
                        style={{
                            ...loginBtn,
                            fontSize: isMobile ? "0.9rem" : "1rem",
                            padding: isMobile ? "8px 14px" : "8px 16px"
                        }} 
                        onClick={handleLogin}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#1d4ed8";
                            e.target.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "#2563eb";
                            e.target.style.transform = "translateY(0)";
                        }}
                    >
                        Login
                    </button>
                </div>
            </div>

            {/* COMPANY DETAILS */}
            <div style={{
                ...page,
                padding: isMobile ? "20px" : isTablet ? "30px" : "40px",
                overflowX: "hidden",
                width: "100%"
            }}>
                <div style={{
                    marginBottom: isMobile ? "24px" : "32px",
                    paddingBottom: "20px",
                    borderBottom: "2px solid #e2e8f0"
                }}>
                    <h2 style={{ 
                        margin: 0, 
                        fontSize: isMobile ? "1.5rem" : isTablet ? "1.75rem" : "1.875rem",
                        color: "#1e293b",
                        fontWeight: 700,
                        letterSpacing: "-0.025em"
                    }}>
                        🚀 Open Jobs
                    </h2>
                    <p style={{ 
                        margin: "8px 0 0", 
                        color: "#64748b", 
                        fontSize: isMobile ? "0.85rem" : "0.95rem" 
                    }}>
                        {company.jobPostingsResponses?.length || 0} {company.jobPostingsResponses?.length === 1 ? 'position' : 'positions'} available
                    </p>
                </div>

                {company.jobPostingsResponses && company.jobPostingsResponses.length > 0 ? (
                    <>
                        <div 
                            className="job-scroll-container"
                            style={{ 
                                display: "flex",
                                flexDirection: "row",
                                overflowX: "auto",
                                overflowY: "hidden",
                                gap: isMobile ? "15px" : "20px",
                                paddingBottom: "10px",
                                paddingRight: isMobile ? "0" : "10px",
                                scrollbarWidth: "thin",
                                scrollbarColor: "#cbd5e1 #f1f5f9",
                                WebkitOverflowScrolling: "touch",
                                msOverflowStyle: "-ms-autohiding-scrollbar"
                            }}
                        >
                        {company.jobPostingsResponses.map((job) => (
                            <div
                                key={job.id}
                                style={{
                                    background: "#fff",
                                    padding: isMobile ? "16px" : "24px",
                                    borderRadius: "12px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                    border: "1px solid #e2e8f0",
                                    transition: "all 0.2s",
                                    position: "relative",
                                    overflow: "hidden",
                                    minWidth: isMobile ? "280px" : isTablet ? "320px" : "380px",
                                    maxWidth: isMobile ? "280px" : isTablet ? "320px" : "400px",
                                    flexShrink: 0,
                                    width: isMobile ? "280px" : isTablet ? "320px" : "400px"
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
                                {job.active !== undefined && (
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
                                            {job.experienceRequired !== undefined ? `${job.experienceRequired} yrs` : "N/A"}
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
                                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}
                                        </p>
                                    </div>
                                </div>

                                {/* Skills */}
                                {job.skillsRequired && job.skillsRequired.length > 0 && (
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

                                {/* Apply Button */}
                                <button 
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
                                    onClick={() => handleApply(job.id)}
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                        </div>
                        <style dangerouslySetInnerHTML={{__html: `
                            .job-scroll-container::-webkit-scrollbar {
                                height: 8px;
                            }
                            .job-scroll-container::-webkit-scrollbar-track {
                                background: #f1f5f9;
                                border-radius: 10px;
                            }
                            .job-scroll-container::-webkit-scrollbar-thumb {
                                background: #cbd5e1;
                                border-radius: 10px;
                            }
                            .job-scroll-container::-webkit-scrollbar-thumb:hover {
                                background: #94a3b8;
                            }
                        `}} />
                    </>
                ) : (
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
                            No Open Jobs
                        </h3>
                        <p style={{ 
                            color: "#64748b", 
                            margin: "0 auto",
                            fontSize: "0.95rem",
                            maxWidth: "400px"
                        }}>
                            This company doesn't have any open positions at the moment. Check back later!
                        </p>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <footer style={{
                ...footer,
                padding: isMobile ? "20px" : "25px",
                marginTop: isMobile ? "30px" : "50px"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isMobile ? "12px" : "16px",
                    fontSize: isMobile ? "0.9rem" : "1rem"
                }}>
                    <p style={{ margin: 0 }}>
                        📧 {company.contactDetails?.companyEmail || "N/A"}
                        {company.contactDetails?.companyEmail && company.contactDetails?.companyMobileNumber && " | "}
                        📞 {company.contactDetails?.companyMobileNumber || ""}
                    </p>
                    {company.contactDetails?.companyAddress && (
                        <p style={{ margin: 0 }}>📍 {company.contactDetails.companyAddress}</p>
                    )}
                    <p style={{ margin: 0, opacity: 0.8 }}>
                        © {new Date().getFullYear()} {company.basicSetting?.companyName}
                    </p>
                </div>
            </footer>
        </>
    );
}

/* ===== STYLES ===== */
const navbar = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    borderBottom: "1px solid #eee",
    background: "#fff",
    marginBottom: 20,
};
const loginBtn = {
    padding: "8px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s",
    whiteSpace: "nowrap"
};
const backHomeBtn = {
    padding: "8px 16px",
    background: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "4px"
};
const page = { 
    padding: 40, 
    maxWidth: "100%", 
    margin: "auto",
    width: "100%",
    boxSizing: "border-box"
};
const footer = {
    marginTop: 50,
    padding: 25,
    background: "#0f172a",
    color: "#fff",
    textAlign: "center",
    borderRadius: 10,
};

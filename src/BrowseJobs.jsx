import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Config from "./config/config";

const JOBS_API = Config.BACKEND_URL + "/public/jobs";
const COMPANIES_API = Config.BACKEND_URL + "/public/profiles"; // make sure backend config matches

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

// Utility function to check if user is logged in and logged in within last 4 hours
function isUserLoggedIn() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    // Check if login timestamp exists
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    if (!loginTimestamp) {
        // If no timestamp, assume logged in (for backward compatibility)
        // Set current timestamp for future checks
        localStorage.setItem("loginTimestamp", Date.now().toString());
        return true;
    }
    
    // Check if login was within last 4 hours (4 * 60 * 60 * 1000 milliseconds)
    const fourHoursInMs = 4 * 60 * 60 * 1000;
    const currentTime = Date.now();
    const loginTime = parseInt(loginTimestamp, 10);
    
    if (currentTime - loginTime > fourHoursInMs) {
        // Token expired (more than 4 hours), clear it
        localStorage.removeItem("token");
        localStorage.removeItem("loginTimestamp");
        return false;
    }
    
    return true;
}

export default function BrowseJobs() {
    const [activeTab, setActiveTab] = useState("jobs"); // "jobs" | "companies" | "applications"
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false); // For mobile filter modal
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Filter states
    const [filters, setFilters] = useState({
        jobType: {
            FULL_TIME: false,
            PART_TIME: false,
            REMOTE: false,
            INTERNSHIP: false,
            HYBRID: false,
            ONSITE: false
        },
        experience: {
            "0-2": false,
            "3-5": false,
            "5+": false
        },
        salary: {
            "3-6": false,
            "6-10": false,
            "10+": false
        }
    });
    
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

    const navigate = useNavigate();
    
    // Check login status on mount and periodically
    useEffect(() => {
        setIsLoggedIn(isUserLoggedIn());
        
        // Check every minute to update login status
        const interval = setInterval(() => {
            setIsLoggedIn(isUserLoggedIn());
        }, 60000); // Check every minute
        
        return () => clearInterval(interval);
    }, []);
    
    // Fetch data whenever tab changes
    useEffect(() => {
        if (activeTab === "jobs") fetchJobs();
        if (activeTab === "companies") fetchCompanies();
    }, [activeTab]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(JOBS_API);
            setJobs(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            alert("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const res = await axios.get(COMPANIES_API);
            const data = Array.isArray(res.data) ? res.data : [];
            
            // Filter companies that have a valid company name
            const validCompanies = data.filter((c) => {
                return (
                    c &&
                    c.basicSetting &&
                    typeof c.basicSetting.companyName === "string" &&
                    c.basicSetting.companyName.trim() !== ""
                );
            });
            
            setCompanies(validCompanies);
        } catch (err) {
            console.error(err);
            alert("Failed to load companies");
        } finally {
            setLoading(false);
        }
    };

    const handleViewCompany = (domain) => {
        if (!domain || typeof domain !== "string") return;
        const subdomain = domain.split(".")[0]; // extract subdomain
        navigate(`/companies/${subdomain}`);     // navigate to company profile
    };

    // Filter handler functions
    const handleFilterChange = (category, key) => {
        setFilters(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
    };

    // Helper function to extract salary range number from string (e.g., "₹8 LPA – ₹12 LPA" -> 8)
    const extractSalaryNumber = (salaryStr) => {
        if (!salaryStr) return 0;
        const match = salaryStr.match(/₹?\s*(\d+)/);
        return match ? parseInt(match[1]) : 0;
    };

    // Filter jobs based on selected filters
    const getFilteredJobs = () => {
        return jobs.filter((job) => {
            const j = job?.jobPostingsResponse;
            if (!j) return false;

            // Job Type filter
            const jobTypeFilters = Object.entries(filters.jobType).filter(([_, checked]) => checked);
            if (jobTypeFilters.length > 0) {
                const selectedTypes = jobTypeFilters.map(([type]) => type);
                if (!selectedTypes.includes(j.jobType)) {
                    return false;
                }
            }

            // Experience filter
            const experienceFilters = Object.entries(filters.experience).filter(([_, checked]) => checked);
            if (experienceFilters.length > 0) {
                const exp = j.experienceRequired || 0;
                let matchesExperience = false;
                
                experienceFilters.forEach(([range]) => {
                    if (range === "0-2" && exp >= 0 && exp <= 2) matchesExperience = true;
                    if (range === "3-5" && exp >= 3 && exp <= 5) matchesExperience = true;
                    if (range === "5+" && exp >= 5) matchesExperience = true;
                });
                
                if (!matchesExperience) return false;
            }

            // Salary filter
            const salaryFilters = Object.entries(filters.salary).filter(([_, checked]) => checked);
            if (salaryFilters.length > 0) {
                const salaryNum = extractSalaryNumber(j.salaryRange);
                let matchesSalary = false;
                
                salaryFilters.forEach(([range]) => {
                    if (range === "3-6" && salaryNum >= 3 && salaryNum <= 6) matchesSalary = true;
                    if (range === "6-10" && salaryNum >= 6 && salaryNum <= 10) matchesSalary = true;
                    if (range === "10+" && salaryNum >= 10) matchesSalary = true;
                });
                
                if (!matchesSalary) return false;
            }

            return true;
        });
    };

    const filteredJobs = getFilteredJobs();
    
    // Check if any filters are active
    const hasActiveFilters = () => {
        return Object.values(filters.jobType).some(v => v) ||
               Object.values(filters.experience).some(v => v) ||
               Object.values(filters.salary).some(v => v);
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            jobType: {
                FULL_TIME: false,
                PART_TIME: false,
                REMOTE: false,
                INTERNSHIP: false,
                HYBRID: false,
                ONSITE: false
            },
            experience: {
                "0-2": false,
                "3-5": false,
                "5+": false
            },
            salary: {
                "3-6": false,
                "6-10": false,
                "10+": false
            }
        });
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
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1e293b", fontWeight: 600 }}>Loading jobs...</h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Please wait while we fetch jobs from the server...</p>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <>
            {/* NAVBAR */}
           
            <div style={navbar}>
                <div 
                    style={{
                        ...logo,
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "opacity 0.2s"
                    }}
                    onClick={() => navigate("/")}
                    onMouseEnter={(e) => e.target.style.opacity = "0.8"}
                    onMouseLeave={(e) => e.target.style.opacity = "1"}
                >
                    AI-Based Recruitment System
                </div>

                <div style={navLinks}>
                    <span
                        style={activeTab === "jobs" ? activeLink : link}
                        onClick={() => setActiveTab("jobs")}
                    >
                        Browse Jobs
                    </span>

                    <span
                        style={activeTab === "companies" ? activeLink : link}
                        onClick={() => setActiveTab("companies")}
                    >
                        Companies
                    </span>

                    <span
                        style={activeTab === "applications" ? activeLink : link}
                        onClick={() => setActiveTab("applications")}
                    >
                        My Applications
                    </span>
                </div>

                {isLoggedIn ? (
                    <button 
                        style={{
                            ...loginBtn,
                            background: "#10b981"
                        }} 
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>
                ) : (
                    <button 
                        style={loginBtn} 
                        onClick={() => navigate("/recruiter-auth")}
                    >
                        Login
                    </button>
                )}
            </div>

            {/* MAIN CONTENT */}
            <div style={{
                ...layout,
                flexDirection: isMobile ? "column" : "row",
                padding: isMobile ? "15px" : isTablet ? "20px" : "25px",
                gap: isMobile ? "15px" : "25px"
            }}>
                {/* CONTENT - Scrollable */}
                <div style={content}>
                    {/* JOBS LIST */}
                    {activeTab === "jobs" && (
                        <>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: isMobile ? "20px" : "24px",
                                flexWrap: "wrap",
                                gap: "15px"
                            }}>
                                <div>
                                    <h2 style={{ 
                                        margin: 0, 
                                        fontSize: isMobile ? "1.5rem" : isTablet ? "1.75rem" : "1.875rem",
                                        color: "#1e293b",
                                        fontWeight: 700,
                                        letterSpacing: "-0.025em"
                                    }}>
                                        Available Jobs ({hasActiveFilters() ? filteredJobs.length : jobs.length})
                                        {hasActiveFilters() && (
                                            <span style={{ 
                                                fontSize: "0.8rem", 
                                                color: "#64748b", 
                                                fontWeight: 400,
                                                marginLeft: "8px"
                                            }}>
                                                (filtered from {jobs.length})
                                            </span>
                                        )}
                                    </h2>
                                    <p style={{ 
                                        margin: "8px 0 0", 
                                        color: "#64748b", 
                                        fontSize: isMobile ? "0.85rem" : "0.95rem" 
                                    }}>
                                        Browse and apply to exciting opportunities
                                    </p>
                                </div>
                                {/* Mobile Filter Button */}
                                {isMobile && (
                                    <button
                                        onClick={() => setShowFilters(true)}
                                        style={{
                                            padding: "10px 20px",
                                            background: "#4f46e5",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            fontSize: "0.9rem",
                                            fontWeight: 600,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
                                            transition: "all 0.2s"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = "translateY(-2px)";
                                            e.target.style.boxShadow = "0 4px 8px rgba(79, 70, 229, 0.3)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = "translateY(0)";
                                            e.target.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.2)";
                                        }}
                                    >
                                        <span>🔍</span>
                                        <span>Filters</span>
                                    </button>
                                )}
                            </div>
                            
                            {filteredJobs.length === 0 ? (
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
                                        {hasActiveFilters() ? "No Jobs Match Your Filters" : "No Jobs Available"}
                                    </h3>
                                    <p style={{ 
                                        color: "#64748b", 
                                        margin: "0 auto 16px",
                                        fontSize: "0.95rem",
                                        maxWidth: "400px"
                                    }}>
                                        {hasActiveFilters() 
                                            ? "Try adjusting your filters to see more results." 
                                            : "Check back later for new job opportunities!"}
                                    </p>
                                    {hasActiveFilters() && (
                                        <button
                                            onClick={clearFilters}
                                            style={{
                                                padding: "10px 20px",
                                                background: "#4f46e5",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                fontSize: "0.9rem",
                                                fontWeight: 600,
                                                transition: "all 0.2s"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "#4338ca";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "#4f46e5";
                                            }}
                                        >
                                            Clear All Filters
                                        </button>
                                    )}
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
                                    {filteredJobs.map((job, index) => {
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

                                                {/* Profile Section - Prominent Display */}
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
                                                    onClick={() => {
                                                        // TODO: Implement apply functionality
                                                        alert("Apply functionality coming soon!");
                                                    }}
                                                >
                                                    Apply Now
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {/* COMPANIES LIST */}
                    {activeTab === "companies" && (
                        <>
                            <h2>Companies ({companies.length})</h2>
                            {companies.length === 0 ? (
                                <p style={{ color: "#64748b", padding: 20 }}>No companies with valid company names found.</p>
                            ) : (
                                <div style={companyGrid}>
                                    {companies.map((c, i) => {
                                        // Additional safety check - should already be filtered but just in case
                                        if (!c?.basicSetting?.companyName || c.basicSetting.companyName.trim() === "") {
                                            return null;
                                        }
                                        return (
                                            <div key={i} style={companyCard}>
                                                <h3>{c.basicSetting.companyName}</h3>
                                                <p>Domain: {c.basicSetting?.companyDomain || "—"}</p>
                                                <p>Email: {c.contactDetails?.companyEmail || "—"}</p>
                                                <p>Phone: {c.contactDetails?.companyMobileNumber || "—"}</p>
                                                <p>Address: {c.contactDetails?.companyAddress || "—"}</p>
                                                {c.basicSetting?.companyDomain && (
                                                    <button
                                                        style={applyBtn}
                                                        onClick={() => handleViewCompany(c.basicSetting.companyDomain)}
                                                    >
                                                        View Company
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {/* APPLICATIONS */}
                    {activeTab === "applications" && (
                        <>
                            <h2>My Applications</h2>
                            <p>Application data coming soon...</p>
                        </>
                    )}
                </div>

                {/* SIDEBAR - Static Filters on Right - only for jobs - Hidden on mobile */}
                {activeTab === "jobs" && !isMobile && (
                    <div style={{
                        ...sidebar,
                        width: isTablet ? "260px" : "280px",
                        position: "sticky",
                        top: "clamp(15px, 3vw, 25px)",
                        maxHeight: "calc(100vh - 95px)"
                    }}>
                        <div style={sidebarContent}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <h3 style={{ ...sidebarTitle, margin: 0 }}>Filters</h3>
                                {hasActiveFilters() && (
                                    <button
                                        onClick={clearFilters}
                                        style={{
                                            padding: "4px 12px",
                                            background: "transparent",
                                            color: "#ef4444",
                                            border: "1px solid #ef4444",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.75rem",
                                            fontWeight: 600
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = "#fee2e2";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = "transparent";
                                        }}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div style={filterBlock}>
                                <strong style={filterTitle}>Job Type</strong>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.jobType.FULL_TIME}
                                        onChange={() => handleFilterChange("jobType", "FULL_TIME")}
                                    /> Full-time
                                </label>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.jobType.PART_TIME}
                                        onChange={() => handleFilterChange("jobType", "PART_TIME")}
                                    /> Part-time
                                </label>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.jobType.REMOTE}
                                        onChange={() => handleFilterChange("jobType", "REMOTE")}
                                    /> Remote
                                </label>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.jobType.INTERNSHIP}
                                        onChange={() => handleFilterChange("jobType", "INTERNSHIP")}
                                    /> Internship
                                </label>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.jobType.HYBRID}
                                        onChange={() => handleFilterChange("jobType", "HYBRID")}
                                    /> Hybrid
                                </label>
                            </div>

                            <div style={filterBlock}>
                                <strong style={filterTitle}>Experience</strong>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.experience["0-2"]}
                                        onChange={() => handleFilterChange("experience", "0-2")}
                                    /> 0–2 years
                                </label>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.experience["3-5"]}
                                        onChange={() => handleFilterChange("experience", "3-5")}
                                    /> 3–5 years
                                </label>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.experience["5+"]}
                                        onChange={() => handleFilterChange("experience", "5+")}
                                    /> 5+ years
                                </label>
                            </div>

                            <div style={filterBlock}>
                                <strong style={filterTitle}>Salary</strong>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.salary["3-6"]}
                                        onChange={() => handleFilterChange("salary", "3-6")}
                                    /> 3–6 LPA
                                </label>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.salary["6-10"]}
                                        onChange={() => handleFilterChange("salary", "6-10")}
                                    /> 6–10 LPA
                                </label>
                                <label style={filterLabel}>
                                    <input 
                                        type="checkbox" 
                                        style={checkboxStyle}
                                        checked={filters.salary["10+"]}
                                        onChange={() => handleFilterChange("salary", "10+")}
                                    /> 10+ LPA
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Filter Modal/Drawer */}
                {activeTab === "jobs" && isMobile && showFilters && (
                    <>
                        {/* Overlay */}
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "rgba(0, 0, 0, 0.5)",
                                zIndex: 999,
                                animation: "fadeIn 0.3s ease"
                            }}
                            onClick={() => setShowFilters(false)}
                        />
                        {/* Filter Drawer */}
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: "85%",
                                maxWidth: "320px",
                                background: "#fff",
                                zIndex: 1000,
                                boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
                                overflowY: "auto",
                                animation: "slideInRight 0.3s ease"
                            }}
                        >
                            <div style={{
                                padding: "20px",
                                borderBottom: "2px solid #e2e8f0",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                position: "sticky",
                                top: 0,
                                background: "#fff",
                                zIndex: 1
                            }}>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: "1.25rem",
                                    fontWeight: 700,
                                    color: "#1e293b"
                                }}>
                                    Filters
                                </h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        fontSize: "24px",
                                        cursor: "pointer",
                                        color: "#64748b",
                                        padding: "4px 8px",
                                        lineHeight: 1
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            <div style={{ padding: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Filters</h4>
                                    {hasActiveFilters() && (
                                        <button
                                            onClick={clearFilters}
                                            style={{
                                                padding: "4px 12px",
                                                background: "transparent",
                                                color: "#ef4444",
                                                border: "1px solid #ef4444",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                fontSize: "0.75rem",
                                                fontWeight: 600
                                            }}
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                
                                <div style={filterBlock}>
                                    <strong style={filterTitle}>Job Type</strong>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.jobType.FULL_TIME}
                                            onChange={() => handleFilterChange("jobType", "FULL_TIME")}
                                        /> Full-time
                                    </label>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.jobType.PART_TIME}
                                            onChange={() => handleFilterChange("jobType", "PART_TIME")}
                                        /> Part-time
                                    </label>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.jobType.REMOTE}
                                            onChange={() => handleFilterChange("jobType", "REMOTE")}
                                        /> Remote
                                    </label>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.jobType.INTERNSHIP}
                                            onChange={() => handleFilterChange("jobType", "INTERNSHIP")}
                                        /> Internship
                                    </label>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.jobType.HYBRID}
                                            onChange={() => handleFilterChange("jobType", "HYBRID")}
                                        /> Hybrid
                                    </label>
                                </div>

                                <div style={filterBlock}>
                                    <strong style={filterTitle}>Experience</strong>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.experience["0-2"]}
                                            onChange={() => handleFilterChange("experience", "0-2")}
                                        /> 0–2 years
                                    </label>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.experience["3-5"]}
                                            onChange={() => handleFilterChange("experience", "3-5")}
                                        /> 3–5 years
                                    </label>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.experience["5+"]}
                                            onChange={() => handleFilterChange("experience", "5+")}
                                        /> 5+ years
                                    </label>
                                </div>

                                <div style={filterBlock}>
                                    <strong style={filterTitle}>Salary</strong>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.salary["3-6"]}
                                            onChange={() => handleFilterChange("salary", "3-6")}
                                        /> 3–6 LPA
                                    </label>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.salary["6-10"]}
                                            onChange={() => handleFilterChange("salary", "6-10")}
                                        /> 6–10 LPA
                                    </label>
                                    <label style={filterLabel}>
                                        <input 
                                            type="checkbox" 
                                            style={checkboxStyle}
                                            checked={filters.salary["10+"]}
                                            onChange={() => handleFilterChange("salary", "10+")}
                                        /> 10+ LPA
                                    </label>
                                </div>
                                
                                {/* Apply Button */}
                                <button
                                    onClick={() => setShowFilters(false)}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "20px",
                                        background: "#4f46e5",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "#4338ca";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = "#4f46e5";
                                    }}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                        <style>{`
                            @keyframes fadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }
                            @keyframes slideInRight {
                                from { transform: translateX(100%); }
                                to { transform: translateX(0); }
                            }
                        `}</style>
                    </>
                )}
            </div>
        </>
    );
}

/* ===== STYLES ===== */
const navbar = { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
    flexWrap: "wrap",
    gap: "15px"
};

const logo = { 
    fontWeight: "bold", 
    fontSize: "clamp(18px, 4vw, 22px)", 
    color: "#ef4444",
    whiteSpace: "nowrap"
};

const navLinks = { 
    display: "flex", 
    gap: "clamp(10px, 2vw, 25px)",
    flexWrap: "wrap",
    fontSize: "clamp(14px, 2vw, 16px)"
};

const link = { cursor: "pointer", color: "#444" };
const activeLink = { color: "#4f46e5", borderBottom: "2px solid #4f46e5" };
const loginBtn = { 
    background: "#2563eb", 
    color: "#fff", 
    padding: "8px 16px", 
    borderRadius: 6, 
    border: "none", 
    cursor: "pointer",
    fontSize: "clamp(14px, 2vw, 16px)",
    whiteSpace: "nowrap"
};

const layout = { 
    display: "flex", 
    flexDirection: "row", // Explicitly set to row to keep filters on right
    padding: "clamp(15px, 3vw, 25px)",
    gap: "clamp(15px, 3vw, 25px)",
    height: "calc(100vh - 70px)", // Subtract navbar height
    overflow: "hidden"
};

const sidebar = { 
    width: "280px",
    flexShrink: 0,
    position: "sticky",
    top: "25px",
    alignSelf: "flex-start",
    maxHeight: "calc(100vh - 95px)", // Account for padding
    overflowY: "auto"
};

const sidebarContent = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0"
};

const sidebarTitle = {
    margin: "0 0 20px",
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#1e293b",
    paddingBottom: "12px",
    borderBottom: "2px solid #e2e8f0"
};

const filterBlock = { 
    marginBottom: 24, 
    display: "flex", 
    flexDirection: "column", 
    gap: 10, 
    fontSize: 14 
};

const filterTitle = {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
};

const filterLabel = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    color: "#64748b",
    fontSize: "0.9rem",
    padding: "4px 0",
    transition: "color 0.2s"
};

const checkboxStyle = {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: "#4f46e5"
};

const content = { 
    flex: 1,
    overflowY: "auto",
    paddingRight: "10px",
    minWidth: 0 // Allows flex item to shrink below content size
};

const jobCard = { 
    border: "1px solid #ddd", 
    padding: "clamp(15px, 3vw, 20px)", 
    marginBottom: "clamp(15px, 3vw, 20px)", 
    borderRadius: 8 
};

const applyBtn = { 
    padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)", 
    background: "#4f46e5", 
    color: "#fff", 
    border: "none", 
    borderRadius: 6, 
    cursor: "pointer",
    fontSize: "clamp(14px, 2vw, 16px)",
    width: "100%",
    maxWidth: "200px"
};

const center = { 
    height: "60vh", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
};

const companyGrid = { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", 
    gap: "clamp(15px, 3vw, 20px)" 
};

const companyCard = { 
    padding: "clamp(15px, 3vw, 20px)", 
    borderRadius: 12, 
    background: "#fff", 
    boxShadow: "0 4px 10px rgba(0,0,0,.1)" 
};

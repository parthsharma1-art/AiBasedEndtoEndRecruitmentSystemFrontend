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
// Returns: { loggedIn: boolean, userType: 'candidate' | 'recruiter' | null }
function checkUserLoginStatus() {
    const token = localStorage.getItem("token");
    if (!token) return { loggedIn: false, userType: null };
    
    // Check if login timestamp exists
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    if (!loginTimestamp) {
        // If no timestamp, assume logged in (for backward compatibility)
        // Set current timestamp for future checks
        localStorage.setItem("loginTimestamp", Date.now().toString());
        // Check user type: candidates have 'id', recruiters have 'hrId'
        const userType = localStorage.getItem("id") ? "candidate" : "recruiter";
        return { loggedIn: true, userType };
    }
    
    // Check if login was within last 4 hours (4 * 60 * 60 * 1000 milliseconds)
    const fourHoursInMs = 4 * 60 * 60 * 1000;
    const currentTime = Date.now();
    const loginTime = parseInt(loginTimestamp, 10);
    
    if (currentTime - loginTime > fourHoursInMs) {
        // Token expired (more than 4 hours), clear it
        localStorage.removeItem("token");
        localStorage.removeItem("loginTimestamp");
        localStorage.removeItem("id");
        localStorage.removeItem("hrId");
        localStorage.removeItem("name");
        localStorage.removeItem("hrName");
        return { loggedIn: false, userType: null };
    }
    
    // Determine user type: candidates have 'id', recruiters have 'hrId'
    const userType = localStorage.getItem("id") ? "candidate" : "recruiter";
    return { loggedIn: true, userType };
}

export default function BrowseJobs() {
    const [activeTab, setActiveTab] = useState("jobs"); // "jobs" | "companies" | "applications"
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false); // For mobile filter modal
    const [loginStatus, setLoginStatus] = useState({ loggedIn: false, userType: null });
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

    const navigate = useNavigate();
    
    // Check login status on mount and periodically
    useEffect(() => {
        setLoginStatus(checkUserLoginStatus());
        
        // Check every minute to update login status
        const interval = setInterval(() => {
            setLoginStatus(checkUserLoginStatus());
        }, 60000); // Check every minute
        
        return () => clearInterval(interval);
    }, []);
    console.log(activeTab,"heren is rhe acive tab");
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

    if (loading) {
        return (
            <div style={center}>
                <h2>Loading...</h2>
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

                {loginStatus.loggedIn ? (
                    <button 
                        style={{
                            ...loginBtn,
                            background: "#10b981"
                        }} 
                        onClick={() => navigate(
                            loginStatus.userType === "candidate" 
                                ? "/candidate-dashboard" 
                                : "/dashboard"
                        )}
                    >
                        Dashboard
                    </button>
                ) : (
                    <button 
                        style={loginBtn} 
                        onClick={() => navigate("/candidate-auth")}
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
                                marginBottom: "20px",
                                flexWrap: "wrap",
                                gap: "15px"
                            }}>
                                <h2 style={{ margin: 0 }}>Available Jobs ({jobs.length})</h2>
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
                                            boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)"
                                        }}
                                    >
                                        <span>🔍</span>
                                        <span>Filters</span>
                                    </button>
                                )}
                            </div>
                            {jobs.map((job, index) => {
                                const j = job?.jobPostingsResponse;
                                if (!j) return null;
                                return (
                                    <div key={index} style={jobCard}>
                                        <h3>{job.companyName}</h3>
                                        <h4>{j.title}</h4>
                                        <p>{j.description}</p>
                                        <button style={applyBtn}>Apply Now</button>
                                    </div>
                                );
                            })}
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
                            <h3 style={sidebarTitle}>Filters</h3>
                            <div style={filterBlock}>
                                <strong style={filterTitle}>Job Type</strong>
                                <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> Full-time</label>
                                <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> Part-time</label>
                                <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> Remote</label>
                            </div>

                            <div style={filterBlock}>
                                <strong style={filterTitle}>Experience</strong>
                                <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 0–2 years</label>
                                <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 3–5 years</label>
                                <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 5+ years</label>
                            </div>

                            <div style={filterBlock}>
                                <strong style={filterTitle}>Salary</strong>
                                <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 3–6 LPA</label>
                                <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 6–10 LPA</label>
                                <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 10+ LPA</label>
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
                                <div style={filterBlock}>
                                    <strong style={filterTitle}>Job Type</strong>
                                    <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> Full-time</label>
                                    <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> Part-time</label>
                                    <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> Remote</label>
                                </div>

                                <div style={filterBlock}>
                                    <strong style={filterTitle}>Experience</strong>
                                    <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 0–2 years</label>
                                    <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 3–5 years</label>
                                    <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 5+ years</label>
                                </div>

                                <div style={filterBlock}>
                                    <strong style={filterTitle}>Salary</strong>
                                    <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 3–6 LPA</label>
                                    <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 6–10 LPA</label>
                                    <label style={filterLabel}><input type="checkbox" style={checkboxStyle} /> 10+ LPA</label>
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
                                        boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)"
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

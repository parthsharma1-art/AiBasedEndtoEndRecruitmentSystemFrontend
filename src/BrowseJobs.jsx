import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Config from "./config/config";

const JOBS_API = Config.BACKEND_URL + "/public/jobs";
const COMPANIES_API = Config.BACKEND_URL + "/public/profiles"; // make sure backend config matches

export default function BrowseJobs() {
    const [activeTab, setActiveTab] = useState("jobs"); // "jobs" | "companies" | "applications"
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
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
            setCompanies(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            alert("Failed to load companies");
        } finally {
            setLoading(false);
        }
    };

    const handleViewCompany = (domain) => {
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
                <div style={logo}>🔥 HirePath</div>

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

                <button style={loginBtn} onClick={() => navigate("/candidate-auth")}>
                    Login
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div style={layout}>
                {/* SIDEBAR - only for jobs */}
                {activeTab === "jobs" && (
                    <div style={sidebar}>
                        <h3>Filters</h3>
                        <div style={filterBlock}>
                            <strong>Job Type</strong>
                            <label><input type="checkbox" /> Full-time</label>
                            <label><input type="checkbox" /> Part-time</label>
                            <label><input type="checkbox" /> Remote</label>
                        </div>

                        <div style={filterBlock}>
                            <strong>Experience</strong>
                            <label><input type="checkbox" /> 0–2 years</label>
                            <label><input type="checkbox" /> 3–5 years</label>
                            <label><input type="checkbox" /> 5+ years</label>
                        </div>

                        <div style={filterBlock}>
                            <strong>Salary</strong>
                            <label><input type="checkbox" /> 3–6 LPA</label>
                            <label><input type="checkbox" /> 6–10 LPA</label>
                            <label><input type="checkbox" /> 10+ LPA</label>
                        </div>
                    </div>
                )}

                {/* CONTENT */}
                <div style={content}>
                    {/* JOBS LIST */}
                    {activeTab === "jobs" && (
                        <>
                            <h2>Available Jobs ({jobs.length})</h2>
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
                            <div style={companyGrid}>
                                {companies.map((c, i) => (
                                    <div key={i} style={companyCard}>
                                        <h3>{c.basicSetting?.companyName}</h3>
                                        <p>Domain: {c.basicSetting?.companyDomain}</p>
                                        <p>Email: {c.contactDetails?.companyEmail}</p>
                                        <p>Phone: {c.contactDetails?.companyMobileNumber}</p>
                                        <p>Address: {c.contactDetails?.companyAddress}</p>
                                        <button
                                            style={applyBtn}
                                            onClick={() => handleViewCompany(c.basicSetting?.companyDomain)}
                                        >
                                            View Company
                                        </button>
                                    </div>
                                ))}
                            </div>
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
            </div>
        </>
    );
}

/* ===== STYLES ===== */
const navbar = { display: "flex", justifyContent: "space-between", padding: "15px 30px", borderBottom: "1px solid #eee" };
const logo = { fontWeight: "bold", fontSize: 22, color: "#ef4444" };
const navLinks = { display: "flex", gap: 25 };
const link = { cursor: "pointer", color: "#444" };
const activeLink = { color: "#4f46e5", borderBottom: "2px solid #4f46e5" };
const loginBtn = { background: "#2563eb", color: "#fff", padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer" };

const layout = { display: "flex", padding: 25 };
const sidebar = { width: 220, paddingRight: 20 };
const filterBlock = { marginBottom: 20, display: "flex", flexDirection: "column", gap: 6, fontSize: 14 };
const content = { flex: 1 };

const jobCard = { border: "1px solid #ddd", padding: 20, marginBottom: 20, borderRadius: 8 };
const applyBtn = { padding: 10, background: "#4f46e5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const center = { height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" };

const companyGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 };
const companyCard = { padding: 20, borderRadius: 12, background: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,.1)" };

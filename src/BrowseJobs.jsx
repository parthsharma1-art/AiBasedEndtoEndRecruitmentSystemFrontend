import React, { useEffect, useState } from "react";
import axios from "axios";
import Config from "./config/config";

const API = Config.BACKEND_URL + "/public/jobs";

export default function BrowseJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get(API);
            console.log("JOB API RESPONSE:", res.data); // ⭐ debug

            if (Array.isArray(res.data)) {
                setJobs(res.data);
            } else {
                setJobs([]);
            }
        } catch (err) {
            console.error("Error fetching jobs:", err);
            alert("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={center}>
                <h2>Loading jobs...</h2>
            </div>
        );
    }

    return (
        <div style={page}>
            <h1 style={heading}>🔥 Available Jobs</h1>

            {jobs.length === 0 && (
                <p style={{ textAlign: "center" }}>No jobs available</p>
            )}

            <div style={grid}>
                {jobs.map((job, index) => {
                    const j = job?.jobPostingsResponse;

                    if (!j) return null; // safety

                    return (
                        <div key={j.id || index} style={card}>

                            {/* COMPANY */}
                            <div style={companyBox}>
                                <h2 style={{ margin: 0 }}>{job.companyName}</h2>
                                <p style={domain}>{job.companyDomain}</p>
                            </div>

                            {/* JOB TITLE */}
                            <h3 style={title}>{j.title}</h3>

                            {/* DESCRIPTION */}
                            <p style={desc}>{j.description}</p>

                            {/* SKILLS */}
                            <div style={skillBox}>
                                {j.skillsRequired?.map((skill, i) => (
                                    <span key={i} style={skillStyle}>
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* INFO */}
                            <div style={infoRow}>
                                <span>💼 {j.jobType}</span>
                                <span>💰 {j.salaryRange}</span>
                            </div>

                            <div style={infoRow}>
                                <span>🧠 {j.experienceRequired} yrs</span>
                                <span>
                                    📅 {new Date(j.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <button style={applyBtn}>
                                Apply Now
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* STYLES */
const page = {
    padding: "40px 20px",
    maxWidth: 1200,
    margin: "auto",
    fontFamily: "Arial"
};

const heading = {
    textAlign: "center",
    marginBottom: 40,
    color: "#4f46e5"
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: 25
};

const card = {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
};

const companyBox = {
    borderBottom: "1px solid #eee",
    paddingBottom: 10,
    marginBottom: 15
};

const domain = {
    margin: 0,
    fontSize: 13,
    color: "#666"
};

const title = {
    margin: "10px 0",
    color: "#111"
};

const desc = {
    fontSize: 14,
    color: "#444",
    marginBottom: 15
};

const skillBox = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15
};

const skillStyle = {
    background: "#eef2ff",
    padding: "5px 10px",
    borderRadius: 6,
    fontSize: 12,
    color: "#4f46e5"
};

const infoRow = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#555",
    marginBottom: 8
};

const applyBtn = {
    marginTop: 15,
    padding: "12px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%"
};

const center = {
    height: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CONFIG from "./config/config";
import "./styles/dashboard.css";

const API_BASE = CONFIG.BACKEND_URL + "/profile";

export default function AllJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            navigate("/");
            return;
        }
        try {
            const res = await axios.get(`${API_BASE}/jobs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(res.data || []);
        } catch (err) {
            console.error(err);
            alert("Error fetching jobs");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-content">
                <h2>Loading jobs...</h2>
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b" }}>All Posted Jobs</h1>
                <button
                    type="button"
                    className="btn-sm btn-view"
                    style={{ padding: "10px 20px" }}
                    onClick={() => navigate("/dashboard/jobs/create")}
                >
                    + Create Job
                </button>
            </div>

            {jobs.length === 0 && (
                <p style={{ color: "#64748b", padding: 24 }}>No jobs found. Create a job from Post New Job or Manage Jobs.</p>
            )}

            <div style={{ overflowY: "auto", paddingRight: 10 }}>
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        style={{
                            background: "#fff",
                            padding: 20,
                            borderRadius: 12,
                            marginBottom: 16,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        }}
                    >
                        <h3 style={{ margin: "0 0 12px", fontSize: "1.1rem", color: "#1e293b" }}>{job.title}</h3>
                        <p style={{ margin: "0 0 12px", fontSize: "0.9rem", color: "#475569", lineHeight: 1.5 }}>{job.description}</p>
                        <p style={{ margin: "0 0 8px", fontSize: "0.9rem" }}>
                            <strong>Skills:</strong> {job.skillsRequired?.length ? job.skillsRequired.join(", ") : "N/A"}
                        </p>
                        <p style={{ margin: "0 0 8px", fontSize: "0.9rem" }}><strong>Salary:</strong> {job.salaryRange}</p>
                        <p style={{ margin: "0 0 8px", fontSize: "0.9rem" }}><strong>Type:</strong> {job.jobType}</p>
                        <p style={{ margin: "0 0 8px", fontSize: "0.9rem" }}><strong>Experience:</strong> {job.experienceRequired} yrs</p>
                        <p style={{ margin: "0 0 8px", fontSize: "0.9rem" }}><strong>Status:</strong> {job.active ? "Active" : "Inactive"}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
                            Created: {job.createdAt ? new Date(job.createdAt).toLocaleString() : "—"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}



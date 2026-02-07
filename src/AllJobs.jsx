import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CONFIG from "./config/config";

const API_BASE = CONFIG.BACKEND_URL+"/profile";

// axios.get(`${API_BASE}/jobs`)


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
            alert("Login again");
            return;
        }

        try {
            const res = await axios.get(`${API_BASE}/jobs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setJobs(res.data || []);
        } catch (err) {
            console.error(err);
            alert("Error fetching jobs");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <h3 style={{ padding: 20 }}>Loading jobs...</h3>;

    return (
        <div style={{ padding: 30 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>All Posted Jobs</h2>

                <button
                    style={createBtn}
                    onClick={() => navigate("/dashboard/jobs/create")}
                >
                    + Create Job
                </button>
            </div>

            {jobs.length === 0 && <p>No jobs posted yet</p>}

            {jobs.map((job) => (
                <div key={job.id} style={card}>
                    <h3>{job.title}</h3>
                    <p>{job.description}</p>

                    <p>
                        <b>Skills:</b>{" "}
                        {job.skillsRequired?.length
                            ? job.skillsRequired.join(", ")
                            : "N/A"}
                    </p>

                    <p><b>Salary:</b> {job.salaryRange}</p>
                    <p><b>Type:</b> {job.jobType}</p>
                    <p><b>Experience:</b> {job.experienceRequired} yrs</p>
                    <p><b>Status:</b> {job.active ? "Active" : "Inactive"}</p>

                    <p style={{ fontSize: 12, color: "gray" }}>
                        Created: {new Date(job.createdAt).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}

/* styles */
const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    marginTop: 15,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const createBtn = {
    padding: "6px 13px",   // reduced vertical padding from 10px → 6px
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 15   // optional: slightly smaller text for thinner look
};


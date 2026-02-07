import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Config from "./config/config"

const API_BASE = Config.BACKEND_URL + "/profile";

export default function CreateJobPosting() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        skillsRequired: "",
        salaryRange: "",
        jobType: "REMOTE",
        experienceRequired: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isFormValid =
        form.title.trim() !== "" &&
        form.description.trim() !== "" &&
        form.skillsRequired.trim() !== "" &&
        form.salaryRange.trim() !== "" &&
        form.experienceRequired !== "";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Token not found. Please login again.");
            return;
        }

        const skillsArray = form.skillsRequired
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const payload = {
            title: form.title,
            description: form.description,
            skillsRequired: skillsArray,
            salaryRange: form.salaryRange,
            jobType: form.jobType,
            experienceRequired: parseInt(form.experienceRequired) || 0,
        };

        try {
            setLoading(true);
            await axios.post(`${API_BASE}/job/post`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Redirect to All Jobs page after creation
            navigate("/dashboard/jobs");
        } catch (err) {
            console.error("Error creating job:", err.response || err);
            alert(err.response?.data?.message || "Error creating job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={container}>
            <h2>Create a Job Posting</h2>
            <div style={formGroup}>
                <label>Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} style={inp} />
            </div>
            <div style={formGroup}>
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} style={{ ...inp, height: 100 }} />
            </div>
            <div style={formGroup}>
                <label>Skills Required (comma separated)</label>
                <input type="text" name="skillsRequired" value={form.skillsRequired} onChange={handleChange} style={inp} />
            </div>
            <div style={formGroup}>
                <label>Salary Range</label>
                <input type="text" name="salaryRange" value={form.salaryRange} onChange={handleChange} style={inp} />
            </div>
            <div style={formGroup}>
                <label>Job Type</label>
                <select name="jobType" value={form.jobType} onChange={handleChange} style={inp}>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">Onsite</option>
                </select>
            </div>
            <div style={formGroup}>
                <label>Experience Required (years)</label>
                <input type="number" name="experienceRequired" value={form.experienceRequired} onChange={handleChange} style={inp} />
            </div>
            {/* <button onClick={handleSubmit} style={btn} disabled={loading}>
                {loading ? "Posting..." : "Create Job"}
            </button> */}
            <button
                onClick={handleSubmit}
                style={{
                    ...btn,
                    background: isFormValid ? "#4f46e5" : "#9ca3af",
                    cursor: isFormValid ? "pointer" : "not-allowed",
                    opacity: isFormValid ? 1 : 0.6
                }}
                disabled={!isFormValid || loading}
            >
                {loading ? "Posting..." : "Create Job"}
            </button>

        </div>
    );
}

/* Styles */
const container = { maxWidth: 600, margin: "50px auto", padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 5px 20px rgba(0,0,0,0.1)" };
const formGroup = { marginBottom: 20, textAlign: "left" };
// const inp = { width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", marginTop: 5 };
const inp = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    marginTop: 6,
    boxSizing: "border-box",   // ⭐ FIX
    outline: "none"
};


const btn = { padding: "12px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16 };

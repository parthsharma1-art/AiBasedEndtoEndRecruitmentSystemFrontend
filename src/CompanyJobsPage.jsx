import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "./config/config";

const BACKEND_URL = CONFIG.BACKEND_URL;

export default function CompanyJobsPage() {
    const { companySlug } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);

    // 🔐 simple login check
    const isLoggedIn = Boolean(localStorage.getItem("candidateToken"));

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/public/${companySlug}`)
            .then(res => setCompany(res.data));
    }, [companySlug]);

    if (!company) return <p style={styles.loading}>Loading...</p>;

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.header}>
                <h2 style={styles.companyName}>
                    {company.basicSetting.companyName}
                </h2>
                <p style={styles.subtitle}>Explore all open opportunities</p>
            </div>

            {company.jobPostingsResponses.map(job => (
                <div key={job.id} style={styles.jobCard}>
                    <h3 style={styles.jobTitle}>{job.title}</h3>

                    <p style={styles.description}>{job.description}</p>

                    <div style={styles.meta}>
                        <span style={styles.badge}>💼 {job.jobType}</span>
                        <span style={styles.badge}>💰 {job.salaryRange}</span>
                    </div>

                    <p style={styles.skills}>
                        <strong>Skills:</strong>{" "}
                        {job.skillsRequired.join(", ")}
                    </p>

                    {/* 🔥 LOGIN / APPLY ACTION */}
                    {!isLoggedIn ? (
                        <button
                            style={styles.loginBtn}
                            onClick={() =>
                                navigate(
                                    `/candidate-auth?companyId=${company.id}&jobId=${job.id}`
                                )
                            }
                        >
                            Login to Apply
                        </button>
                    ) : (
                        <button
                            style={styles.applyBtn}
                            onClick={() =>
                                navigate(
                                    `/candidate-apply?jobId=${job.id}`
                                )
                            }
                        >
                            Apply Now
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

/* 🎨 STYLES ONLY */
const styles = {
    page: {
        maxWidth: 1000,
        margin: "auto",
        padding: "40px 20px",
        background: "#f4f6f9",
        minHeight: "100vh"
    },

    loading: {
        padding: 40,
        fontSize: 18,
        textAlign: "center"
    },

    header: {
        marginBottom: 40,
        textAlign: "center"
    },

    companyName: {
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 6,
        color: "#111"
    },

    subtitle: {
        color: "#555",
        fontSize: 16
    },

    jobCard: {
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        marginBottom: 24,
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)"
    },

    jobTitle: {
        fontSize: 22,
        fontWeight: 600,
        marginBottom: 10
    },

    description: {
        color: "#555",
        lineHeight: 1.6,
        marginBottom: 16
    },

    meta: {
        display: "flex",
        gap: 12,
        marginBottom: 12,
        flexWrap: "wrap"
    },

    badge: {
        background: "#eef2ff",
        color: "#3730a3",
        padding: "6px 12px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 500
    },

    skills: {
        marginBottom: 16,
        fontSize: 14
    },

    loginBtn: {
        background: "#2563eb",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        fontWeight: 500
    },

    applyBtn: {
        background: "#16a34a",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        fontWeight: 500
    }
};

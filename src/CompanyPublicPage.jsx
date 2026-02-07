import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "./config/config";

const BACKEND_URL = CONFIG.BACKEND_URL;

export default function CompanyPublicPage() {
    const { companySlug } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchCompany() {
            try {
                const res = await axios.get(
                    `${BACKEND_URL}/public/${companySlug}`
                );
                setCompany(res.data);
            } catch (err) {
                setError("Company not found");
            } finally {
                setLoading(false);
            }
        }
        fetchCompany();
    }, [companySlug]);

    if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
    if (error) return <p style={{ padding: 40 }}>{error}</p>;

    const jobs = company.jobPostingsResponses || [];
    const showJobs = jobs.slice(0, 2);

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <h2>{company.basicSetting.companyName}</h2>
                <button
                    style={styles.loginBtn}
                    onClick={() => navigate("/candidate-auth")}
                >
                    Candidate Login
                </button>
            </header>

            {/* Company Info */}
            <section style={styles.card}>
                <p><strong>Email:</strong> {company.contactDetails.companyEmail}</p>
                <p><strong>Address:</strong> {company.contactDetails.companyAddress}</p>
            </section>

            {/* Jobs */}
            <section>
                <h3>Open Positions</h3>

                {showJobs.map(job => (
                    <div key={job.id} style={styles.jobCard}>
                        <h4>{job.title}</h4>
                        <p>{job.description}</p>
                        <p><strong>Salary:</strong> {job.salaryRange}</p>
                        <p><strong>Type:</strong> {job.jobType}</p>
                    </div>
                ))}

                {jobs.length > 2 && (
                    <button
                        style={styles.viewAllBtn}
                        onClick={() => navigate(`/${companySlug}/jobs`)}
                    >
                        View All Jobs
                    </button>
                )}
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <span>© {company.basicSetting.companyName}</span>
                <div>
                    <button>About Us</button>
                    <button>Terms of Service</button>
                </div>
            </footer>
        </div>
    );
}

const styles = {
    container: { maxWidth: 900, margin: "auto", padding: 20 },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30
    },
    loginBtn: {
        padding: "8px 16px",
        background: "#000",
        color: "#fff",
        border: "none",
        cursor: "pointer"
    },
    card: {
        background: "#f9f9f9",
        padding: 20,
        borderRadius: 6,
        marginBottom: 30
    },
    jobCard: {
        border: "1px solid #ddd",
        padding: 16,
        borderRadius: 6,
        marginBottom: 15
    },
    viewAllBtn: {
        padding: "10px 18px",
        marginTop: 10,
        cursor: "pointer"
    },
    footer: {
        marginTop: 40,
        paddingTop: 20,
        borderTop: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between"
    }
};

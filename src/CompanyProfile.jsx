import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Config from "./config/config";

export default function CompanyProfile() {
    const { subdomain } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    if (loading) return <h2 style={{ textAlign: "center", marginTop: 50 }}>Loading company...</h2>;
    if (!company) return <h2 style={{ textAlign: "center", marginTop: 50 }}>Company not found.</h2>;

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
            <div style={navbar}>
                <h1 style={{ margin: 0 }}>{company.basicSetting?.companyName}</h1>
                <button style={loginBtn} onClick={handleLogin}>Login</button>
            </div>

            {/* COMPANY DETAILS */}
            <div style={page}>
                <h2 style={{ marginTop: 30 }}>🚀 Open Jobs</h2>

                {company.jobPostingsResponses && company.jobPostingsResponses.length > 0 ? (
                    company.jobPostingsResponses.map((job) => (
                        <div key={job.id} style={jobCard}>
                            <h3>{job.title}</h3>
                            <p>{job.description}</p>
                            <p>💰 {job.salaryRange}</p>
                            <p>🧠 {job.experienceRequired} yrs</p>
                            <button style={applyBtn} onClick={() => handleApply(job.id)}>Apply Now</button>
                        </div>
                    ))
                ) : (
                    <p>No open jobs currently.</p>
                )}
            </div>

            {/* FOOTER */}
            <footer style={footer}>
                <p>📧 {company.contactDetails?.companyEmail} | 📞 {company.contactDetails?.companyMobileNumber}</p>
                <p>📍 {company.contactDetails?.companyAddress}</p>
                <p>© {new Date().getFullYear()} {company.basicSetting?.companyName}</p>
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
    fontWeight: "bold",
};
const page = { padding: 40, maxWidth: 900, margin: "auto" };
const jobCard = {
    padding: 20,
    borderRadius: 10,
    border: "1px solid #ddd",
    marginBottom: 20,
    background: "#fff",
};
const applyBtn = {
    marginTop: 12,
    padding: 10,
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
};
const footer = {
    marginTop: 50,
    padding: 25,
    background: "#0f172a",
    color: "#fff",
    textAlign: "center",
    borderRadius: 10,
};

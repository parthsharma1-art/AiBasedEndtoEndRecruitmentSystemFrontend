import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Config from "./config/config";

const API = Config.BACKEND_URL + "/candidate";

export default function CandidateLandingPage() {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getSubdomain = () => {
        const host = window.location.hostname; // e.g., parth-company.localhost
        const parts = host.split(".");
        if (parts.length > 1) return parts[0];
        return null;
    };

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const subdomain = getSubdomain();
                if (!subdomain) throw new Error("Subdomain not found");

                const res = await axios.get(`${API_BASE}/profile/${subdomain}`);
                setCompany(res.data);
            } catch (err) {
                console.error("Error fetching company:", err);
                setCompany(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, []);

    if (loading) return <h2 style={{ textAlign: "center", marginTop: 100 }}>Loading company details...</h2>;
    if (!company) return <h2 style={{ textAlign: "center", marginTop: 100 }}>Company not found</h2>;

    return (
        <div style={container}>
            <header style={header}>
                <h1>{company.basicSetting?.companyName || "Company"}</h1>
                <p>{company.basicSetting?.companyDomain}</p>
            </header>

            <section style={section}>
                <h2>Contact Us</h2>
                <p>{company.contactDetails?.companyAddress}</p>
                <p>Email: {company.contactDetails?.companyEmail}</p>
                <p>Phone: {company.contactDetails?.companyMobileNumber}</p>
            </section>

            {company.socialLinks && (
                <section style={section}>
                    <h2>Follow Us</h2>
                    <div style={socialContainer}>
                        {company.socialLinks.facebook && <a href={company.socialLinks.facebook} target="_blank" rel="noreferrer">Facebook</a>}
                        {company.socialLinks.instagram && <a href={company.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>}
                        {company.socialLinks.google && <a href={company.socialLinks.google} target="_blank" rel="noreferrer">Google</a>}
                        {company.socialLinks.twitter && <a href={company.socialLinks.twitter} target="_blank" rel="noreferrer">Twitter</a>}
                    </div>
                </section>
            )}

            <section style={section}>
                <button style={btn} onClick={() => navigate("/candidate-auth")}>Candidate Login</button>
                <button style={{ ...btn, marginLeft: 20 }} onClick={() => navigate("/candidate-auth")}>Candidate Signup</button>
            </section>

            <footer style={footer}>
                <p>
                    <a href="/terms" style={footerLink}>Terms & Services</a> |{" "}
                    <a href="/privacy" style={footerLink}>Privacy Policy</a>
                </p>
                <p>&copy; {new Date().getFullYear()} {company.basicSetting?.companyName || "Company"}</p>
            </footer>
        </div>
    );
}

const container = { fontFamily: "Arial, sans-serif", padding: "50px 20px", textAlign: "center" };
const header = { marginBottom: 40 };
const section = { marginBottom: 40 };
const socialContainer = { display: "flex", justifyContent: "center", gap: 20, marginTop: 10 };
const btn = { padding: "12px 24px", fontSize: 16, borderRadius: 8, border: "none", background: "#4f46e5", color: "white", cursor: "pointer" };
const footer = { borderTop: "1px solid #ddd", paddingTop: 20, marginTop: 60, fontSize: 14, color: "#555" };
const footerLink = { color: "#4f46e5", textDecoration: "none" };

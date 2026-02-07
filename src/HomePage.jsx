import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div style={{ fontFamily: "Arial" }}>
            {/* HEADER */}
            <header style={{ display: "flex", justifyContent: "space-between", padding: 20, background: "#f5f5f5" }}>
                <h1 style={{ fontSize: 24, color: "#4f46e5" }}>AI Recruitment</h1>
                <nav style={{ display: "flex", gap: 15 }}>
                    <button onClick={() => navigate("/recruiter-auth")} style={linkStyle}>For Recruiters</button>
                    <button onClick={() => navigate("/candidate-auth")} style={linkStyle}>For Candidates</button>
                    {/* <button style={linkStyle}>Pricing</button> */}
                    <button onClick={() => navigate("/pricing")} style={linkStyle}>Pricing</button>

                </nav>
            </header>

            {/* HERO SECTION */}
            <section style={{ textAlign: "center", padding: "60px 20px" }}>
                <h2 style={{ fontSize: 36, marginBottom: 20 }}>AI-Based End-to-End Recruitment System</h2>
                <p style={{ fontSize: 18, marginBottom: 30 }}>
                    Connect top talent with the right opportunities efficiently using our AI-driven platform.
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: 15, flexWrap: "wrap" }}>
                    <button onClick={() => navigate("/recruiter-auth")} style={btnStyleBlue}>
                        Become a Recruiter
                    </button>
                    <button onClick={() => navigate("/candidate-auth")} style={btnStyleGreen}>
                        Become a Candidate
                    </button>
                </div>

                <button onClick={() => navigate("/browse-jobs")} style={{ ...btnStyleBlue, marginTop: 20 }}>
                    Browse Jobs
                </button>
            </section>

            {/* FOOTER */}
            <footer style={footerStyle}>

                {/* FOOTER BUTTONS */}
                <div style={footerBtnContainer}>
                    <button onClick={() => navigate("/recruiter-auth")} style={footerBtn}>
                        Become Recruiter
                    </button>
                    <button onClick={() => navigate("/candidate-auth")} style={footerBtn}>
                        Become Candidate
                    </button>
                    <button onClick={() => navigate("/browse-jobs")} style={footerBtn}>
                        Browse Jobs
                    </button>
                    {/* <button style={footerBtn}>
                        Pricing
                    </button> */}
                    <button onClick={() => navigate("/pricing")} style={footerBtn}>
                        Pricing
                    </button>

                </div>

                {/* COMPANY NAME */}
                <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                    AI Recruitment Platform
                </div>

                {/* COPYRIGHT */}
                <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 15 }}>
                    © 2026 AI Recruitment Platform. All rights reserved.
                </div>

                {/* LINKS */}
                <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
                    <span style={footerLink}>About Us</span>
                    <span style={footerLink}>Contact</span>
                    <span style={footerLink}>Privacy Policy</span>
                    <span style={footerLink}>Terms of Service</span>
                </div>

            </footer>
        </div>
    );
}

/* HEADER BUTTON STYLE */
const linkStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    color: "#4f46e5"
};

/* HERO BUTTONS */
const btnStyleBlue = {
    padding: "12px 25px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16
};

const btnStyleGreen = {
    padding: "12px 25px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16
};

/* FOOTER */
const footerStyle = {
    background: "#111",
    color: "white",
    padding: "60px 20px",   // increased height
    textAlign: "center",
    marginTop: 50
};

/* FOOTER BUTTON CONTAINER */
const footerBtnContainer = {
    display: "flex",
    justifyContent: "center",
    gap: 15,
    flexWrap: "wrap",
    marginBottom: 25
};

/* FOOTER BUTTON */
const footerBtn = {
    padding: "10px 20px",
    background: "#4f46e5",
    border: "none",
    borderRadius: 6,
    color: "white",
    cursor: "pointer",
    fontSize: 14
};

/* FOOTER LINKS (NO UNDERLINE) */
const footerLink = {
    cursor: "pointer",
    fontSize: 14,
    opacity: 0.9
};

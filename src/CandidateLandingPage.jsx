
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Config from "./config/config";

const API = Config.BACKEND_URL;

export default function CandidateLandingPage() {
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/candidate-auth");
                    return;
                }

                const res = await axios.get(`${API}/candidate/get`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });

                setCandidate(res.data);
            } catch (err) {
                console.error("Error fetching candidate:", err);
                navigate("/candidate-auth");
            } finally {
                setLoading(false);
            }
        };

        fetchCandidate();
    }, [navigate]);

    if (loading)
        return (
            <h2 style={{ textAlign: "center", marginTop: 100 }}>
                Loading Dashboard...
            </h2>
        );

    if (!candidate)
        return (
            <h2 style={{ textAlign: "center", marginTop: 100 }}>
                Candidate not found
            </h2>
        );

    return (
        <div style={container}>
            <div style={card}>
                {/* PROFILE IMAGE */}
                {candidate.profileImageId && (
                    <img
                        src={`${API}/file/${candidate.profileImageId}`}
                        alt="Profile"
                        style={profileImg}
                    />
                )}

                <h2>{candidate.name}</h2>
                <p><strong>Email:</strong> {candidate.email}</p>
                <p><strong>Mobile:</strong> {candidate.mobileNumber}</p>

                {/* BUTTON SECTION */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "30px", // Increased space between buttons
                        marginTop: "25px",
                    }}
                >
                    {candidate.resumeId && (
                        <a
                            href={`${API}/file/${candidate.resumeId}`}
                            target="_blank"
                            rel="noreferrer"
                            style={resumeBtn}
                        >
                            View / Download Resume
                        </a>
                    )}

                    <button
                        style={logoutBtn}
                        onClick={() => {
                            localStorage.clear();
                            navigate("/candidate-auth");
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ================= STYLES ================= */

const container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f3f4f6",
};

const card = {
    background: "white",
    padding: 40,
    borderRadius: 15,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: 400,
};

const profileImg = {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 20,
    border: "4px solid #4f46e5",
};

const resumeBtn = {
    display: "inline-block",
    padding: "10px 20px",
    background: "#4f46e5",
    color: "white",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
};

const logoutBtn = {
    padding: "10px 20px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
};

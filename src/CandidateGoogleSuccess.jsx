import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "./config/config";

export default function CandidateGoogleSuccess() {
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleGoogleSuccess = async () => {
            const params = new URLSearchParams(window.location.search);
            const tokenFromUrl = params.get("token");
            const id = params.get("id");

            // If token already stored, go to candidate dashboard
            const existingToken = localStorage.getItem("candidateToken");
            if (existingToken) {
                nav("/candidate-dashboard");
                return;
            }

            console.log("Candidate Google login success:", tokenFromUrl, id);

            if (!tokenFromUrl || !id) {
                setError("Missing token or id");
                setTimeout(() => nav("/candidate-auth"), 2000);
                return;
            }

            try {
                // Store token first
                localStorage.setItem("candidateToken", tokenFromUrl);
                localStorage.setItem("candidateId", id);
                localStorage.setItem("token", tokenFromUrl);
                localStorage.setItem("id", id);
                localStorage.setItem("loginTimestamp", Date.now().toString());

                // Call GET API using id to fetch candidate data
                const res = await axios.get(`${Config.BACKEND_URL}/candidate/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${tokenFromUrl}`,
                    },
                });

                // Store candidate data
                if (res.data) {
                    if (res.data.name) localStorage.setItem("name", res.data.name);
                    if (res.data.email) localStorage.setItem("email", res.data.email);
                    if (res.data.mobileNumber) localStorage.setItem("mobileNumber", res.data.mobileNumber);
                }

                // Redirect to candidate dashboard
                nav("/candidate-dashboard");
            } catch (err) {
                console.error("Error fetching candidate data:", err);
                setError("Failed to fetch candidate data");
                // Still redirect to dashboard even if API call fails
                setTimeout(() => nav("/candidate-dashboard"), 2000);
            } finally {
                setLoading(false);
            }
        };

        handleGoogleSuccess();
    }, [nav]);

    if (error) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                gap: 16
            }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>⚠️</div>
                <h2 style={{ 
                    margin: 0, 
                    fontSize: "1.25rem", 
                    color: "#ef4444", 
                    fontWeight: 600 
                }}>
                    {error}
                </h2>
                <p style={{ 
                    margin: 0, 
                    color: "#64748b", 
                    fontSize: "0.95rem" 
                }}>
                    Redirecting...
                </p>
            </div>
        );
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: 16
        }}>
            <div style={{
                width: "48px",
                height: "48px",
                border: "4px solid #e2e8f0",
                borderTopColor: "#4f46e5",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
            }}></div>
            <h2 style={{ 
                margin: 0, 
                fontSize: "1.25rem", 
                color: "#1e293b", 
                fontWeight: 600 
            }}>
                Signing you in...
            </h2>
            <p style={{ 
                margin: 0, 
                color: "#64748b", 
                fontSize: "0.95rem" 
            }}>
                Please wait while we complete your login.
            </p>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

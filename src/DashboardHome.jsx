import React, { useEffect, useState } from "react";
import axios from "axios";
import Config from "./config/config";

export default function DashboardHome() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch recruiter profile from backend
    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${Config.BACKEND_URL}/recruiter/get`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProfile(res.data); // expected RecruiterResponse
        } catch (err) {
            console.error("Failed to fetch profile:", err.response || err);
            alert("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div style={center}>
                <h2>Loading profile...</h2>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={center}>
                <h2>No profile data available</h2>
            </div>
        );
    }

    return (
        <div style={container}>
            <div style={card}>
                <h1>Hello {profile.name} 👋</h1>

                <div style={infoBox}>
                    <p><b>Email:</b> {profile.email}</p>
                    <p><b>Phone:</b> {profile.mobileNumber}</p>
                    <p><b>Company ID:</b> {profile.companyId}</p>
                    <p><b>Company Name:</b> {profile.companyName}</p>
                    <p><b>Recruiter ID:</b> {profile.id}</p>
                </div>

                <div style={overviewBox}>
                    <h3>Dashboard Overview</h3>
                    <p>Welcome to the HR panel. Here you can manage candidates, jobs, and your company profile.</p>
                </div>
            </div>
        </div>
    );
}

/* CONTAINER STYLES */
const container = {
    flex: 1,
    padding: 30,
    minHeight: "100%",
    background: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "hidden",
    boxSizing: "border-box"
};

/* CARD STYLES */
const card = {
    background: "white",
    borderRadius: 12,
    padding: 30,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 800,
    boxSizing: "border-box"
};

/* INFO BOX */
const infoBox = {
    marginTop: 20,
    lineHeight: "35px"
};

/* OVERVIEW BOX */
const overviewBox = {
    marginTop: 40
};

/* CENTER LOADING */
const center = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh"
};

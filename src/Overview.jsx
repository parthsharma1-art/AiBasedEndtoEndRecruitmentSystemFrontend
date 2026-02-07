import React, { useEffect, useState } from "react";
import CONFIG from "./config/config";

function Overview() {
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalCandidates: 0,
        totalResumes: 0,
        activeJobs: 0,
    });

    useEffect(() => {
        fetchOverview();
    }, []);

    const fetchOverview = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                CONFIG.BACKEND_URL + "/recruiter/overview",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                }
            );

            const data = await response.json();

            // Normalize null values to 0
            setStats({
                totalJobs: data.totalJobs ?? 0,
                totalCandidates: data.totalCandidates ?? 0,
                totalResumes: data.totalResumes ?? 0,
                activeJobs: data.activeJobs ?? 0,
            });
        } catch (err) {
            console.error("Overview error:", err);
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h2>HR Overview</h2>

            <div style={cardContainer}>
                <Card title="Total Jobs Posted" value={stats.totalJobs} />
                <Card title="Total Candidates" value={stats.totalCandidates} />
                <Card title="Total Resumes" value={stats.totalResumes} />
                <Card title="Active Jobs" value={stats.activeJobs} />
            </div>
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div style={card}>
            <h3>{title}</h3>
            <h1>{value}</h1>
        </div>
    );
}

const cardContainer = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "20px",
};

const card = {
    flex: "1",
    minWidth: "220px",
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
};

export default Overview;

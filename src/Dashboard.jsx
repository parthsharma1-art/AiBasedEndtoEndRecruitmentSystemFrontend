
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Candidates from "./Candidates";
import Company from "./Company";
import AllJobs from "./AllJobs";
import Jobs from "./CreateJobPosting";
import DashboardHome from "./DashboardHome";

export default function Dashboard() {
    const nav = useNavigate();

    // 🔐 Protect dashboard if token not present
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            nav("/");
        }
    }, [nav]);

    return (
        <div style={{ display: "flex" }}>
            {/* SIDEBAR */}
            <Sidebar />

            {/* RIGHT CONTENT */}
            <div style={content}>
                <Routes>
                    {/* Default dashboard page */}
                    <Route path="/" element={<DashboardHome />} />

                    {/* Other routes */}
                    <Route path="overview" element={<Overview />} />
                    <Route path="candidates" element={<Candidates />} />
                    <Route path="company" element={<Company />} />
                    <Route path="jobs" element={<AllJobs />} />
                    <Route path="jobs/create" element={<Jobs />} />
                </Routes>
            </div>
        </div>
    );
}

const content = {
    flex: 1,
    padding: 20,
    height: "100vh",
    overflowY: "auto",
    background: "#f1f5f9",
};

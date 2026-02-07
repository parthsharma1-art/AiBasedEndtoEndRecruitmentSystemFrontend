import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Candidates from "./Candidates";
import Company from "./Company";
import AllJobs from "./AllJobs";
import Jobs from "./CreateJobPosting";
import DashboardHome from "./DashboardHome";

export default function Dashboard() {
    return (
        <div style={{ display: "flex" }}>
            {/* FIXED SIDEBAR */}
            <Sidebar />

            {/* RIGHT CONTENT SCROLLABLE */}
            <div style={content}>
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
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

/* Right content */
const content = {
    flex: 1,                  // takes remaining width
    padding: 20,
    height: "100vh",
    overflowY: "auto",
    background: "#f1f5f9"
};

import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./styles/dashboard.css";
import HRTopNav from "./components/hr/HRTopNav";
import HRSidebar from "./components/hr/HRSidebar";
import HRDashboardHome from "./components/hr/HRDashboardHome";
import Overview from "./Overview";
import Candidates from "./Candidates";
import Company from "./Company";
import CreateJobPosting from "./CreateJobPosting";
import JobCandidates from "./components/hr/JobCandidates";
import CandidateEvaluation from "./components/hr/CandidateEvaluation";
import HRAnalytics from "./components/hr/HRAnalytics";
import HRReports from "./components/hr/HRReports";
import DashboardHome from "./DashboardHome";
import AllJobs from "./AllJobs";

export default function Dashboard() {
    const nav = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) nav("/");
    }, [nav]);

    return (
        <div className="dashboard-layout" style={{ flexDirection: "column" }}>
            <HRTopNav />
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <HRSidebar />
                <div style={{ flex: 1, overflow: "auto" }}>
                    <Routes>
                        <Route path="/" element={<HRDashboardHome />} />
                        <Route path="profile" element={<DashboardHome />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="candidates" element={<Candidates />} />
                        <Route path="candidates/evaluate/:id" element={<CandidateEvaluation />} />
                        <Route path="company" element={<Company />} />
                        <Route path="jobs" element={<AllJobs />} />
                        <Route path="jobs/create" element={<CreateJobPosting />} />
                        <Route path="jobs/:jobId/candidates" element={<JobCandidates />} />
                        <Route path="ai-analytics" element={<HRAnalytics />} />
                        <Route path="reports" element={<HRReports />} />
                        <Route path="settings" element={<Company />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

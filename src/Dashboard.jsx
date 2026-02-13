import React, { useEffect, useState } from "react";
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

// Hook for responsive design
function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}

export default function Dashboard() {
    const nav = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) nav("/");
    }, [nav]);

    return (
        <div className="dashboard-layout" style={{ flexDirection: "column" }}>
            <HRTopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
                <div style={{
                    position: isMobile ? "fixed" : "relative",
                    zIndex: isMobile ? 1000 : 1,
                    transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
                    transition: "transform 0.3s ease-in-out",
                    height: isMobile ? "100vh" : "auto"
                }}>
                    <HRSidebar onClose={() => setSidebarOpen(false)} />
                </div>
                {isMobile && sidebarOpen && (
                    <div 
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0,0,0,0.5)",
                            zIndex: 999,
                            cursor: "pointer"
                        }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                <div style={{ flex: 1, overflow: "auto", width: isMobile && sidebarOpen ? 0 : "auto" }}>
                    <Routes>
                        <Route path="/" element={<HRDashboardHome />} />
                        <Route path="profile" element={<DashboardHome />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="candidates" element={<Candidates />} />
                        <Route path="candidates/evaluate/:id" element={<CandidateEvaluation />} />
                        <Route path="company" element={<Company />} />
                        <Route path="jobs/create" element={<CreateJobPosting />} />
                        <Route path="jobs/:jobId/candidates" element={<JobCandidates />} />
                        <Route path="jobs" element={<AllJobs />} />
                        <Route path="ai-analytics" element={<HRAnalytics />} />
                        <Route path="reports" element={<HRReports />} />
                        <Route path="settings" element={<Company />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

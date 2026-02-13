import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import CandidateTopNav from "./CandidateTopNav";
import CandidateSidebar from "./CandidateSidebar";
import CandidateDashboardHome from "./CandidateDashboardHome";
import CandidateUploadResume from "./CandidateUploadResume";
import CandidateJobMatching from "./CandidateJobMatching";
import CandidateAssessment from "./CandidateAssessment";
import CandidateAIInterview from "./CandidateAIInterview";
import CandidateResults from "./CandidateResults";
import CandidateProfile from "./CandidateProfile";
import CandidateLandingPage from "../../CandidateLandingPage";

export default function CandidateDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/candidate-auth");
  }, [navigate]);

  return (
    <div className="dashboard-layout" style={{ flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <CandidateTopNav />
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        <CandidateSidebar />
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0 }}>
          <Routes>
            <Route path="/" element={<CandidateDashboardHome />} />
            <Route path="resume" element={<CandidateUploadResume />} />
            <Route path="jobs" element={<CandidateJobMatching />} />
            <Route path="assessment" element={<CandidateAssessment />} />
            <Route path="interview" element={<CandidateAIInterview />} />
            <Route path="results" element={<CandidateResults />} />
            <Route path="profile" element={<CandidateLandingPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

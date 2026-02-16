import React, { useEffect, useState } from "react";
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
import CandidateChatsView from "./CandidateChatsView";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hrId = localStorage.getItem("hrId");
    const candidateId = localStorage.getItem("candidateId");

    if (!token) {
      navigate("/candidate-auth");
      return;
    }
    if (hrId && !candidateId) {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  return (
    <div
      className="dashboard-layout candidate-dashboard-layout"
      style={{ flexDirection: "column", height: "100vh", overflow: "hidden" }}
    >
      <CandidateTopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          minHeight: 0,
          position: "relative",
        }}
      >
        <div
          className="candidate-sidebar-wrapper"
          style={{
            position: isMobile ? "fixed" : "relative",
            zIndex: isMobile ? 1000 : 1,
            transform:
              isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 0.3s ease-in-out",
            height: isMobile ? "100vh" : "100%",
            top: 0,
            left: 0,
          }}
        >
          <CandidateSidebar onClose={() => setSidebarOpen(false)} />
        </div>
        {isMobile && sidebarOpen && (
          <div
            className="candidate-sidebar-overlay"
            role="presentation"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 999,
              cursor: "pointer",
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            width: isMobile && sidebarOpen ? 0 : "auto",
            minWidth: 0,
          }}
        >
          <Routes>
            <Route path="/" element={<CandidateDashboardHome />} />
            <Route path="resume" element={<CandidateUploadResume />} />
            <Route path="jobs" element={<CandidateJobMatching />} />
            <Route path="chats" element={<CandidateChatsView />} />
            <Route path="chats/:chatId" element={<CandidateChatsView />} />
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

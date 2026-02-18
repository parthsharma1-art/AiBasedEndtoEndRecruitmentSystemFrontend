import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/dashboard.css";
import CONFIG from "../../config/config";
import { setCandidateChatsCache } from "../../utils/chatsCache";
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
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isOnChatsPage = location.pathname.includes("/chats");

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

  // When NOT on chats tab: poll chats API every 30s (when on tab, CandidateChatsView polls every 3s)
  useEffect(() => {
    if (isOnChatsPage) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchSilent = async () => {
      try {
        const res = await axios.get(CONFIG.BACKEND_URL + "/candidate/chats", {
          headers: { Authorization: "Bearer " + token },
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setCandidateChatsCache(data);
      } catch (_) {}
    };
    fetchSilent();
    const interval = setInterval(fetchSilent, 30000);
    return () => clearInterval(interval);
  }, [isOnChatsPage]);

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

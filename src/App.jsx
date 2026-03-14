import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoadingScreen from "./components/LoadingScreen";
import HomePage from "./HomePage";
import RecruiterAuthPage from "./RecruiterAuthPage";
import CandidateAuthPage from "./CandidateAuthPage";
import CandidateLandingPage from "./CandidateLandingPage";
import Dashboard from "./Dashboard";
import BrowseJobs from "./BrowseJobs";
import PricingPage from "./PricingPage";
import AboutUsPage from "./AboutUsPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import Companies from "./Companies";
import CompanyPublicPage from "./CompanyPublicPage";
import CompanyJobsPage from "./CompanyJobsPage";
import CompanyProfile from "./CompanyProfile";
import GoogleSuccess from "./GoogleSuccess";
import CandidateGoogleSuccess from "./CandidateGoogleSuccess";
import CandidateDashboard from "./components/candidate/CandidateDashboard";
import AllJobs from "./AllJobs";
import CandidateAppliedJobs from "./components/candidate/CandidateAppliedJobs";
import CandidateListAppliedJobs from "./components/hr/CandidatesListAppliedJobs";
import Toast from "./components/Toast";

const MIN_LOADING_MS = 5000;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const start = Date.now();
    let timeoutId = null;

    const finishLoading = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
      timeoutId = setTimeout(() => setIsLoading(false), remaining);
    };

    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading);
    }

    return () => {
      window.removeEventListener("load", finishLoading);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
    <Toast />
    <Routes>

      <Route path="/" element={<HomePage />} />
      <Route path="/recruiter-auth" element={<RecruiterAuthPage />} />
      <Route path="/candidate-auth" element={<CandidateAuthPage />} />
      <Route path="/candidate-landing" element={<Navigate to="/candidate-dashboard" replace />} />
      <Route path="/candidate-dashboard/*" element={<CandidateDashboard />} />
      <Route path="/browse-jobs" element={<BrowseJobs />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/google-success" element={<GoogleSuccess />} />
      <Route path="/candidate/google-success" element={<CandidateGoogleSuccess />} />
      <Route path="/dashboard/jobs" element={<AllJobs />} />


      {/* DASHBOARD */}
      <Route
        path="/dashboard/*"
        element={
          // <AuthCheck>
          <Dashboard />
          // </AuthCheck>
        }
      />
      <Route path="dashboard/jobs/:jobId/applications" element={<CandidateListAppliedJobs />} />
      {/* company pages */}
      <Route path="/:companySlug/jobs" element={<CompanyJobsPage />} />
      <Route path="/:companySlug" element={<CompanyPublicPage />} />
      <Route path="/companies/:subdomain" element={<CompanyProfile />} />

    </Routes>
    </>
  );
}

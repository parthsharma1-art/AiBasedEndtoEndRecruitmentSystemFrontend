// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import HomePage from "./HomePage";
// import RecruiterAuthPage from "./RecruiterAuthPage";
// import CandidateAuthPage from "./CandidateAuthPage";
// import CandidateLandingPage from "./CandidateLandingPage";
// import Dashboard from "./Dashboard";
// import BrowseJobs from "./BrowseJobs";
// import PricingPage from "./PricingPage";
// import Companies from "./Companies";
// import CompanyPublicPage from "./CompanyPublicPage";
// import CompanyJobsPage from "./CompanyJobsPage";
// import CompanyProfile from "./CompanyProfile";
// import GoogleSuccess from "./GoogleSuccess";
// import CandidateGoogleSuccess from "./CandidateGoogleSuccess";
// import CandidateDashboard from "./components/candidate/CandidateDashboard";
// import AllJobs from "./AllJobs";

// export default function App() {
//   return (
//     <Routes>

//       <Route path="/" element={<HomePage />} />
//       <Route path="/recruiter-auth" element={<RecruiterAuthPage />} />
//       <Route path="/candidate-auth" element={<CandidateAuthPage />} />
//       <Route path="/candidate-landing" element={<Navigate to="/candidate-dashboard" replace />} />
//       <Route path="/candidate-dashboard/*" element={<CandidateDashboard />} />
//       <Route path="/browse-jobs" element={<BrowseJobs />} />
//       <Route path="/companies" element={<Companies />} />
//       <Route path="/pricing" element={<PricingPage />} />
//       <Route path="/google-success" element={<GoogleSuccess />} />
//       <Route path="/candidate/google-success" element={<CandidateGoogleSuccess />} />
//       <Route path="/dashboard/jobs" element={<AllJobs />} />

//       {/* DASHBOARD */}
//       <Route
//         path="/dashboard/*"
//         element={
//           // <AuthCheck>
//           <Dashboard />
//           // </AuthCheck>
//         }
//       />

//       {/* company pages */}
//       <Route path="/:companySlug/jobs" element={<CompanyJobsPage />} />
//       <Route path="/:companySlug" element={<CompanyPublicPage />} />
//       <Route path="/companies/:subdomain" element={<CompanyProfile />} />

//     </Routes>
//   );
// }





import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./HomePage";
import RecruiterAuthPage from "./RecruiterAuthPage";
import CandidateAuthPage from "./CandidateAuthPage";
import CandidateLandingPage from "./CandidateLandingPage";
import Dashboard from "./Dashboard";
import BrowseJobs from "./BrowseJobs";
import PricingPage from "./PricingPage";
import Companies from "./Companies";
import CompanyPublicPage from "./CompanyPublicPage";
import CompanyJobsPage from "./CompanyJobsPage";
import CompanyProfile from "./CompanyProfile";
import GoogleSuccess from "./GoogleSuccess";
import CandidateGoogleSuccess from "./CandidateGoogleSuccess";
import CandidateDashboard from "./components/candidate/CandidateDashboard";
import AllJobs from "./AllJobs";

/* Applied Candidates Page */
import AppliedCandidates from "./components/hr/AppliedCandidates";

export default function App() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Auth */}
      <Route path="/recruiter-auth" element={<RecruiterAuthPage />} />
      <Route path="/candidate-auth" element={<CandidateAuthPage />} />

      {/* Candidate */}
      <Route
        path="/candidate-landing"
        element={<Navigate to="/candidate-dashboard" replace />}
      />
      <Route path="/candidate-dashboard/*" element={<CandidateDashboard />} />

      {/* Public Pages */}
      <Route path="/browse-jobs" element={<BrowseJobs />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/pricing" element={<PricingPage />} />

      {/* Google Login */}
      <Route path="/google-success" element={<GoogleSuccess />} />
      <Route
        path="/candidate/google-success"
        element={<CandidateGoogleSuccess />}
      />

      {/* Recruiter Jobs */}
      <Route path="/dashboard/jobs" element={<AllJobs />} />

      {/* Applied Candidates */}
      <Route
        path="/dashboard/jobs/:jobId/applications"
        element={<AppliedCandidates />}
      />

      {/* Dashboard (keep this last) */}
      <Route path="/dashboard/*" element={<Dashboard />} />

      {/* Company Pages */}
      <Route path="/:companySlug/jobs" element={<CompanyJobsPage />} />
      <Route path="/:companySlug" element={<CompanyPublicPage />} />
      <Route path="/companies/:subdomain" element={<CompanyProfile />} />

    </Routes>
  );
}
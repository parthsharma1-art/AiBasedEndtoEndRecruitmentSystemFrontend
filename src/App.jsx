import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import RecruiterAuthPage from "./RecruiterAuthPage";
import CandidateAuthPage from "./CandidateAuthPage";
import CandidateLandingPage from "./CandidateLandingPage";
import Dashboard from "./Dashboard";
import AuthCheck from "./AuthCheck";
import BrowseJobs from "./BrowseJobs";
import PricingPage from "./PricingPage";
import Companies from "./Companies";
import CompanyPublicPage from "./CompanyPublicPage";
import CompanyJobsPage from "./CompanyJobsPage";
import CompanyProfile from "./CompanyProfile";

export default function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Auth */}
      <Route path="/recruiter-auth" element={<RecruiterAuthPage />} />
      <Route path="/candidate-auth" element={<CandidateAuthPage />} />

      {/* Candidate */}
      <Route path="/candidate-landing" element={<CandidateLandingPage />} />

      {/* Browse jobs */}
      <Route path="/browse-jobs" element={<BrowseJobs />} />

      {/* Companies list */}
      <Route path="/companies" element={<Companies />} />

      {/* Pricing */}
      <Route path="/pricing" element={<PricingPage />} />

      {/* Dashboard (Protected) */}
      <Route
        path="/dashboard/*"
        element={
          <AuthCheck>
            <Dashboard />
          </AuthCheck>
        }
      />

      {/* 🔥 Company Jobs Page (IMPORTANT: before public page) */}
      <Route path="/:companySlug/jobs" element={<CompanyJobsPage />} />

      {/* 🔥 Company Public Page (ALWAYS LAST) */}
      <Route path="/:companySlug" element={<CompanyPublicPage />} />

      {/* Company Profile */}
      <Route path="/companies/:subdomain" element={<CompanyProfile />} />
    </Routes>
  );
}


// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import HomePage from "./HomePage";
// import RecruiterAuthPage from "./RecruiterAuthPage";
// import CandidateAuthPage from "./CandidateAuthPage";
// import CandidateLandingPage from "./CandidateLandingPage";
// import Dashboard from "./Dashboard";
// import AuthCheck from "./AuthCheck";
// import BrowseJobs from "./BrowseJobs";
// import PricingPage from "./PricingPage";
// import Companies from "./Companies";
// import CompanyPublicPage from "./CompanyPublicPage";
// import CompanyJobsPage from "./CompanyJobsPage";
// import CompanyProfile from "./CompanyProfile";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Home */}
//         <Route path="/" element={<HomePage />} />

//         {/* Auth */}
//         <Route path="/recruiter-auth" element={<RecruiterAuthPage />} />
//         <Route path="/candidate-auth" element={<CandidateAuthPage />} />

//         {/* Candidate */}
//         <Route path="/candidate-landing" element={<CandidateLandingPage />} />

//         {/* Browse jobs */}
//         <Route path="/browse-jobs" element={<BrowseJobs />} />

//         {/* Companies list */}
//         <Route path="/companies" element={<Companies />} />

//         {/* Specific company public profile */}
//         <Route path="/companies/:subdomain" element={<CompanyProfile />} />

//         {/* Pricing */}
//         <Route path="/pricing" element={<PricingPage />} />

//         {/* Dashboard (Protected) */}
//         <Route
//           path="/dashboard/*"
//           element={
//             <AuthCheck>
//               <Dashboard />
//             </AuthCheck>
//           }
//         />

//         {/* Company Jobs Page */}
//         <Route path="/:companySlug/jobs" element={<CompanyJobsPage />} />

//         {/* Company Public Page (ALWAYS LAST) */}
//         <Route path="/:companySlug" element={<CompanyPublicPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

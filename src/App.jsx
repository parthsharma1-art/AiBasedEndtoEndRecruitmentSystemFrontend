// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HomePage from "./HomePage";
// import RecruiterAuthPage from "./RecruiterAuthPage";
// import Dashboard from "./Dashboard";
// import CandidateAuthPage from "./CandidateAuthPage";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/recruiter-auth" element={<RecruiterAuthPage />} />
//         <Route path="/candidate-auth" element={<CandidateAuthPage />} />
//         <Route path="/dashboard" element={<Dashboard />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }


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


// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Home */}
//         <Route path="/" element={<HomePage />} />

//         {/* Auth */}
//         <Route path="/recruiter-auth" element={<RecruiterAuthPage />} />
//         <Route path="/candidate-auth" element={<CandidateAuthPage />} />

//         {/* Dashboard (all dashboard pages inside this) */}
//         {/* <Route path="/dashboard/*" element={<Dashboard />} /> */}
//         <Route
//           path="/dashboard/*"
//           element={
//             <AuthCheck>
//               <Dashboard />
//             </AuthCheck>
//           }
//         />

//         {/* Candidate */}
//         <Route path="/candidate-landing" element={<CandidateLandingPage />} />


//         {/* Browse jobs */}
//         <Route path="/browse-jobs" element={<BrowseJobs />} />

//         <Route path="/pricing" element={<PricingPage />} />



//       </Routes>
//     </BrowserRouter>
//   );
// }



// import React from "react";
// import { Routes, Route } from "react-router-dom";

// import HomePage from "./HomePage";
// import RecruiterAuthPage from "./RecruiterAuthPage";
// import CandidateAuthPage from "./CandidateAuthPage";
// import CandidateLandingPage from "./CandidateLandingPage";
// import Dashboard from "./Dashboard";
// import AuthCheck from "./AuthCheck";
// import BrowseJobs from "./BrowseJobs";
// import PricingPage from "./PricingPage";
// import CompanyPublicPage from "./CompanyPublicPage";

// export default function App() {
//   return (
//     <Routes>
//       {/* Home */}
//       <Route path="/" element={<HomePage />} />

//       {/* Auth */}
//       <Route path="/recruiter-auth" element={<RecruiterAuthPage />} />
//       <Route path="/candidate-auth" element={<CandidateAuthPage />} />

//       {/* Dashboard */}
//       <Route
//         path="/dashboard/*"
//         element={
//           <AuthCheck>
//             <Dashboard />
//           </AuthCheck>
//         }
//       />

//       {/* Candidate */}
//       <Route path="/candidate-landing" element={<CandidateLandingPage />} />

//       {/* Browse jobs */}
//       <Route path="/browse-jobs" element={<BrowseJobs />} />

//       {/* Pricing */}
//       <Route path="/pricing" element={<PricingPage />} />

//       {/* 🔥 Company Public Page (KEEP LAST) */}
//       <Route path="/:companySlug" element={<CompanyPublicPage />} />
//     </Routes>
//   );
// }

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

import CompanyPublicPage from "./CompanyPublicPage";
import CompanyJobsPage from "./CompanyJobsPage";

export default function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Auth */}
      <Route path="/recruiter-auth" element={<RecruiterAuthPage />} />
      <Route path="/candidate-auth" element={<CandidateAuthPage />} />

      {/* Dashboard */}
      <Route
        path="/dashboard/*"
        element={
          <AuthCheck>
            <Dashboard />
          </AuthCheck>
        }
      />

      {/* Candidate */}
      <Route path="/candidate-landing" element={<CandidateLandingPage />} />

      {/* Browse jobs */}
      <Route path="/browse-jobs" element={<BrowseJobs />} />

      {/* Pricing */}
      <Route path="/pricing" element={<PricingPage />} />

      {/* 🔥 Company Jobs Page */}
      <Route path="/:companySlug/jobs" element={<CompanyJobsPage />} />

      {/* 🔥 Company Public Page (KEEP LAST) */}
      <Route path="/:companySlug" element={<CompanyPublicPage />} />
    </Routes>
  );
}

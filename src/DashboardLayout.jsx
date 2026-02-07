import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import Candidates from "./Candidates";
import Company from "./Company";
import Jobs from "./Jobs"; // create Jobs page for job posting/listing

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="company" element={<Company />} />
          <Route path="jobs" element={<Jobs />} />
        </Routes>
      </div>
    </div>
  );
}

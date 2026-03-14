import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContactModal from "./components/ContactModal";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <header style={header}>
        <h1
          style={{
            ...logo,
            cursor: "pointer",
            userSelect: "none",
            transition: "opacity 0.2s",
          }}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          AI Recruitment
        </h1>
        <nav style={nav}>
          <button onClick={() => navigate("/recruiter-auth")} style={linkStyle}>
            For Recruiters
          </button>
          <button onClick={() => navigate("/candidate-auth")} style={linkStyle}>
            For Candidates
          </button>
          <button onClick={() => navigate("/pricing")} style={linkStyle}>
            Pricing
          </button>
          <button onClick={() => navigate("/about")} style={linkStyle}>
            About Us
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section style={hero}>
        <h2 style={heroTitle}>Privacy Policy</h2>
        <p style={heroSubtitle}>
          Last updated: 2026. How we collect, use, and protect your information on the AI Recruitment Platform.
        </p>
      </section>

      {/* CONTENT */}
      <section style={section}>
        <h3 style={sectionTitle}>1. Introduction</h3>
        <p style={sectionText}>
          This Privacy Policy describes how <strong>AI Based End to End Recruitment System</strong> (“we”, “our”, or “the Platform”) handles your personal information. Our platform is built for <strong>recruiters</strong> and <strong>candidates</strong>. Recruiters use it to post jobs, screen and evaluate candidates, and manage hiring. Candidates use it to browse jobs, apply, upload resumes, take assessments and AI interviews, and communicate with recruiters. By using the Platform, you agree to this policy.
        </p>
      </section>

      <section style={section}>
        <h3 style={sectionTitle}>2. Who This Platform Is For</h3>
        <p style={sectionText}>
          We implement this product for two main user types:
        </p>
        <ul style={list}>
          <li><strong>Recruiters / Companies</strong> — To post jobs, manage company profiles, view applications, evaluate candidates, use AI analytics and reports, and communicate with candidates (including via in-platform messaging).</li>
          <li><strong>Candidates</strong> — To search and browse jobs, apply to positions, upload resumes, get job recommendations, complete assessments and AI interviews, and <strong>message recruiters directly</strong> through the Platform (e.g. chat with recruiters about applications and roles).</li>
        </ul>
        <p style={sectionText}>
          Features such as <strong>direct messaging between candidates and recruiters</strong> are part of the service so that communication stays within the Platform and is tied to applications and hiring.
        </p>
      </section>

      <section style={section}>
        <h3 style={sectionTitle}>3. Information We Collect</h3>
        <p style={sectionText}>
          We may collect:
        </p>
        <ul style={list}>
          <li><strong>Account and profile data</strong> — Name, email, phone, company details (recruiters), resume, skills, work history (candidates).</li>
          <li><strong>Application and hiring data</strong> — Job applications, assessments, interview responses, and related communications.</li>
          <li><strong>Messages</strong> — Content of chats and messages between candidates and recruiters on the Platform.</li>
          <li><strong>Usage data</strong> — How you use the site (e.g. pages visited, actions taken) to improve the service and security.</li>
          <li><strong>Technical data</strong> — IP address, device type, browser, and similar technical information.</li>
        </ul>
      </section>

      <section style={section}>
        <h3 style={sectionTitle}>4. How We Use Your Information</h3>
        <p style={sectionText}>
          We use the information we collect to:
        </p>
        <ul style={list}>
          <li>Provide and operate the recruitment platform (job postings, applications, matching, assessments, AI interviews).</li>
          <li>Enable <strong>direct communication between candidates and recruiters</strong> (e.g. in-app chat and messaging).</li>
          <li>Improve AI matching, screening, and analytics for recruiters and candidates.</li>
          <li>Send service-related notifications (e.g. application updates, messages).</li>
          <li>Ensure security, prevent fraud, and comply with legal obligations.</li>
        </ul>
      </section>

      <section style={section}>
        <h3 style={sectionTitle}>5. Sharing of Information</h3>
        <p style={sectionText}>
          We may share information:
        </p>
        <ul style={list}>
          <li><strong>Between recruiters and candidates</strong> — As needed for the service (e.g. recruiters see candidate profiles and applications; candidates’ messages to recruiters are visible to those recruiters).</li>
          <li><strong>With service providers</strong> — Who help us run the Platform (hosting, analytics, etc.), under strict confidentiality.</li>
          <li><strong>When required by law</strong> — To comply with legal process or protect rights and safety.</li>
        </ul>
      </section>

      <section style={section}>
        <h3 style={sectionTitle}>6. Data Security</h3>
        <p style={sectionText}>
          We use technical and organizational measures to protect your data. In particular:
        </p>
        <ul style={list}>
          <li><strong>Passwords</strong> — We do not store your password in plain text. Passwords are stored in our database using <strong>hashing</strong> (one-way cryptographic hashing). This means we cannot see or recover your actual password; we only verify it when you log in.</li>
          <li><strong>Chats and messages</strong> — Chat content between candidates and recruiters is <strong>encrypted first, then stored</strong>. We encrypt message data before saving it to our systems so that it is protected at rest.</li>
          <li><strong>Other measures</strong> — We also use access controls, secure connections (e.g. HTTPS), and other safeguards where appropriate.</li>
        </ul>
        <p style={sectionText}>
          No system is completely secure. We encourage you to use a strong, unique password and to keep your account details safe.
        </p>
      </section>

      <section style={section}>
        <h3 style={sectionTitle}>7. Your Rights</h3>
        <p style={sectionText}>
          Depending on applicable law, you may have the right to access, correct, or delete your personal data, or to object to or restrict certain processing. To exercise these rights or ask questions about your data, contact us using the details below.
        </p>
      </section>

      <section style={section}>
        <h3 style={sectionTitle}>8. Contact</h3>
        <p style={sectionText}>
          For privacy-related questions or requests, contact us at the email or address provided on the Platform (e.g. on the Contact or About Us page). We will respond in accordance with applicable law.
        </p>
      </section>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          AI Recruitment Platform
        </div>
        <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 15 }}>
          © 2026 AI Recruitment Platform. All rights reserved.
        </div>
        <div style={footerLinksWrap}>
          <span style={footerLink} onClick={() => navigate("/about")}>About Us</span>
          <span style={footerLink} onClick={() => setContactOpen(true)}>Contact</span>
          <span style={footerLink} onClick={() => navigate("/privacy-policy")}>Privacy Policy</span>
          <span style={footerLink}>Terms of Service</span>
        </div>
      </footer>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

/* ================= STYLES ================= */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 20px",
  background: "#f5f5f5",
  flexWrap: "wrap",
};

const logo = {
  fontSize: 24,
  color: "#4f46e5",
  marginBottom: 8,
};

const nav = {
  display: "flex",
  gap: 15,
  flexWrap: "wrap",
};

const linkStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  color: "#4f46e5",
};

const hero = {
  textAlign: "center",
  padding: "40px 20px 32px",
  background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)",
};

const heroTitle = {
  fontSize: "clamp(26px, 5vw, 36px)",
  marginBottom: 12,
  color: "#1e293b",
};

const heroSubtitle = {
  fontSize: "clamp(14px, 2.5vw, 16px)",
  color: "#64748b",
  maxWidth: 560,
  margin: "0 auto",
};

const section = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "24px 20px",
};

const sectionTitle = {
  fontSize: "clamp(17px, 3vw, 20px)",
  color: "#4f46e5",
  marginBottom: 12,
  fontWeight: 700,
};

const sectionText = {
  fontSize: 15,
  lineHeight: 1.65,
  color: "#334155",
  marginBottom: 12,
};

const list = {
  margin: "0 0 12px",
  paddingLeft: 22,
  fontSize: 15,
  lineHeight: 1.7,
  color: "#475569",
};

const footerStyle = {
  background: "#111",
  color: "white",
  padding: "40px 20px",
  textAlign: "center",
  marginTop: "auto",
};

const footerLinksWrap = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  flexWrap: "wrap",
};

const footerLink = {
  cursor: "pointer",
  fontSize: 14,
  opacity: 0.9,
};

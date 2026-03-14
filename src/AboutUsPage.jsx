import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContactModal from "./components/ContactModal";

export default function AboutUsPage() {
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="page-about" style={{ fontFamily: "Arial", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* HEADER - same as HomePage */}
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
          <button onClick={() => navigate("/browse-jobs")} style={linkStyle}>
            Browse Jobs
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section style={hero}>
        <h2 style={heroTitle}>About Us</h2>
        <p style={heroSubtitle}>
          We power hiring from first touch to final offer with one AI-based platform.
        </p>
      </section>

      {/* WHAT WE DO */}
      <section style={section}>
        <h3 className="section-title" style={sectionTitle}>What We Do</h3>
        <p style={sectionText}>
          <strong>AI Based End to End Recruitment System</strong> is a single platform that connects companies and job seekers. We use AI to screen resumes, match candidates to jobs, run assessments and AI interviews, and give recruiters analytics—so hiring is faster, fairer, and easier for everyone.
        </p>
      </section>

      {/* FOR RECRUITERS */}
      <section style={section}>
        <h3 className="section-title" style={sectionTitle}>For Recruiters & Companies</h3>
        <p style={sectionText}>
          Post jobs, manage your company profile, and get a full hiring toolkit in one place:
        </p>
        <ul style={featureList}>
          <li><strong>Job postings</strong> — Create and manage job listings and see all applications in one dashboard.</li>
          <li><strong>AI screening & matching</strong> — Automatically shortlist and rank candidates that fit your roles.</li>
          <li><strong>Candidate evaluation</strong> — Review profiles, resumes, and AI-generated insights before interviews.</li>
          <li><strong>Chat</strong> — Message and coordinate with candidates directly inside the platform.</li>
          <li><strong>AI analytics & reports</strong> — Track pipeline, time-to-hire, and recruitment metrics.</li>
          <li><strong>Company pages</strong> — Public company profile and job pages to attract talent.</li>
        </ul>
      </section>

      {/* FOR CANDIDATES */}
      <section style={section}>
        <h3 className="section-title" style={sectionTitle}>For Candidates</h3>
        <p style={sectionText}>
          Find the right role and stand out with AI-backed tools:
        </p>
        <ul style={featureList}>
          <li><strong>Browse jobs & companies</strong> — Search openings and explore employer profiles.</li>
          <li><strong>Resume upload & job matching</strong> — Upload your resume and get AI-matched job recommendations.</li>
          <li><strong>Apply & track</strong> — Apply in one click and track all your applications in one place.</li>
          <li><strong>Assessments & AI interview</strong> — Complete assessments and AI-driven interviews when employers use them.</li>
          <li><strong>Chat with recruiters</strong> — Communicate with hiring teams without leaving the platform.</li>
          <li><strong>Results & profile</strong> — View outcomes and manage your candidate profile.</li>
        </ul>
      </section>

      {/* WHY CHOOSE US */}
      <section style={section}>
        <h3 className="section-title" style={sectionTitle}>Why Choose Our Platform</h3>
        <div className="card-wrap" style={cardWrap}>
          <div style={card}>
            <div style={cardLabel}>End-to-end</div>
            <p style={cardText}>From job posting and applications to screening, interviews, and analytics—all in one product.</p>
          </div>
          <div style={card}>
            <div style={cardLabel}>AI-powered</div>
            <p style={cardText}>Smarter matching, screening, and insights so you spend less time on manual steps.</p>
          </div>
          <div style={card}>
            <div style={cardLabel}>For both sides</div>
            <p style={cardText}>Built for recruiters and candidates so everyone gets a better hiring experience.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={ctaSection}>
        <p style={ctaText}>Ready to get started?</p>
        <div className="cta-btn-wrap" style={ctaBtnWrap}>
          <button onClick={() => navigate("/recruiter-auth")} style={btnBlue}>
            For Recruiters
          </button>
          <button onClick={() => navigate("/candidate-auth")} style={btnGreen}>
            For Candidates
          </button>
          <button onClick={() => navigate("/browse-jobs")} style={btnOutline}>
            Browse Jobs
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          AI Recruitment Platform
        </div>
        <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 15 }}>
          © 2026 AI Recruitment Platform. All rights reserved.
        </div>
        <div className="footer-links-wrap" style={footerLinksWrap}>
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
  padding: "50px 20px 40px",
  background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)",
};

const heroTitle = {
  fontSize: "clamp(26px, 5vw, 38px)",
  marginBottom: 12,
  color: "#1e293b",
};

const heroSubtitle = {
  fontSize: "clamp(15px, 2.5vw, 18px)",
  color: "#64748b",
  maxWidth: 560,
  margin: "0 auto",
};

const section = {
  maxWidth: 800,
  margin: "0 auto",
  padding: "32px 20px",
};

const sectionTitle = {
  fontSize: "clamp(18px, 3vw, 22px)",
  color: "#4f46e5",
  marginBottom: 16,
  fontWeight: 700,
};

const sectionText = {
  fontSize: 16,
  lineHeight: 1.65,
  color: "#334155",
  marginBottom: 16,
};

const featureList = {
  margin: 0,
  paddingLeft: 22,
  fontSize: 15,
  lineHeight: 1.8,
  color: "#475569",
};

const cardWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: 20,
  justifyContent: "center",
};

const card = {
  flex: "1 1 200px",
  maxWidth: 280,
  padding: 24,
  background: "#f8fafc",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
};

const cardLabel = {
  fontSize: 14,
  fontWeight: 700,
  color: "#4f46e5",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 10,
};

const cardText = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#475569",
  margin: 0,
};

const ctaSection = {
  textAlign: "center",
  padding: "48px 20px 56px",
  background: "#f1f5f9",
};

const ctaText = {
  fontSize: 18,
  fontWeight: 600,
  color: "#334155",
  marginBottom: 20,
};

const ctaBtnWrap = {
  display: "flex",
  justifyContent: "center",
  gap: 12,
  flexWrap: "wrap",
};

const btnBlue = {
  padding: "12px 24px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 16,
};

const btnGreen = {
  padding: "12px 24px",
  background: "#10b981",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 16,
};

const btnOutline = {
  padding: "12px 24px",
  background: "transparent",
  color: "#4f46e5",
  border: "2px solid #4f46e5",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 16,
};

const footerStyle = {
  background: "#111",
  color: "white",
  padding: "50px 20px",
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

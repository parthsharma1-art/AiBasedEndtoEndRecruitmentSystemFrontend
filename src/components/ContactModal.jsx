import React, { useState } from "react";
import axios from "axios";
import CONFIG from "../config/config";

const CONTACT_TYPE_OPTIONS = [
  { value: "", label: "What do you want to become?" },
  { value: "recruiter", label: "Recruiter" },
  { value: "candidate", label: "Candidate" },
  { value: "general", label: "General Inquiry" },
];

export default function ContactModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!type) {
      setError("Please select what you want to become.");
      return;
    }
    if (!message.trim()) {
      setError("Please enter your message.");
      return;
    }
    setSending(true);
    try {
      await axios.post(CONFIG.BACKEND_URL + "/public/contact", {
        email: email.trim(),
        message: message.trim(),
        source: type,
      });
      setSent(true);
      setEmail("");
      setMessage("");
      setType("");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong.";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setSent(false);
      setError("");
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div style={overlay} onClick={handleClose}>
      <div style={modalWrap} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <h3 style={modalTitle}>Contact Us</h3>
          <button type="button" style={closeBtn} onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        {sent ? (
          <div style={successWrap}>
            <p style={successText}>Thank you! Your message has been sent. We'll get back to you soon.</p>
            <button type="button" style={submitBtn} onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={form}>
            <label style={label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={input}
              disabled={sending}
            />

            <label style={label}>What do you want to become?</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={select}
              disabled={sending}
            >
              {CONTACT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value || "default"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label style={label}>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows={4}
              style={textarea}
              disabled={sending}
            />

            {error && <p style={errorText}>{error}</p>}

            <div style={btnWrap}>
              <button type="button" style={cancelBtn} onClick={handleClose} disabled={sending}>
                Cancel
              </button>
              <button type="submit" style={submitBtn} disabled={sending}>
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10000,
  padding: 20,
};

const modalWrap = {
  background: "#fff",
  borderRadius: 12,
  maxWidth: 440,
  width: "100%",
  maxHeight: "90vh",
  overflow: "auto",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  borderBottom: "1px solid #e2e8f0",
};

const modalTitle = {
  margin: 0,
  fontSize: 20,
  fontWeight: 700,
  color: "#1e293b",
};

const closeBtn = {
  background: "none",
  border: "none",
  fontSize: 28,
  lineHeight: 1,
  color: "#64748b",
  cursor: "pointer",
  padding: "0 4px",
};

const form = {
  padding: 20,
};

const label = {
  display: "block",
  fontSize: 14,
  fontWeight: 600,
  color: "#334155",
  marginBottom: 6,
};

const input = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 16,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  marginBottom: 16,
  boxSizing: "border-box",
};

const select = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 16,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  marginBottom: 16,
  boxSizing: "border-box",
  background: "#fff",
};

const textarea = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 16,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  marginBottom: 16,
  boxSizing: "border-box",
  resize: "vertical",
  minHeight: 100,
};

const errorText = {
  color: "#dc2626",
  fontSize: 14,
  marginBottom: 12,
};

const btnWrap = {
  display: "flex",
  gap: 12,
  justifyContent: "flex-end",
  marginTop: 8,
};

const cancelBtn = {
  padding: "10px 18px",
  background: "#f1f5f9",
  color: "#475569",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 15,
};

const submitBtn = {
  padding: "10px 20px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 600,
};

const successWrap = {
  padding: 24,
  textAlign: "center",
};

const successText = {
  fontSize: 16,
  color: "#334155",
  marginBottom: 20,
  lineHeight: 1.5,
};

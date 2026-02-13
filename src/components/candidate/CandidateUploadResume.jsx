import React, { useState, useRef } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function CandidateUploadResume() {
  const [file, setFile] = useState(null);
  const [dragover, setDragover] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matchPreview, setMatchPreview] = useState(null);
  const inputRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    const f = e.dataTransfer?.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  const onSelect = (e) => {
    const f = e.target?.files?.[0];
    if (f) setFile(f);
  };

  const upload = async () => {
    if (!file) {
      alert("Select a PDF resume first.");
      return;
    }
    setLoading(true);
    setParsed(null);
    setMatchPreview(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(CONFIG.BACKEND_URL + "/candidate/resume/upload", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      setParsed(data.parsed || data);
      setMatchPreview(data.matchScore ?? data.matchPreview ?? null);
    } catch (e) {
      console.error(e);
      setParsed({ skills: [], experience: "", education: "" });
      setMatchPreview(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b" }}>Upload Resume</h1>

      <div
        className={"upload-zone " + (dragover ? "dragover" : "")}
        onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
        onDragLeave={() => setDragover(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          style={{ display: "none" }}
          onChange={onSelect}
        />
        <p>{file ? file.name : "Drag & drop PDF here or click to browse"}</p>
      </div>

      <button
        type="button"
        className="apply-btn"
        style={{ marginTop: 16 }}
        onClick={upload}
        disabled={!file || loading}
      >
        {loading ? "Uploading..." : "Upload & Parse"}
      </button>

      {parsed && (
        <div className="eval-section" style={{ marginTop: 24 }}>
          <h3>Resume Parsing Result</h3>
          <p><strong>Extracted skills:</strong> {Array.isArray(parsed.skills) ? parsed.skills.join(", ") : parsed.skills || "—"}</p>
          <p><strong>Experience:</strong> {parsed.experience ?? "—"}</p>
          <p><strong>Education:</strong> {parsed.education ?? "—"}</p>
          {matchPreview != null && <p><strong>Match score preview:</strong> {matchPreview}%</p>}
        </div>
      )}
    </div>
  );
}

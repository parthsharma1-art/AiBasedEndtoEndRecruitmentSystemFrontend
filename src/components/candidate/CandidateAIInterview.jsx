import React, { useEffect, useState, useRef } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function CandidateAIInterview() {
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [recording, setRecording] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(CONFIG.BACKEND_URL + "/candidate/interview/current", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json().catch(() => null))
      .then((data) => {
        setSession(data);
        setQuestions(data?.questions || []);
        if (data?.durationMinutes) setTimer(data.durationMinutes * 60);
      });
  }, []);

  useEffect(() => {
    if (timer <= 0 || result) return;
    const t = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timer, result]);

  useEffect(() => {
    if (!recording || !videoRef.current) return;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    }).catch(() => {});
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, [recording]);

  const startInterview = () => setRecording(true);
  const endInterview = async () => {
    setRecording(false);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(CONFIG.BACKEND_URL + "/candidate/interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ sessionId: session?.id }),
      });
      const data = await res.json().catch(() => ({}));
      setResult(data);
    } catch (e) {
      setResult({ communicationScore: 0, technicalScore: 0, feedback: "Connect backend for AI interview." });
    }
  };

  if (result) {
    return (
      <div className="dashboard-content">
        <h1 style={{ marginBottom: 24 }}>Interview Result</h1>
        <div className="eval-section">
          <p><strong>Communication Score:</strong> {result.communicationScore ?? "—"}</p>
          <p><strong>Technical Score:</strong> {result.technicalScore ?? "—"}</p>
          <p><strong>Feedback:</strong> {result.feedback ?? "—"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 24 }}>AI Interview</h1>
      <div className="eval-section">
        <p>Camera &amp; mic access required. Live timer: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</p>
        {!recording ? (
          <button type="button" className="apply-btn" onClick={startInterview}>Start Interview</button>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <video ref={videoRef} autoPlay muted playsInline style={{ width: 320, height: 240, background: "#000", borderRadius: 8 }} />
            </div>
            {questions[currentQ] && (
              <p><strong>Question:</strong> {questions[currentQ].text || questions[currentQ]}</p>
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              {currentQ < questions.length - 1 ? (
                <button type="button" className="apply-btn" onClick={() => setCurrentQ((p) => p + 1)}>Next</button>
              ) : null}
              <button type="button" onClick={endInterview} style={{ background: "#ef4444", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 8, cursor: "pointer" }}>End Interview</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

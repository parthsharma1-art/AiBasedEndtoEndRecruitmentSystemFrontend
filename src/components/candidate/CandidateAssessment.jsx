import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function CandidateAssessment() {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(CONFIG.BACKEND_URL + "/candidate/assessment/current", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json().catch(() => null))
      .then((data) => {
        setTest(data);
        if (data?.durationMinutes) setTimer(data.durationMinutes * 60);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (timer <= 0 || submitted) return;
    const t = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timer, submitted]);

  const submit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(CONFIG.BACKEND_URL + "/candidate/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json().catch(() => ({}));
      setSubmitted(data);
    } catch (e) {
      setSubmitted({ score: 0, passed: false, topicBreakdown: [] });
    }
  };

  if (loading) return <div className="dashboard-content"><h2>Loading assessment...</h2></div>;

  if (submitted) {
    return (
      <div className="dashboard-content">
        <h1 style={{ marginBottom: 24 }}>Assessment Result</h1>
        <div className="eval-section">
          <p><strong>Score:</strong> {submitted.score ?? "—"}</p>
          <p><strong>Pass/Fail:</strong> {submitted.passed ? "Pass" : "Fail"}</p>
          {Array.isArray(submitted.topicBreakdown) && submitted.topicBreakdown.length > 0 && (
            <p><strong>Topic-wise:</strong> {submitted.topicBreakdown.map((t) => t.topic + ": " + t.score).join(", ")}</p>
          )}
        </div>
      </div>
    );
  }

  const questions = test?.questions || [];

  return (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 24 }}>Assessment</h1>
      <div className="eval-section">
        <h3>Instructions</h3>
        <p>Complete the MCQ within the time limit. Timer: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</p>
      </div>
      {questions.length === 0 && <p>No active assessment. Apply for a job that requires a test first.</p>}
      {questions.map((q, i) => (
        <div key={q.id || i} className="eval-section">
          <p><strong>Q{i + 1}:</strong> {q.question}</p>
          {(q.options || []).map((opt, j) => (
            <label key={j} style={{ display: "block", marginBottom: 8 }}>
              <input
                type="radio"
                name={"q" + i}
                checked={answers["q" + i] === j}
                onChange={() => setAnswers((prev) => ({ ...prev, ["q" + i]: j }))}
              />
              {" "}{opt}
            </label>
          ))}
        </div>
      ))}
      {questions.length > 0 && (
        <button type="button" className="apply-btn" style={{ marginTop: 16 }} onClick={submit}>
          Submit
        </button>
      )}
    </div>
  );
}

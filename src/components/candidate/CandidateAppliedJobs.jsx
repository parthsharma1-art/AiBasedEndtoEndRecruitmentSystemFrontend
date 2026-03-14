import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

// responsive hook
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export default function CandidateAppliedJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMobile = useMediaQuery("(max-width:768px)");
  const isTablet = useMediaQuery("(max-width:1024px)");

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/candidate-auth");
        return;
      }

      const res = await axios.get(
        CONFIG.BACKEND_URL + "/jobs/applied",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load applied jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACCEPTED":
        return {
          background: "#dcfce7",
          color: "#166534"
        };
      case "REJECTED":
        return {
          background: "#fee2e2",
          color: "#991b1b"
        };
      default:
        return {
          background: "#fef3c7",
          color: "#92400e"
        };
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content" style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400
          }}
        >
          <h2>Loading applied jobs...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content" style={{ padding: 20 }}>
        <div
          style={{
            padding: 20,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12
          }}
        >
          ⚠️ {error}

          <button
            onClick={fetchAppliedJobs}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content" style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap"
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1e293b"
          }}
        >
          Applied Jobs
        </h1>
      </div>

      {jobs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            background: "#f8fafc",
            borderRadius: 12,
            border: "2px dashed #e2e8f0"
          }}
        >
          <h3>No Applied Jobs Yet</h3>

          <button
            onClick={() => navigate("/browse-jobs")}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(2,1fr)"
              : "repeat(3,1fr)",
            gap: 20
          }}
        >
          {jobs.map((application, index) => (
            <div
              key={application.id || index}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "1.1rem",
                    fontWeight: 600
                  }}
                >
                  {application.title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: "#64748b"
                  }}
                >
                  {application.companyName}
                </p>
              </div>

              <div style={{ marginBottom: 12 }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    background: "#dbeafe",
                    color: "#1e40af",
                    borderRadius: 20,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    marginRight: 8
                  }}
                >
                  {application.jobType}
                </span>

                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    background: "#dcfce7",
                    color: "#166534",
                    borderRadius: 20,
                    fontSize: "0.8rem",
                    fontWeight: 600
                  }}
                >
                  {application.jobProfile}
                </span>
              </div>

              <div style={{ marginBottom: 12 }}>
                <p style={{ margin: 0 }}>
                  💰 {application.salaryRange}
                </p>

                <p style={{ margin: "4px 0 0 0" }}>
                  📅 Applied on{" "}
                  {application.appliedAt
                    ? new Date(application.appliedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textAlign: "center",
                  ...getStatusStyle(application.jobStatus)
                }}
              >
                Application Status: {application.jobStatus}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
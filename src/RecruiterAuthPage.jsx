import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "./config/config";

const API_BASE = CONFIG.BACKEND_URL;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  // Skip token for create recruiter endpoint
  if (token && !config.url?.includes("/recruiter/create")) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

export default function RecruiterAuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [showGoogleModal, setShowGoogleModal] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [form, setForm] = React.useState({});
  const [files, setFiles] = React.useState({
    profileImage: null,
    idCard: null,
  });

  const nav = useNavigate();

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const submit = async () => {
    const hasInput =
      (form.email && String(form.email).trim()) ||
      (form.mobileNumber && String(form.mobileNumber).trim());
    if (!hasInput) return;
    try {
      if (isLogin) {
        const res = await axios.post(API_BASE + "/recruiter/login", {
          mobileNumber: form.mobileNumber,
          email: form.email,
        });

        saveUser(res.data);
        nav("/dashboard");
      } else {
        const formData = new FormData();

        formData.append("name", form.name || "");
        formData.append("mobileNumber", form.mobileNumber || "");
        formData.append("email", form.email || "");
        formData.append("companyName", form.companyName || "");
        formData.append("age", form.age ? parseInt(form.age) : "");
        formData.append("state", form.state || "");
        formData.append("country", form.country || "");
        formData.append("designation", form.designation || "");

        if (files.profileImage) {
          formData.append("profileImage", files.profileImage);
        }

        if (files.idCard) {
          formData.append("idCard", files.idCard);
        }

        // ✅ FIXED CREATE API (Removed manual Content-Type)
        const res = await axios.post(
          API_BASE + "/recruiter/create",
          formData
        );

        saveUser(res.data);
        nav("/dashboard");
      }
    } catch (e) {
      console.error(e);
      alert("Operation failed");
    }
  };

  const saveUser = (data) => {
    localStorage.setItem("token", data.token?.authKey || data.authKey);
    localStorage.setItem("hrId", data.id);
    localStorage.setItem("hrName", data.name);
    localStorage.setItem("hrEmail", data.email);
    localStorage.setItem("hrPhone", data.mobileNumber);
    // Store login timestamp for 4-hour session check
    localStorage.setItem("loginTimestamp", Date.now().toString());
  };

  const hasEmailOrNumber =
    (form.email && String(form.email).trim()) ||
    (form.mobileNumber && String(form.mobileNumber).trim());

  const googleLogin = () => {
    // Show modal first
    setShowGoogleModal(true);
  };

  const handleGoogleContinue = async () => {
    try {
      setGoogleLoading(true);
      setShowGoogleModal(false);
      
      const res = await axios.get(
        API_BASE + "/recruiter/google/login-url-recruiter"
      );
      const googleUrl = res.data?.url || res.data?.url;
      if (googleUrl) {
        window.location.href = googleUrl;
      } else {
        alert("Google URL not received");
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      <div
        style={{
          flex: 1,
          background: "#4f46e5",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
        }}
      >
        HR Recruitment Panel
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 380,
            padding: 30,
            boxShadow: "0 10px 25px rgba(0,0,0,.1)",
            borderRadius: 12,
          }}
        >
          <h2>{isLogin ? "HR Login" : "Create Recruiter Account"}</h2>

          {!isLogin && (
            <input
              name="name"
              placeholder="Full Name"
              onChange={handle}
              style={inp}
            />
          )}

          <input
            name="mobileNumber"
            placeholder="Mobile"
            onChange={handle}
            style={inp}
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handle}
            style={inp}
          />

          {!isLogin && (
            <>
              <input
                name="companyName"
                placeholder="Company"
                onChange={handle}
                style={inp}
              />
              <input
                name="designation"
                placeholder="Designation"
                onChange={handle}
                style={inp}
              />
              <input
                name="age"
                placeholder="Age"
                onChange={handle}
                style={inp}
              />
              <input
                name="state"
                placeholder="State"
                onChange={handle}
                style={inp}
              />
              <input
                name="country"
                placeholder="Country"
                onChange={handle}
                style={inp}
              />

              <div style={{ marginTop: 12 }}>
                <label style={label}>Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleFile}
                  style={fileInp}
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={label}>ID Card</label>
                <input
                  type="file"
                  name="idCard"
                  accept="image/*,.pdf"
                  onChange={handleFile}
                  style={fileInp}
                />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={!hasEmailOrNumber}
            style={{
              ...btn,
              opacity: hasEmailOrNumber ? 1 : 0.5,
              cursor: hasEmailOrNumber ? "pointer" : "not-allowed",
              filter: hasEmailOrNumber ? "none" : "grayscale(0.5)",
            }}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

          <div style={{ textAlign: "center", marginTop: 15, color: "#999" }}>
            OR
          </div>

          <button onClick={googleLogin} style={googleBtn}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="google"
              style={{ width: 22, marginRight: 10 }}
            />
            Continue with Google
          </button>

          <p style={{ marginTop: 15 }}>
            {isLogin ? "No account? " : "Already have account? "}
            <span
              style={{
                color: "#4f46e5",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>

      {/* Google Login Modal */}
      {showGoogleModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease-in",
          }}
          onClick={() => !googleLoading && setShowGoogleModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              animation: "slideUp 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🔐</div>
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b" }}>
                Google Login
              </h2>
            </div>

            <p
              style={{
                textAlign: "center",
                color: "#64748b",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                marginBottom: "25px",
              }}
            >
              If you are a new user, please sign up first. After signing up, you
              can use Google login for future access.
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowGoogleModal(false)}
                disabled={googleLoading}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#e2e8f0",
                  color: "#475569",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: googleLoading ? "not-allowed" : "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleGoogleContinue}
                disabled={googleLoading}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: googleLoading ? "#9ca3af" : "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: googleLoading ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: googleLoading ? 0.7 : 1,
                }}
              >
                {googleLoading ? (
                  <>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid #fff",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                      }}
                    ></div>
                    Loading...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const inp = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  border: "1px solid #ddd",
  borderRadius: 8,
};

const btn = {
  width: "100%",
  padding: 12,
  marginTop: 15,
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  cursor: "pointer",
};

const googleBtn = {
  width: "100%",
  padding: 12,
  marginTop: 15,
  background: "#fff",
  color: "#444",
  border: "1px solid #ddd",
  borderRadius: 10,
  fontSize: 16,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

const label = {
  display: "block",
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 5,
  color: "#444",
};

const fileInp = {
  width: "100%",
  padding: 10,
  border: "1px solid #ddd",
  borderRadius: 8,
  background: "#fafafa",
};

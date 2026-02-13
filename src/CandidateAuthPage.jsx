import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Config from "./config/config";

// Utility function to check if candidate is logged in and logged in within last 4 hours
function isCandidateLoggedIn() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    // Check if login timestamp exists
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    if (!loginTimestamp) {
        // If no timestamp, assume logged in (for backward compatibility)
        // Set current timestamp for future checks
        localStorage.setItem("loginTimestamp", Date.now().toString());
        return true;
    }
    
    // Check if login was within last 4 hours (4 * 60 * 60 * 1000 milliseconds)
    const fourHoursInMs = 4 * 60 * 60 * 1000;
    const currentTime = Date.now();
    const loginTime = parseInt(loginTimestamp, 10);
    
    if (currentTime - loginTime > fourHoursInMs) {
        // Token expired (more than 4 hours), clear it
        localStorage.removeItem("token");
        localStorage.removeItem("loginTimestamp");
        localStorage.removeItem("id");
        localStorage.removeItem("name");
        return false;
    }
    
    return true;
}

// Hook for responsive design
function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}

export default function CandidateAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  
  // Check login status on mount
  useEffect(() => {
    setIsLoggedIn(isCandidateLoggedIn());
    
    // Check every minute to update login status
    const interval = setInterval(() => {
      setIsLoggedIn(isCandidateLoggedIn());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    mobileNumber: "",
    age: "",
    gender: "",
    location: { city: "", state: "", country: "" },
    skills: [],
    experienceYears: "",
    highestQualification: "",
    currentJobRole: "",
    expectedSalary: "",
    cityPreference: "",
    resumeFile: null,
    profileImageFile: null,
  });

  const nav = useNavigate();
  const location = useLocation();
  const subdomain = location.state?.subdomain || "";

  const handle = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const locField = name.split(".")[1];
      setForm({
        ...form,
        location: { ...form.location, [locField]: value },
      });
    } else if (name === "skills") {
      setForm({ ...form, skills: value.split(",").map((s) => s.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submit = async () => {
    try {
      // ================= LOGIN =================
      if (isLogin) {
        const res = await axios.post(
          Config.BACKEND_URL + "/candidate/login",
          {
            email: form.email,
            mobileNumber: form.mobileNumber,
          },
          {
            headers: { subdomain },
          }
        );

        localStorage.setItem("token", res.data.token.authKey);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("name", res.data.name);
        // Store login timestamp for 4-hour session check
        localStorage.setItem("loginTimestamp", Date.now().toString());
        nav("/candidate-landing");
      }

      // ================= SIGNUP =================
      else {
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("mobileNumber", form.mobileNumber);
        formData.append("age", form.age);
        formData.append("gender", form.gender);

        formData.append("location.city", form.location.city);
        formData.append("location.state", form.location.state);
        formData.append("location.country", form.location.country);

        formData.append("skills", form.skills.join(","));
        formData.append("experienceYears", form.experienceYears);
        formData.append("highestQualification", form.highestQualification);
        formData.append("currentJobRole", form.currentJobRole);
        formData.append("expectedSalary", form.expectedSalary);
        formData.append("cityPreference", form.cityPreference);

        // ✅ Append files
        if (form.resumeFile) {
          formData.append("resume", form.resumeFile);
        }

        if (form.profileImageFile) {
          formData.append("profileImage", form.profileImageFile);
        }

        const res = await axios.post(
          Config.BACKEND_URL + "/candidate/create",
          formData,
          {
            headers: {
              subdomain,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        localStorage.setItem("token", res.data.token.authKey);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("name", res.data.name);
        // Store login timestamp for 4-hour session check
        localStorage.setItem("loginTimestamp", Date.now().toString());
        nav("/candidate-landing");
      }
    } catch (e) {
      console.error(e);
      alert("Login / Signup failed. Please check your credentials.");
    }
  };

  const googleLogin = () => {
    alert("Google login UI only (API not connected yet)");
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      minHeight: "100vh", 
      fontFamily: "Arial" 
    }}>
      {/* LEFT */}
      {!isMobile && (
        <div
          style={{
            flex: 1,
            background: "#4f46e5",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? "24px" : "30px",
            padding: isMobile ? "40px 20px" : "0"
          }}
        >
          Candidate Login
        </div>
      )}

      {/* RIGHT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "20px" : "0",
          background: isMobile ? "#f9fafb" : "transparent"
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : 400,
            maxWidth: "500px",
            padding: isMobile ? "20px" : 30,
            boxShadow: "0 10px 25px rgba(0,0,0,.1)",
            borderRadius: 12,
            overflowY: "auto",
            maxHeight: isMobile ? "none" : "90vh",
            background: "#fff"
          }}
        >
          {/* Dashboard Button if Logged In */}
          {isLoggedIn && (
            <div style={{
              marginBottom: "20px",
              padding: "12px",
              background: "#dcfce7",
              border: "1px solid #86efac",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <p style={{ margin: "0 0 10px", color: "#166534", fontSize: "0.9rem" }}>
                You're already logged in!
              </p>
              <button
                onClick={() => navigate("/candidate-dashboard")}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Go to Dashboard
              </button>
            </div>
          )}

          <h2 style={{ 
            fontSize: isMobile ? "1.5rem" : "1.75rem",
            marginBottom: "20px"
          }}>
            {isLogin ? "Candidate Login" : "Create Account"}
          </h2>

          {!isLogin && (
            <input 
              name="name" 
              placeholder="Full Name" 
              onChange={handle} 
              style={{
                width: "100%",
                padding: isMobile ? 10 : 12,
                marginTop: 10,
                border: "1px solid #ddd",
                borderRadius: 8,
                fontSize: isMobile ? "14px" : "16px",
                boxSizing: "border-box"
              }} 
            />
          )}

          <input 
            name="mobileNumber" 
            placeholder="Mobile" 
            onChange={handle} 
            style={{
              width: "100%",
              padding: isMobile ? 10 : 12,
              marginTop: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
              fontSize: isMobile ? "14px" : "16px",
              boxSizing: "border-box"
            }} 
          />
          <input 
            name="email" 
            placeholder="Email" 
            onChange={handle} 
            style={{
              width: "100%",
              padding: isMobile ? 10 : 12,
              marginTop: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
              fontSize: isMobile ? "14px" : "16px",
              boxSizing: "border-box"
            }} 
          />

          {!isLogin && (
            <>
              <input 
                name="age" 
                placeholder="Age" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />
              <input 
                name="gender" 
                placeholder="Gender" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />
              <input 
                name="location.city" 
                placeholder="City" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />
              <input 
                name="location.state" 
                placeholder="State" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />
              <input 
                name="location.country" 
                placeholder="Country" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />
              <input 
                name="skills" 
                placeholder="Skills (comma separated)" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />
              <input 
                name="experienceYears" 
                placeholder="Experience Years" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />
              <input 
                name="highestQualification" 
                placeholder="Highest Qualification" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />
              <input 
                name="currentJobRole" 
                placeholder="Current Job Role" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />

              {/* ✅ FILE UPLOADS */}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setForm({ ...form, resumeFile: e.target.files[0] })
                }
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, profileImageFile: e.target.files[0] })
                }
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }}
              />

              <input 
                name="expectedSalary" 
                placeholder="Expected Salary" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />
              <input 
                name="cityPreference" 
                placeholder="Preferred City" 
                onChange={handle} 
                style={{
                  width: "100%",
                  padding: isMobile ? 10 : 12,
                  marginTop: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: isMobile ? "14px" : "16px",
                  boxSizing: "border-box"
                }} 
              />
            </>
          )}

          <button 
            onClick={submit} 
            style={{
              width: "100%",
              padding: isMobile ? 10 : 12,
              marginTop: 15,
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: isMobile ? "14px" : 16,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

          <div style={{
            display: "flex",
            alignItems: "center",
            marginTop: 18
          }}>
            <div style={{
              flex: 1,
              height: 1,
              background: "#e5e7eb"
            }}></div>
            <span style={{ margin: "0 10px", color: "#999", fontSize: isMobile ? "12px" : "14px" }}>OR</span>
            <div style={{
              flex: 1,
              height: 1,
              background: "#e5e7eb"
            }}></div>
          </div>

          <button 
            onClick={googleLogin} 
            style={{
              width: "100%",
              padding: isMobile ? 10 : 12,
              marginTop: 15,
              background: "#fff",
              color: "#444",
              border: "1px solid #ddd",
              borderRadius: 10,
              fontSize: isMobile ? "14px" : 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 500,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
            }}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="google"
              style={{ width: 22, marginRight: 10 }}
            />
            Continue with Google
          </button>

          <p style={{ 
            marginTop: 15,
            fontSize: isMobile ? "14px" : "16px",
            textAlign: "center"
          }}>
            {isLogin ? "No account? " : "Already have account? "}
            <span
              style={{ color: "#4f46e5", cursor: "pointer", fontWeight: 600 }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Styles are now applied inline for responsive design

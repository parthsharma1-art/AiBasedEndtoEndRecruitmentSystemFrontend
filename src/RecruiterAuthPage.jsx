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
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showOtpSignupModal, setShowOtpSignupModal] = React.useState(false);
  const [loginMode, setLoginMode] = React.useState("password"); // 'password' | 'otp'
  const [otpStep, setOtpStep] = React.useState("email"); // 'email' | 'otp'
  const [otpEmail, setOtpEmail] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [sendOtpLoading, setSendOtpLoading] = React.useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
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

  const hasEmailAndPassword =
    (form.email && String(form.email).trim()) &&
    (form.password && String(form.password).trim());

  const submit = async () => {
    if (!hasEmailAndPassword) {
      alert("Please enter email and password");
      return;
    }

    // Validate password match for signup
    if (!isLogin && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post(API_BASE + "/recruiter/login", {
          email: form.email,
          password: form.password,
        });

        saveUser(res.data);
        nav("/dashboard");
      } else {
        const formData = new FormData();

        // Append fields matching RecruiterRequest structure
        formData.append("name", form.name || "");
        formData.append("mobileNumber", form.mobileNumber || "");
        formData.append("email", form.email || "");
        formData.append("companyName", form.companyName || "");
        if (form.age) {
          formData.append("age", parseInt(form.age));
        }
        formData.append("state", form.state || "");
        formData.append("country", form.country || "");
        formData.append("designation", form.designation || "");
        formData.append("password", form.password || "");
        formData.append("confirmPassword", form.confirmPassword || "");

        // Append files if present
        if (files.profileImage) {
          formData.append("profileImage", files.profileImage);
        }

        if (files.idCard) {
          formData.append("idCard", files.idCard);
        }

        // Send request to backend
        const res = await axios.post(
          API_BASE + "/recruiter/create",
          formData
        );

        saveUser(res.data);
        nav("/dashboard");
      }
    } catch (e) {
      console.error(e);
      
      // Check if it's a login error (wrong password/credentials)
      if (isLogin && e.response) {
        const status = e.response.status;
        const message = e.response.data?.message || e.response.data?.error || "Invalid credentials";
        
        // Show OTP signup modal for authentication errors
        if (status === 401 || status === 403 || message.toLowerCase().includes("password") || 
            message.toLowerCase().includes("invalid") || message.toLowerCase().includes("credentials")) {
          setShowOtpSignupModal(true);
        } else {
          alert(message || "Login failed. Please try again.");
        }
      } else {
        alert("Operation failed");
      }
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

  const sendOtp = async () => {
    const email = (loginMode === "otp" ? otpEmail : form.email)?.trim();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    try {
      setSendOtpLoading(true);
      await axios.post(API_BASE + "/auth/send-otp", { email });
      setOtpEmail(email);
      setOtpStep("otp");
      setOtpCode("");
      alert("OTP sent to your email. Please check your inbox.");
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.message || e.response?.data?.error || "Failed to send OTP";
      alert(msg);
    } finally {
      setSendOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    const email = otpEmail.trim();
    const otp = otpCode.trim();
    if (!email || !otp) {
      alert("Please enter email and OTP");
      return;
    }
    try {
      setVerifyOtpLoading(true);
      const res = await axios.post(API_BASE + "/auth/verify-otp", {
        email,
        otp,
        role: "recruiter",
      });
      const data = res.data;
      if (data && (data.token?.authKey || data.authKey)) {
        saveUser(data);
        setOtpStep("email");
        setOtpCode("");
        setOtpEmail("");
        setLoginMode("password");
        nav("/dashboard");
      } else {
        alert("Login success but no token received. Please try again.");
      }
    } catch (e) {
      console.error(e);
      const msg = e.response?.status === 400
        ? (typeof e.response?.data === "string" ? e.response.data : "Invalid OTP")
        : (e.response?.data?.message || e.response?.data?.error || "Verification failed");
      alert(msg);
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper" style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
      <div
        className="auth-left-panel"
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
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <div
          className="auth-form-container"
          style={{
            width: "100%",
            maxWidth: 500,
            padding: 30,
            boxShadow: "0 10px 25px rgba(0,0,0,.1)",
            borderRadius: 12,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <h2>{isLogin ? (loginMode === "otp" ? "HR Login with OTP" : "HR Login") : "Create Recruiter Account"}</h2>

          {/* OTP Login flow */}
          {isLogin && loginMode === "otp" && (
            <>
              {otpStep === "email" ? (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    style={inp}
                  />
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={sendOtpLoading || !otpEmail.trim()}
                    style={{ ...btn, opacity: otpEmail.trim() && !sendOtpLoading ? 1 : 0.6 }}
                  >
                    {sendOtpLoading ? "Sending…" : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <input type="email" placeholder="Email" value={otpEmail} readOnly style={{ ...inp, background: "#f5f5f5" }} />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    style={inp}
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={verifyOtpLoading || !otpCode.trim()}
                    style={{ ...btn, opacity: otpCode.trim() && !verifyOtpLoading ? 1 : 0.6 }}
                  >
                    {verifyOtpLoading ? "Verifying…" : "Verify OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOtpStep("email"); setOtpCode(""); }}
                    style={{ ...btn, background: "#e2e8f0", color: "#475569", marginTop: 8 }}
                  >
                    Change Email
                  </button>
                </>
              )}
              <p style={{ marginTop: 12, fontSize: 14 }}>
                <span
                  style={{ color: "#4f46e5", cursor: "pointer", fontWeight: 600 }}
                  onClick={() => { setLoginMode("password"); setOtpStep("email"); setOtpEmail(""); setOtpCode(""); }}
                >
                  ← Back to password login
                </span>
              </p>
            </>
          )}

          {/* Password Login / Signup form */}
          {(!isLogin || loginMode === "password") && (
            <>
          {!isLogin && (
            <input
              name="name"
              placeholder="Full Name"
              value={form.name || ""}
              onChange={handle}
              style={inp}
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handle}
            style={inp}
          />

          <div style={passwordWrapper}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handle}
              style={passwordInput}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-eye-button"
              style={eyeButton}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

          {!isLogin && (
            <div style={passwordWrapper}>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handle}
                style={passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-eye-button"
                style={eyeButton}
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          )}

          {!isLogin && (
            <input
              name="mobileNumber"
              placeholder="Mobile (Optional)"
              value={form.mobileNumber || ""}
              onChange={handle}
              style={inp}
            />
          )}

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
            disabled={!hasEmailAndPassword}
            style={{
              ...btn,
              opacity: hasEmailAndPassword ? 1 : 0.5,
              cursor: hasEmailAndPassword ? "pointer" : "not-allowed",
              filter: hasEmailAndPassword ? "none" : "grayscale(0.5)",
            }}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

          {isLogin && loginMode === "password" && (
            <p style={{ marginTop: 10, fontSize: 14 }}>
              <span
                style={{ color: "#4f46e5", cursor: "pointer", fontWeight: 600 }}
                onClick={() => setLoginMode("otp")}
              >
                Login with OTP
              </span>
            </p>
          )}

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
            </>
          )}
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

      {/* OTP Signup Modal - Shows when login fails */}
      {showOtpSignupModal && (
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
            zIndex: 1001,
            animation: "fadeIn 0.2s ease-in",
          }}
          onClick={() => setShowOtpSignupModal(false)}
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
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🔒</div>
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b" }}>
                Login Failed
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
              Invalid email or password. Would you like to sign up with OTP instead?
            </p>

            <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <button
                onClick={() => {
                  setShowOtpSignupModal(false);
                  setLoginMode("otp");
                  setOtpStep("email");
                  setOtpEmail(form.email || "");
                  setOtpCode("");
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Sign Up with OTP
              </button>
              <button
                onClick={() => setShowOtpSignupModal(false)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#e2e8f0",
                  color: "#475569",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Try Again
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
        
        @media (max-width: 768px) {
          .auth-page-wrapper {
            flex-direction: column !important;
          }
          .auth-left-panel {
            display: none !important;
          }
          .auth-form-container {
            max-width: 100% !important;
            padding: 20px !important;
            max-height: calc(100vh - 40px) !important;
          }
        }
        
        .auth-form-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .auth-form-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .auth-form-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        .auth-form-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        .password-eye-button:hover {
          color: #4f46e5 !important;
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

const passwordWrapper = {
  position: "relative",
  width: "100%",
  marginTop: 10,
};

const passwordInput = {
  width: "100%",
  padding: 12,
  paddingRight: 45,
  border: "1px solid #ddd",
  borderRadius: 8,
};

const eyeButton = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#666",
  transition: "color 0.2s",
};

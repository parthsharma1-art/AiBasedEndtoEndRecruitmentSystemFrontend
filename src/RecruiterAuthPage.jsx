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

  const googleLogin = async () => {
    try {
      const res = await axios.get(
        API_BASE + "/recruiter/google/login-url-recruiter"
      );
      const googleUrl = res.data.url;
      if (googleUrl) {
        window.location.href = googleUrl;
      } else {
        alert("Google URL not received");
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed");
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

          <button onClick={submit} style={btn}>
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

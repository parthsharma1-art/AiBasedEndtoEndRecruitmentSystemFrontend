import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "./config/config";

const API_BASE = CONFIG.BACKEND_URL;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

export default function RecruiterAuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [form, setForm] = React.useState({});
  const nav = useNavigate();

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
        const res = await axios.post(API_BASE + "/recruiter/create", {
          name: form.name,
          mobileNumber: form.mobileNumber,
          email: form.email,
          companyName: form.companyName,
          age: parseInt(form.age),
          state: form.state,
          country: form.country,
          designation: form.designation,
        });

        saveUser(res.data);
        nav("/dashboard");
      }
    } catch (e) {
      alert("Login failed");
    }
  };

  const saveUser = (data) => {
    localStorage.setItem("token", data.token?.authKey || data.authKey);
    localStorage.setItem("hrId", data.id);
    localStorage.setItem("hrName", data.name);
    localStorage.setItem("hrEmail", data.email);
    localStorage.setItem("hrPhone", data.mobileNumber);
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
              <input name="companyName" placeholder="Company" onChange={handle} style={inp} />
              <input name="designation" placeholder="Designation" onChange={handle} style={inp} />
              <input name="age" placeholder="Age" onChange={handle} style={inp} />
              <input name="state" placeholder="State" onChange={handle} style={inp} />
              <input name="country" placeholder="Country" onChange={handle} style={inp} />
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
              style={{ color: "#4f46e5", cursor: "pointer" ,fontWeight: 600}}
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
  transition: "0.2s",
};


import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "./config/config";

const API_BASE = CONFIG.BACKEND_URL;


console.log("API_BASE:", API_BASE);
console.log("ENV URL:", import.meta.env.VITE_API_URL);


// Auto-send token with every request
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

export default function RecruiterAuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [form, setForm] = React.useState({});
  const nav = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post(API_BASE + "/recruiter/login", {
          mobileNumber: form.mobileNumber,
          email: form.email
        });
        console.log("Login response:", res.data);

        localStorage.setItem("token", res.data.token.authKey);
        localStorage.setItem("hrId", res.data.id);
        localStorage.setItem("hrName", res.data.name);
        localStorage.setItem("hrEmail", res.data.email);
        localStorage.setItem("hrPhone", res.data.mobileNumber);

        nav("/dashboard");
      } else {
        const res = await axios.post(API + "/recruiter/create", {
          name: form.name,
          mobileNumber: form.mobileNumber,
          email: form.email,
          companyName: form.companyName,
          age: parseInt(form.age),
          state: form.state,
          country: form.country,
          designation: form.designation
        });

        localStorage.setItem("token", res.data.token.authKey);
        localStorage.setItem("hrId", res.data.id);
        localStorage.setItem("hrName", res.data.name);
        localStorage.setItem("hrEmail", res.data.email);
        localStorage.setItem("hrPhone", res.data.mobileNumber);

        nav("/dashboard");
      }
    } catch (e) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      <div style={{
        flex: 1,
        background: "#4f46e5",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 30
      }}>
        HR Recruitment Panel
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 380, padding: 30, boxShadow: "0 10px 25px rgba(0,0,0,.1)", borderRadius: 12 }}>
          <h2>{isLogin ? "HR Login" : "Create Recruiter Account"}</h2>

          {!isLogin && <input name="name" placeholder="Full Name" onChange={handle} style={inp} />}
          <input name="mobileNumber" placeholder="Mobile" onChange={handle} style={inp} />
          <input name="email" placeholder="Email" onChange={handle} style={inp} />

          {!isLogin && <>
            <input name="companyName" placeholder="Company" onChange={handle} style={inp} />
            <input name="designation" placeholder="Designation" onChange={handle} style={inp} />
            <input name="age" placeholder="Age" onChange={handle} style={inp} />
            <input name="state" placeholder="State" onChange={handle} style={inp} />
            <input name="country" placeholder="Country" onChange={handle} style={inp} />
          </>}

          <button onClick={submit} style={btn}>
            {isLogin ? "Login" : "Create Account"}
          </button>

          <p style={{ marginTop: 15 }}>
            {isLogin ? "No account? " : "Already have account? "}
            <span style={{ color: "#4f46e5", cursor: "pointer" }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const inp = { width: "100%", padding: 12, marginTop: 10, border: "1px solid #ddd", borderRadius: 8 };
const btn = { width: "100%", padding: 12, marginTop: 15, background: "#4f46e5", color: "white", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" };

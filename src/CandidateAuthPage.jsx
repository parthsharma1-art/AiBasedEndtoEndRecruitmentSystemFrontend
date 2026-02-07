import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8081/api";

// Auto-send token with every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function CandidateAuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [form, setForm] = React.useState({});
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      if (isLogin) {
        // Candidate login API (replace with actual candidate login if different)
        const res = await axios.post(API + "/candidate/login", {
          mobileNumber: form.mobileNumber,
          email: form.email,
        });

        localStorage.setItem("token", res.data.token.authKey);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("mobileNumber", res.data.mobileNumber);

        nav("/candidate-landing");
      } else {
        // Candidate signup API
        const res = await axios.post(API + "/candidate/create", {
          name: form.name,
          mobileNumber: form.mobileNumber,
          email: form.email,
          age: parseInt(form.age),
          state: form.state,
          country: form.country,
        });

        localStorage.setItem("token", res.data.token.authKey);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("mobileNumber", res.data.mobileNumber);

        nav("/candidate-landing");
      }
    } catch (e) {
      console.log(e);
      alert("Login / Signup failed. Please check your credentials.");
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
        Candidate Login
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
          <h2>{isLogin ? "Candidate Login" : "Create Account"}</h2>

          {!isLogin && <input name="name" placeholder="Full Name" onChange={handle} style={inp} />}
          <input name="mobileNumber" placeholder="Mobile" onChange={handle} style={inp} />
          <input name="email" placeholder="Email" onChange={handle} style={inp} />

          {!isLogin && (
            <>
              <input name="age" placeholder="Age" onChange={handle} style={inp} />
              <input name="state" placeholder="State" onChange={handle} style={inp} />
              <input name="country" placeholder="Country" onChange={handle} style={inp} />
            </>
          )}

          <button onClick={submit} style={btn}>
            {isLogin ? "Login" : "Create Account"}
          </button>

          <p style={{ marginTop: 15 }}>
            {isLogin ? "No account? " : "Already have account? "}
            <span
              style={{ color: "#4f46e5", cursor: "pointer" }}
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

const inp = { width: "100%", padding: 12, marginTop: 10, border: "1px solid #ddd", borderRadius: 8 };
const btn = { width: "100%", padding: 12, marginTop: 15, background: "#4f46e5", color: "white", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" };

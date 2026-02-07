import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Config from "./config/config";

export default function CandidateAuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
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
    resumeUrl: "",
    profileImageUrl: "",
    expectedSalary: "",
    cityPreference: "",
  });
  const nav = useNavigate();
  const location = useLocation();
  const subdomain = location.state?.subdomain || "";

  // Handle input changes for nested and normal fields
  const handle = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const locField = name.split(".")[1];
      setForm({
        ...form,
        location: { ...form.location, [locField]: value },
      });
    } else if (name === "skills") {
      setForm({ ...form, skills: value.split(",").map(s => s.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submit = async () => {
    try {
      if (isLogin) {
        // Candidate login
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
        nav("/candidate-landing");
      } else {
        // Candidate signup (send full CandidateRequest)
        const payload = {
          name: form.name,
          email: form.email,
          mobileNumber: form.mobileNumber,
          age: parseInt(form.age),
          gender: form.gender,
          location: form.location,
          skills: form.skills,
          experienceYears: parseInt(form.experienceYears),
          highestQualification: form.highestQualification,
          currentJobRole: form.currentJobRole,
          resumeUrl: form.resumeUrl,
          profileImageUrl: form.profileImageUrl,
          expectedSalary: parseInt(form.expectedSalary),
          cityPreference: form.cityPreference,
        };

        const res = await axios.post(
          Config.BACKEND_URL + "/candidate/create",
          payload,
          { headers: { subdomain } }
        );

        localStorage.setItem("token", res.data.token.authKey);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("name", res.data.name);
        nav("/candidate-landing");
      }
    } catch (e) {
      console.error(e);
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
            width: 400,
            padding: 30,
            boxShadow: "0 10px 25px rgba(0,0,0,.1)",
            borderRadius: 12,
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          <h2>{isLogin ? "Candidate Login" : "Create Account"}</h2>

          {!isLogin && <input name="name" placeholder="Full Name" onChange={handle} style={inp} />}
          <input name="mobileNumber" placeholder="Mobile" onChange={handle} style={inp} />
          <input name="email" placeholder="Email" onChange={handle} style={inp} />
          {!isLogin && (
            <>
              <input name="age" placeholder="Age" onChange={handle} style={inp} />
              <input name="gender" placeholder="Gender" onChange={handle} style={inp} />
              <input name="location.city" placeholder="City" onChange={handle} style={inp} />
              <input name="location.state" placeholder="State" onChange={handle} style={inp} />
              <input name="location.country" placeholder="Country" onChange={handle} style={inp} />
              <input name="skills" placeholder="Skills (comma separated)" onChange={handle} style={inp} />
              <input name="experienceYears" placeholder="Experience Years" onChange={handle} style={inp} />
              <input name="highestQualification" placeholder="Highest Qualification" onChange={handle} style={inp} />
              <input name="currentJobRole" placeholder="Current Job Role" onChange={handle} style={inp} />
              <input name="resumeUrl" placeholder="Resume URL" onChange={handle} style={inp} />
              <input name="profileImageUrl" placeholder="Profile Image URL" onChange={handle} style={inp} />
              <input name="expectedSalary" placeholder="Expected Salary" onChange={handle} style={inp} />
              <input name="cityPreference" placeholder="Preferred City" onChange={handle} style={inp} />
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

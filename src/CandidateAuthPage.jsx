// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import Config from "./config/config";

// export default function CandidateAuthPage() {
//   const [isLogin, setIsLogin] = React.useState(true);
//   const [showGoogleModal, setShowGoogleModal] = React.useState(false);
//   const [googleLoading, setGoogleLoading] = React.useState(false);

//   const [form, setForm] = React.useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     age: "",
//     gender: "",
//     location: { city: "", state: "", country: "" },
//     skills: [],
//     experienceYears: "",
//     highestQualification: "",
//     currentJobRole: "",
//     expectedSalary: "",
//     cityPreference: "",
//     resumeFile: null,
//     profileImageFile: null,
//   });

//   const nav = useNavigate();
//   const location = useLocation();
//   const subdomain = location.state?.subdomain || "";

//   const handle = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith("location.")) {
//       const locField = name.split(".")[1];
//       setForm({
//         ...form,
//         location: { ...form.location, [locField]: value },
//       });
//     } else if (name === "skills") {
//       setForm({ ...form, skills: value.split(",").map((s) => s.trim()) });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const submit = async () => {
//     try {
//       // ================= LOGIN =================
//       if (isLogin) {
//         const res = await axios.post(
//           Config.BACKEND_URL + "/candidate/login",
//           {
//             email: form.email,
//             mobileNumber: form.mobileNumber,
//           },
//           {
//             headers: { subdomain },
//           }
//         );

//         localStorage.setItem("token", res.data.token.authKey);
//         localStorage.setItem("id", res.data.id);
//         localStorage.setItem("name", res.data.name);
//         nav("/candidate-landing");
//       }

//       // ================= SIGNUP =================
//       else {
//         const formData = new FormData();

//         formData.append("name", form.name);
//         formData.append("email", form.email);
//         formData.append("mobileNumber", form.mobileNumber);
//         formData.append("age", form.age);
//         formData.append("gender", form.gender);

//         formData.append("location.city", form.location.city);
//         formData.append("location.state", form.location.state);
//         formData.append("location.country", form.location.country);

//         formData.append("skills", form.skills.join(","));
//         formData.append("experienceYears", form.experienceYears);
//         formData.append("highestQualification", form.highestQualification);
//         formData.append("currentJobRole", form.currentJobRole);
//         formData.append("expectedSalary", form.expectedSalary);
//         formData.append("cityPreference", form.cityPreference);

//         // ✅ Append files
//         if (form.resumeFile) {
//           formData.append("resume", form.resumeFile);
//         }

//         if (form.profileImageFile) {
//           formData.append("profileImage", form.profileImageFile);
//         }

//         const res = await axios.post(
//           Config.BACKEND_URL + "/candidate/create",
//           formData,
//           {
//             headers: {
//               subdomain,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         localStorage.setItem("token", res.data.token.authKey);
//         localStorage.setItem("id", res.data.id);
//         localStorage.setItem("name", res.data.name);
//         nav("/candidate-landing");
//       }
//     } catch (e) {
//       console.error(e);
//       alert("Login / Signup failed. Please check your credentials.");
//     }
//   };

//   const googleLogin = () => {
//     // Show modal first
//     setShowGoogleModal(true);
//   };

//   const handleGoogleContinue = async () => {
//     try {
//       setGoogleLoading(true);
//       setShowGoogleModal(false);

//       // Fetch Google login URL from backend - GET API call
//       const res = await axios.get(
//         `${Config.BACKEND_URL}/google/login-url-candidate`
//       );

//       console.log("API Response:", res.data);

//       // Extract URL from response object
//       const googleUrl = res.data?.url || res.data?.url;

//       if (googleUrl) {
//         console.log("Redirecting to Google URL:", googleUrl);
//         // Redirect to the Google OAuth URL
//         window.location.href = googleUrl;
//       } else {
//         console.error("No URL in response:", res.data);
//         alert("Google URL not received from server");
//         setGoogleLoading(false);
//       }
//     } catch (error) {
//       console.error("Error initiating Google login:", error);
//       console.error("Error response:", error.response?.data);
//       alert("Failed to initiate Google login. Please try again.");
//       setGoogleLoading(false);
//       setShowGoogleModal(false);
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       {/* LEFT */}
//       <div
//         style={{
//           flex: 1,
//           background: "#4f46e5",
//           color: "white",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 30,
//         }}
//       >
//         Candidate Login
//       </div>

//       {/* RIGHT */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             width: 400,
//             padding: 30,
//             boxShadow: "0 10px 25px rgba(0,0,0,.1)",
//             borderRadius: 12,
//             overflowY: "auto",
//             maxHeight: "90vh",
//           }}
//         >
//           <h2>{isLogin ? "Candidate Login" : "Create Account"}</h2>

//           {!isLogin && (
//             <input name="name" placeholder="Full Name" onChange={handle} style={inp} />
//           )}

//           <input name="mobileNumber" placeholder="Mobile" onChange={handle} style={inp} />
//           <input name="email" placeholder="Email" onChange={handle} style={inp} />

//           {!isLogin && (
//             <>
//               <input name="age" placeholder="Age" onChange={handle} style={inp} />
//               <input name="gender" placeholder="Gender" onChange={handle} style={inp} />
//               <input name="location.city" placeholder="City" onChange={handle} style={inp} />
//               <input name="location.state" placeholder="State" onChange={handle} style={inp} />
//               <input name="location.country" placeholder="Country" onChange={handle} style={inp} />
//               <input name="skills" placeholder="Skills (comma separated)" onChange={handle} style={inp} />
//               <input name="experienceYears" placeholder="Experience Years" onChange={handle} style={inp} />
//               <input name="highestQualification" placeholder="Highest Qualification" onChange={handle} style={inp} />
//               <input name="currentJobRole" placeholder="Current Job Role" onChange={handle} style={inp} />

//               {/* ✅ FILE UPLOADS */}
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 onChange={(e) =>
//                   setForm({ ...form, resumeFile: e.target.files[0] })
//                 }
//                 style={inp}
//               />

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) =>
//                   setForm({ ...form, profileImageFile: e.target.files[0] })
//                 }
//                 style={inp}
//               />

//               <input name="expectedSalary" placeholder="Expected Salary" onChange={handle} style={inp} />
//               <input name="cityPreference" placeholder="Preferred City" onChange={handle} style={inp} />
//             </>
//           )}

//           <button onClick={submit} style={btn}>
//             {isLogin ? "Login" : "Create Account"}
//           </button>

//           <div style={dividerWrap}>
//             <div style={line}></div>
//             <span style={{ margin: "0 10px", color: "#999" }}>OR</span>
//             <div style={line}></div>
//           </div>

//           <button onClick={googleLogin} style={googleBtn}>
//             <img
//               src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//               alt="google"
//               style={{ width: 22, marginRight: 10 }}
//             />
//             Continue with Google
//           </button>

//           <p style={{ marginTop: 15 }}>
//             {isLogin ? "No account? " : "Already have account? "}
//             <span
//               style={{ color: "#4f46e5", cursor: "pointer", fontWeight: 600 }}
//               onClick={() => setIsLogin(!isLogin)}
//             >
//               {isLogin ? "Sign Up" : "Login"}
//             </span>
//           </p>
//         </div>
//       </div>

//       {/* Google Login Modal */}
//       {showGoogleModal && (
//         <>
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background: "rgba(0, 0, 0, 0.5)",
//               zIndex: 1000,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: "20px",
//               animation: "fadeIn 0.2s ease"
//             }}
//             onClick={() => setShowGoogleModal(false)}
//           >
//             <div
//               style={{
//                 background: "#fff",
//                 borderRadius: "12px",
//                 padding: "32px",
//                 maxWidth: "450px",
//                 width: "100%",
//                 boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
//                 position: "relative",
//                 animation: "slideUp 0.3s ease"
//               }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div style={{
//                 textAlign: "center",
//                 marginBottom: "24px"
//               }}>
//                 <div style={{
//                   width: "64px",
//                   height: "64px",
//                   margin: "0 auto 16px",
//                   borderRadius: "50%",
//                   background: "#e0e7ff",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}>
//                   <img
//                     src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//                     alt="google"
//                     style={{ width: 32, height: 32 }}
//                   />
//                 </div>
//                 <h2 style={{
//                   margin: "0 0 12px",
//                   fontSize: "1.5rem",
//                   color: "#1e293b",
//                   fontWeight: 700
//                 }}>
//                   Continue with Google
//                 </h2>
//                 <p style={{
//                   margin: 0,
//                   fontSize: "0.95rem",
//                   color: "#64748b",
//                   lineHeight: 1.6
//                 }}>
//                   If you are a new user, please sign up first. After signing up, you can use Google login for future access.
//                 </p>
//               </div>

//               <div style={{
//                 display: "flex",
//                 gap: "12px",
//                 justifyContent: "flex-end",
//                 flexWrap: "wrap"
//               }}>
//                 <button
//                   onClick={() => setShowGoogleModal(false)}
//                   style={{
//                     padding: "12px 24px",
//                     background: "#f1f5f9",
//                     color: "#475569",
//                     border: "none",
//                     borderRadius: "8px",
//                     cursor: "pointer",
//                     fontSize: "0.95rem",
//                     fontWeight: 600,
//                     transition: "all 0.2s"
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.background = "#e2e8f0";
//                     e.target.style.color = "#1e293b";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.background = "#f1f5f9";
//                     e.target.style.color = "#475569";
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleGoogleContinue}
//                   disabled={googleLoading}
//                   style={{
//                     padding: "12px 24px",
//                     background: googleLoading ? "#9ca3af" : "#4f46e5",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "8px",
//                     cursor: googleLoading ? "not-allowed" : "pointer",
//                     fontSize: "0.95rem",
//                     fontWeight: 600,
//                     transition: "all 0.2s",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "8px",
//                     opacity: googleLoading ? 0.7 : 1
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!googleLoading) {
//                       e.target.style.background = "#4338ca";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!googleLoading) {
//                       e.target.style.background = "#4f46e5";
//                     }
//                   }}
//                 >
//                   {googleLoading ? (
//                     <>
//                       <div style={{
//                         width: "16px",
//                         height: "16px",
//                         border: "2px solid #fff",
//                         borderTopColor: "transparent",
//                         borderRadius: "50%",
//                         animation: "spin 0.6s linear infinite"
//                       }}></div>
//                       Loading...
//                     </>
//                   ) : (
//                     "Continue"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//           <style>{`
//             @keyframes fadeIn {
//               from { opacity: 0; }
//               to { opacity: 1; }
//             }
//             @keyframes slideUp {
//               from { 
//                 transform: translateY(20px);
//                 opacity: 0;
//               }
//               to { 
//                 transform: translateY(0);
//                 opacity: 1;
//               }
//             }
//             @keyframes spin {
//               to { transform: rotate(360deg); }
//             }
//           `}</style>
//         </>
//       )}
//     </div>
//   );
// }

// const inp = {
//   width: "100%",
//   padding: 12,
//   marginTop: 10,
//   border: "1px solid #ddd",
//   borderRadius: 8,
// };

// const btn = {
//   width: "100%",
//   padding: 12,
//   marginTop: 15,
//   background: "#4f46e5",
//   color: "white",
//   border: "none",
//   borderRadius: 8,
//   fontSize: 16,
//   cursor: "pointer",
// };

// const googleBtn = {
//   width: "100%",
//   padding: 12,
//   marginTop: 15,
//   background: "#fff",
//   color: "#444",
//   border: "1px solid #ddd",
//   borderRadius: 10,
//   fontSize: 16,
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontWeight: 500,
//   boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
// };

// const dividerWrap = {
//   display: "flex",
//   alignItems: "center",
//   marginTop: 18,
// };

// const line = {
//   flex: 1,
//   height: 1,
//   background: "#e5e7eb",
// };


import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "./config/config";

const API_BASE = CONFIG.BACKEND_URL;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  // Skip token for create recruiter endpoint
  if (token && !config.url?.includes("/candidate/create")) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

export default function CandidateAuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [showGoogleModal, setShowGoogleModal] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    mobileNumber: "",
    age: "",
    gender: "",
    location: {
      city: "",
      state: "",
      country: ""
    },
    skills: "",
    experienceYears: "",
    highestQualification: "",
    currentJobRole: "",
    expectedSalary: "",
    cityPreference: ""
  });
  const [files, setFiles] = React.useState({
    profileImage: null,
    resume: null,
  });

  const nav = useNavigate();

  const handle = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setForm({
        ...form,
        location: {
          ...form.location,
          [locationField]: value
        }
      });
    } else if (name === "skills") {
      setForm({ ...form, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const submit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post(API_BASE + "/candidate/login", {
          mobileNumber: form.mobileNumber,
          email: form.email,
        });

        saveUser(res.data);
        nav("/candidate-dashboard");
      } else {
        const formData = new FormData();

        // Append candidate fields according to CandidateRequest structure
        formData.append("name", form.name || "");
        formData.append("email", form.email || "");
        formData.append("mobileNumber", form.mobileNumber || "");
        
        if (form.age) {
          formData.append("age", parseInt(form.age));
        }
        
        if (form.gender) {
          formData.append("gender", form.gender);
        }
        
        // Append location fields
        if (form.location.city) {
          formData.append("location.city", form.location.city);
        }
        if (form.location.state) {
          formData.append("location.state", form.location.state);
        }
        if (form.location.country) {
          formData.append("location.country", form.location.country);
        }
        
        // Append skills as multiple entries for List<String>
        // Spring Boot @ModelAttribute expects multiple form fields with same name for List
        if (form.skills && form.skills.trim()) {
          const skillsArray = form.skills.split(',').map(s => s.trim()).filter(s => s);
          skillsArray.forEach(skill => {
            formData.append("skills", skill);
          });
        }
        
        if (form.experienceYears) {
          formData.append("experienceYears", parseInt(form.experienceYears));
        }
        
        if (form.highestQualification) {
          formData.append("highestQualification", form.highestQualification);
        }
        
        if (form.currentJobRole) {
          formData.append("currentJobRole", form.currentJobRole);
        }
        
        if (form.expectedSalary) {
          formData.append("expectedSalary", parseInt(form.expectedSalary));
        }
        
        if (form.cityPreference) {
          formData.append("cityPreference", form.cityPreference);
        }
        
        // Append files with correct field names for candidate API
        if (files.profileImage) {
          formData.append("profileImage", files.profileImage);
        }

        if (files.resume) {
          formData.append("resume", files.resume);
        }

        // Call candidate create API
        const res = await axios.post(
          API_BASE + "/candidate/create",
          formData
        );

        saveUser(res.data);
        nav("/candidate-dashboard");
      }
    } catch (e) {
      console.error(e);
      alert("Operation failed");
    }
  };

  const saveUser = (data) => {
    localStorage.setItem("token", data.token?.authKey || data.authKey);
    localStorage.setItem("candidateId", data.id);
    localStorage.setItem("candidateName", data.name);
    localStorage.setItem("candidateEmail", data.email);
    localStorage.setItem("candidatePhone", data.mobileNumber);
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
        API_BASE + "/candidate/google/login-url-candidate"
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
        Candidate Panel
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
          <h2>{isLogin ? "Candidate Login" : "Create Candidate Account"}</h2>

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
                name="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={handle}
                style={inp}
              />
              <input
                name="gender"
                placeholder="Gender"
                value={form.gender}
                onChange={handle}
                style={inp}
              />
              
              <h4 style={{ marginTop: 15, marginBottom: 5, fontSize: 14, fontWeight: 600 }}>Location</h4>
              <input
                name="location.city"
                placeholder="City"
                value={form.location.city}
                onChange={handle}
                style={inp}
              />
              <input
                name="location.state"
                placeholder="State"
                value={form.location.state}
                onChange={handle}
                style={inp}
              />
              <input
                name="location.country"
                placeholder="Country"
                value={form.location.country}
                onChange={handle}
                style={inp}
              />
              
              <input
                name="skills"
                placeholder="Skills (comma separated, e.g., Java, Python, React)"
                value={form.skills}
                onChange={handle}
                style={inp}
              />
              <input
                name="experienceYears"
                type="number"
                placeholder="Experience Years"
                value={form.experienceYears}
                onChange={handle}
                style={inp}
              />
              <input
                name="highestQualification"
                placeholder="Highest Qualification"
                value={form.highestQualification}
                onChange={handle}
                style={inp}
              />
              <input
                name="currentJobRole"
                placeholder="Current Job Role"
                value={form.currentJobRole}
                onChange={handle}
                style={inp}
              />
              <input
                name="expectedSalary"
                type="number"
                placeholder="Expected Salary"
                value={form.expectedSalary}
                onChange={handle}
                style={inp}
              />
              <input
                name="cityPreference"
                placeholder="City Preference"
                value={form.cityPreference}
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
                <label style={label}>Resume</label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
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

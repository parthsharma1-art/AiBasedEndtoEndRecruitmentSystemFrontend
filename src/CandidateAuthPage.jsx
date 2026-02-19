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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const hasEmailAndPassword =
    (form.email && String(form.email).trim()) &&
    (form.password && String(form.password).trim());

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
    if (!hasEmailAndPassword) {
      alert("Please enter email and password");
      return;
    }

    // Validate password match for signup
    if (!isLogin) {
      if (!form.password || !form.password.trim()) {
        alert("Please enter a password");
        return;
      }
      if (!form.confirmPassword || !form.confirmPassword.trim()) {
        alert("Please confirm your password");
        return;
      }
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    }

    try {
      if (isLogin) {
        const res = await axios.post(API_BASE + "/candidate/login", {
          email: form.email,
          password: form.password,
        });

        saveUser(res.data);
        nav("/candidate-dashboard");
      } else {
        const formData = new FormData();

        // Append candidate fields according to CandidateRequest structure
        // Always append these fields - Spring Boot @ModelAttribute will bind them
        formData.append("name", form.name || "");
        formData.append("email", form.email || "");
        // Ensure password fields are always sent (required for signup)
        formData.append("password", form.password || "");
        formData.append("confirmPassword", form.confirmPassword || "");
        formData.append("mobileNumber", form.mobileNumber || "");
        
        // Log FormData entries for debugging (remove in production)
        console.log("FormData entries being sent:");
        for (let pair of formData.entries()) {
          if (pair[0] === "password" || pair[0] === "confirmPassword") {
            console.log(pair[0] + ": " + (pair[1] ? "***" : "EMPTY"));
          } else {
            console.log(pair[0] + ": " + pair[1]);
          }
        }
        
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
        role: "candidate",
      });
      const data = res.data;
      if (data && (data.token?.authKey || data.authKey)) {
        saveUser(data);
        setOtpStep("email");
        setOtpCode("");
        setOtpEmail("");
        setLoginMode("password");
        nav("/candidate-dashboard");
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
        Candidate Panel
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
          <h2>{isLogin ? (loginMode === "otp" ? "Candidate Login with OTP" : "Candidate Login") : "Create Candidate Account"}</h2>

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
              placeholder="Mobile "
              value={form.mobileNumber}
              onChange={handle}
              style={inp}
            />
          )}

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

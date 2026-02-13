import React, { useEffect, useState } from "react";
import axios from "axios";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    age: "",
    gender: "",
    location: { city: "", state: "", country: "" },
    skills: "",
    experienceYears: "",
    highestQualification: "",
    currentJobRole: "",
    expectedSalary: "",
    cityPreference: "",
  });
  const [files, setFiles] = useState({
    profileImage: null,
    resume: null,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(CONFIG.BACKEND_URL + "/candidate/get", {
        headers: { Authorization: "Bearer " + token },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = () => {
    if (!profile) return;
    
    // Prefill form with existing profile data
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      mobileNumber: profile.mobileNumber || "",
      age: profile.age?.toString() || "",
      gender: profile.gender || "",
      location: {
        city: profile.location?.city || "",
        state: profile.location?.state || "",
        country: profile.location?.country || "",
      },
      skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "",
      experienceYears: profile.experienceYears?.toString() || "",
      highestQualification: profile.highestQualification || "",
      currentJobRole: profile.currentJobRole || "",
      expectedSalary: profile.expectedSalary || "",
      cityPreference: profile.cityPreference || "",
    });
    setFiles({ profileImage: null, resume: null });
    setShowUpdateModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locField = name.split(".")[1];
      setForm({
        ...form,
        location: { ...form.location, [locField]: value },
      });
    } else if (name === "skills") {
      setForm({ ...form, skills: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please login again.");
      return;
    }

    try {
      setUpdateLoading(true);
      const formData = new FormData();

      formData.append("name", form.name || "");
      formData.append("email", form.email || "");
      formData.append("mobileNumber", form.mobileNumber || "");
      formData.append("age", form.age ? parseInt(form.age) : "");
      formData.append("gender", form.gender || "");
      formData.append("location.city", form.location.city || "");
      formData.append("location.state", form.location.state || "");
      formData.append("location.country", form.location.country || "");
      formData.append("skills", form.skills || "");
      formData.append("experienceYears", form.experienceYears ? parseInt(form.experienceYears) : "");
      formData.append("highestQualification", form.highestQualification || "");
      formData.append("currentJobRole", form.currentJobRole || "");
      formData.append("expectedSalary", form.expectedSalary || "");
      formData.append("cityPreference", form.cityPreference || "");

      if (files.profileImage) {
        formData.append("profileImage", files.profileImage);
      }
      if (files.resume) {
        formData.append("resume", files.resume);
      }

      const res = await axios.put(CONFIG.BACKEND_URL + "/candidate/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update token if returned
      if (res.data?.token?.authKey) {
        localStorage.setItem("token", res.data.token.authKey);
      }
      if (res.data?.name) {
        localStorage.setItem("name", res.data.name);
      }

      alert("Profile updated successfully!");
      setShowUpdateModal(false);
      fetchProfile(); // Refresh profile data
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="dashboard-content"><h2>Loading profile...</h2></div>;
  if (!profile) return <div className="dashboard-content"><h2>Profile not found.</h2></div>;

  return (
    <>
      <div className="dashboard-content">
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: 24,
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b" }}>My Profile</h1>
          <button
            onClick={handleUpdateClick}
            style={{
              padding: "12px 24px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#4338ca";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 8px rgba(79, 70, 229, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#4f46e5";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.2)";
            }}
          >
            <span>✏️</span>
            <span>Update Profile</span>
          </button>
        </div>
        <div className="eval-section">
          <h3>Personal Info</h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile:</strong> {profile.mobileNumber ?? "—"}</p>
          {profile.age && <p><strong>Age:</strong> {profile.age}</p>}
          {profile.gender && <p><strong>Gender:</strong> {profile.gender}</p>}
        </div>
        {profile.location && (
          <div className="eval-section">
            <h3>Location</h3>
            <p><strong>City:</strong> {profile.location.city || "—"}</p>
            <p><strong>State:</strong> {profile.location.state || "—"}</p>
            <p><strong>Country:</strong> {profile.location.country || "—"}</p>
          </div>
        )}
        <div className="eval-section">
          <h3>Education</h3>
          <p>{profile.highestQualification || profile.education || "—"}</p>
        </div>
        <div className="eval-section">
          <h3>Skills</h3>
          <p>{Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills ?? "—"}</p>
        </div>
        {profile.experienceYears && (
          <div className="eval-section">
            <h3>Experience</h3>
            <p><strong>Years:</strong> {profile.experienceYears}</p>
            {profile.currentJobRole && <p><strong>Current Role:</strong> {profile.currentJobRole}</p>}
          </div>
        )}
        {profile.expectedSalary && (
          <div className="eval-section">
            <h3>Salary & Preferences</h3>
            <p><strong>Expected Salary:</strong> {profile.expectedSalary}</p>
            {profile.cityPreference && <p><strong>City Preference:</strong> {profile.cityPreference}</p>}
          </div>
        )}
        <div className="eval-section">
          <h3>LinkedIn</h3>
          <p>{profile.linkedIn ? <a href={profile.linkedIn} target="_blank" rel="noreferrer">{profile.linkedIn}</a> : "—"}</p>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              overflowY: "auto"
            }}
            onClick={() => {
              if (!updateLoading) setShowUpdateModal(false);
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "30px",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                position: "relative",
                margin: "20px 0"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px"
              }}>
                <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b", fontWeight: 700 }}>
                  Update Profile
                </h2>
                <button
                  onClick={() => {
                    if (!updateLoading) setShowUpdateModal(false);
                  }}
                  disabled={updateLoading}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: updateLoading ? "not-allowed" : "pointer",
                    color: "#64748b",
                    padding: "4px 8px",
                    lineHeight: 1
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                      Gender
                    </label>
                    <input
                      type="text"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      placeholder="Male/Female/Other"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                    Location
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <input
                      type="text"
                      name="location.city"
                      value={form.location.city}
                      onChange={handleChange}
                      placeholder="City"
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      name="location.state"
                      value={form.location.state}
                      onChange={handleChange}
                      placeholder="State"
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      name="location.country"
                      value={form.location.country}
                      onChange={handleChange}
                      placeholder="Country"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="Java, Python, React"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                      Experience Years
                    </label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={form.experienceYears}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                      Highest Qualification
                    </label>
                    <input
                      type="text"
                      name="highestQualification"
                      value={form.highestQualification}
                      onChange={handleChange}
                      placeholder="B.Tech, MCA, etc."
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                    Current Job Role
                  </label>
                  <input
                    type="text"
                    name="currentJobRole"
                    value={form.currentJobRole}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                      Expected Salary
                    </label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={form.expectedSalary}
                      onChange={handleChange}
                      placeholder="₹8 LPA – ₹12 LPA"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                      City Preference
                    </label>
                    <input
                      type="text"
                      name="cityPreference"
                      value={form.cityPreference}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={inputStyle}
                  />
                  {files.profileImage && (
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#10b981" }}>
                      Selected: {files.profileImage.name}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                    Resume
                  </label>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={inputStyle}
                  />
                  {files.resume && (
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#10b981" }}>
                      Selected: {files.resume.name}
                    </p>
                  )}
                </div>
              </div>

              <div style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                marginTop: "24px"
              }}>
                <button
                  onClick={() => {
                    if (!updateLoading) setShowUpdateModal(false);
                  }}
                  disabled={updateLoading}
                  style={{
                    padding: "12px 24px",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "8px",
                    cursor: updateLoading ? "not-allowed" : "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    opacity: updateLoading ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updateLoading || !form.name.trim() || !form.email.trim() || !form.mobileNumber.trim()}
                  style={{
                    padding: "12px 24px",
                    background: updateLoading || !form.name.trim() || !form.email.trim() || !form.mobileNumber.trim() ? "#9ca3af" : "#4f46e5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: updateLoading || !form.name.trim() || !form.email.trim() || !form.mobileNumber.trim() ? "not-allowed" : "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (!updateLoading && form.name.trim() && form.email.trim() && form.mobileNumber.trim()) {
                      e.target.style.background = "#4338ca";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!updateLoading && form.name.trim() && form.email.trim() && form.mobileNumber.trim()) {
                      e.target.style.background = "#4f46e5";
                    }
                  }}
                >
                  {updateLoading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.95rem",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s"
};

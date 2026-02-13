


import React, { useEffect, useState } from "react";
import axios from "axios";
import Config from "./config/config";

export default function DashboardHome() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobileNumber: "",
        companyName: "",
        age: "",
        state: "",
        country: "",
        designation: "",
        // Note: id, companyId, and profileImageUrl are handled separately
    });
    const [files, setFiles] = useState({
        profileImage: null,
        idCard: null,
    });

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(
                `${Config.BACKEND_URL}/recruiter/get`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            // Backend returns RecruiterResponse with: id, name, email, mobileNumber, 
            // companyId, companyName, profileImageUrl, state, country, age
            setProfile(res.data);
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            alert("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdateClick = () => {
        if (!profile) return;
        
        // Prefill form with existing profile data from backend response
        // Backend sends: id, name, email, mobileNumber, companyId, companyName, 
        // profileImageUrl, state, country, age
        setForm({
            name: profile.name || "",
            email: profile.email || "",
            mobileNumber: profile.mobileNumber || "",
            companyName: profile.companyName || "",
            age: profile.age?.toString() || "",
            state: profile.state || "",
            country: profile.country || "",
            designation: profile.designation || "", // May not be in response, but keep for form
        });
        setFiles({ profileImage: null, idCard: null });
        setShowUpdateModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
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
            formData.append("companyName", form.companyName || "");
            formData.append("age", form.age ? parseInt(form.age) : "");
            formData.append("state", form.state || "");
            formData.append("country", form.country || "");
            formData.append("designation", form.designation || "");

            if (files.profileImage) {
                formData.append("profileImage", files.profileImage);
            }
            // Backend expects @RequestPart(value = "resume") for idCard file
            if (files.idCard) {
                formData.append("resume", files.idCard);
            }

            const res = await axios.put(`${Config.BACKEND_URL}/recruiter/update`, formData, {
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
                localStorage.setItem("hrName", res.data.name);
            }

            alert("Profile updated successfully!");
            setShowUpdateModal(false);
            // Refresh profile data
            await fetchProfile();
        } catch (err) {
            console.error("Error updating profile:", err);
            alert(err.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={center}>
                <h2>Loading profile...</h2>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={center}>
                <h2>No profile data available</h2>
            </div>
        );
    }

    // ✅ Correct backend image URL
    // Change this part:
    const profileImageUrl = profile.profileImageUrl
        ? `${Config.BACKEND_URL}${profile.profileImageUrl}` // Use BACKEND_URL
        : null;

    // Remove the console logs or fix them to match:
    console.log("Final image URL:", profileImageUrl);

    return (
        <div style={container}>
            <div style={card}>
                {/* HEADER */}
                <div style={header}>
                    <div style={avatarWrapper}>
                        {profileImageUrl ? (
                            <img
                                src={profileImageUrl}
                                alt="Profile"
                                style={avatar}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = "none";
                                }}
                            />
                        ) : (
                            <div style={avatarPlaceholder}>
                                {profile.name?.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 style={{ margin: 0 }}>
                            Hello {profile.name} 👋
                        </h1>
                        <p style={subText}>
                            {profile.companyName || "No company assigned"}
                        </p>
                    </div>
                </div>

                {/* INFO GRID */}
                <div style={infoGrid}>
                    <InfoItem label="Email: " value={profile.email} />
                    <InfoItem label="Phone: " value={profile.mobileNumber} />
                    <InfoItem label="Company ID: " value={profile.companyId} />
                    <InfoItem label="Recruiter ID: " value={profile.id} />
                </div>

                {/* OVERVIEW */}
                <div style={overviewBox}>
                    <h3>Dashboard Overview</h3>
                    <p>
                        Welcome to the HR panel. Here you can manage candidates,
                        jobs, and your company profile.
                    </p>
                </div>

                {/* UPDATE BUTTON */}
                <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
                    <button
                        onClick={handleUpdateClick}
                        style={{
                            padding: "12px 24px",
                            background: "#4f46e5",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.95rem",
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

                                <div>
                                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={form.companyName}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
                                            min="18"
                                            max="100"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                                            Designation
                                        </label>
                                        <input
                                            type="text"
                                            name="designation"
                                            value={form.designation}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={form.country}
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
                                        style={fileInputStyle}
                                    />
                                    {files.profileImage && (
                                        <p style={{ margin: "8px 0 0", fontSize: "0.85rem", color: "#10b981" }}>
                                            Selected: {files.profileImage.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                                        ID Card
                                    </label>
                                    <input
                                        type="file"
                                        name="idCard"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        style={fileInputStyle}
                                    />
                                    {files.idCard && (
                                        <p style={{ margin: "8px 0 0", fontSize: "0.85rem", color: "#10b981" }}>
                                            Selected: {files.idCard.name}
                                        </p>
                                    )}
                                </div>

                                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                                    <button
                                        onClick={() => {
                                            if (!updateLoading) setShowUpdateModal(false);
                                        }}
                                        disabled={updateLoading}
                                        style={{
                                            flex: 1,
                                            padding: "12px",
                                            background: "#e2e8f0",
                                            color: "#475569",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            cursor: updateLoading ? "not-allowed" : "pointer",
                                            fontWeight: 500
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={updateLoading}
                                        style={{
                                            flex: 1,
                                            padding: "12px",
                                            background: updateLoading ? "#9ca3af" : "#4f46e5",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            cursor: updateLoading ? "not-allowed" : "pointer",
                                            fontWeight: 500,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px"
                                        }}
                                    >
                                        {updateLoading ? (
                                            <>
                                                <div
                                                    style={{
                                                        width: "16px",
                                                        height: "16px",
                                                        border: "2px solid #fff",
                                                        borderTopColor: "transparent",
                                                        borderRadius: "50%",
                                                        animation: "spin 0.6s linear infinite"
                                                    }}
                                                ></div>
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Profile"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </>
            )}
        </div>
    );
}

/* INFO ITEM COMPONENT */
function InfoItem({ label, value }) {
    return (
        <div style={infoItem}>
            <span style={infoLabel}>{label}</span>
            <span style={infoValue}>{value || "-"}</span>
        </div>
    );
}

/* STYLES */

const container = {
    padding: 30,
    minHeight: "100vh",
    background: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start"
};

const card = {
    background: "white",
    borderRadius: 14,
    padding: 30,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: 850
};

const header = {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 30
};

const avatarWrapper = {
    width: 80,
    height: 80
};

const avatar = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #e5e7eb"
};

const avatarPlaceholder = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#6366f1",
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const subText = {
    margin: 0,
    color: "#6b7280"
};

const infoGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 30
};

const infoItem = {
    background: "#f9fafb",
    padding: 15,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column"
};

const infoLabel = {
    fontSize: 12,
    color: "#6b7280"
};

const infoValue = {
    fontSize: 16,
    fontWeight: 600
};

const overviewBox = {
    padding: 20,
    background: "#f3f4f6",
    borderRadius: 10
};

const center = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.2s"
};

const fileInputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#f9fafb",
    cursor: "pointer"
};

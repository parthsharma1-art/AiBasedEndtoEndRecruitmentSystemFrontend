// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Config from "./config/config";

// export default function DashboardHome() {
//     const [profile, setProfile] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Fetch recruiter profile from backend
//     const fetchProfile = async () => {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             alert("Please login first");
//             setLoading(false);
//             return;
//         }

//         try {
//             const res = await axios.get(`${Config.BACKEND_URL}/recruiter/get`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             setProfile(res.data); // expected RecruiterResponse
//         } catch (err) {
//             console.error("Failed to fetch profile:", err.response || err);
//             alert("Failed to load profile");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchProfile();
//     }, []);

//     if (loading) {
//         return (
//             <div style={center}>
//                 <h2>Loading profile...</h2>
//             </div>
//         );
//     }

//     if (!profile) {
//         return (
//             <div style={center}>
//                 <h2>No profile data available</h2>
//             </div>
//         );
//     }

//     return (
//         <div style={container}>
//             <div style={card}>
//                 <h1>Hello {profile.name} 👋</h1>

//                 <div style={infoBox}>
//                     <p><b>Email:</b> {profile.email}</p>
//                     <p><b>Phone:</b> {profile.mobileNumber}</p>
//                     <p><b>Company ID:</b> {profile.companyId}</p>
//                     <p><b>Company Name:</b> {profile.companyName}</p>
//                     <p><b>Recruiter ID:</b> {profile.id}</p>
//                 </div>

//                 <div style={overviewBox}>
//                     <h3>Dashboard Overview</h3>
//                     <p>Welcome to the HR panel. Here you can manage candidates, jobs, and your company profile.</p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// /* CONTAINER STYLES */
// const container = {
//     flex: 1,
//     padding: 30,
//     minHeight: "100%",
//     background: "#f3f4f6",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "flex-start",
//     overflow: "hidden",
//     boxSizing: "border-box"
// };

// /* CARD STYLES */
// const card = {
//     background: "white",
//     borderRadius: 12,
//     padding: 30,
//     boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//     width: "100%",
//     maxWidth: 800,
//     boxSizing: "border-box"
// };

// /* INFO BOX */
// const infoBox = {
//     marginTop: 20,
//     lineHeight: "35px"
// };

// /* OVERVIEW BOX */
// const overviewBox = {
//     marginTop: 40
// };

// /* CENTER LOADING */
// const center = {
//     flex: 1,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "50vh"
// };


import React, { useEffect, useState } from "react";
import axios from "axios";
import Config from "./config/config";

export default function DashboardHome() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    <InfoItem label="Email" value={profile.email} />
                    <InfoItem label="Phone" value={profile.mobileNumber} />
                    <InfoItem label="Company ID" value={profile.companyId} />
                    <InfoItem label="Recruiter ID" value={profile.id} />
                </div>

                {/* OVERVIEW */}
                <div style={overviewBox}>
                    <h3>Dashboard Overview</h3>
                    <p>
                        Welcome to the HR panel. Here you can manage candidates,
                        jobs, and your company profile.
                    </p>
                </div>
            </div>
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

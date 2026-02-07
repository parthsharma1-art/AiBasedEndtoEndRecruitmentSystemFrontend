// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function Sidebar() {
//     const navigate = useNavigate();

//     const items = [
//         { name: "Dashboard", path: "/dashboard" },
//         { name: "Candidates", path: "/dashboard/candidates" },
//         { name: "Company", path: "/dashboard/company" },
//         { name: "Jobs", path: "/dashboard/jobs" },
//     ];

//     return (
//         <div style={sidebar}>
//             <h2 style={{ marginBottom: 30 }}>HR Panel</h2>
//             {items.map((item) => (
//                 <div
//                     key={item.name}
//                     style={itemStyle}
//                     onClick={() => navigate(item.path)}
//                 >
//                     {item.name}
//                 </div>
//             ))}
//         </div>
//     );
// }

// /* Styles */
// const sidebar = {
//     width: 240,
//     background: "#0f172a",
//     color: "white",
//     height: "100vh",
//     padding: 20,
// };

// const itemStyle = {
//     padding: "14px 0",
//     borderBottom: "1px solid #1f2937",
//     cursor: "pointer",
// };



// import React from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Config from "./config/config";

// export default function Sidebar() {
//     const navigate = useNavigate();

//     // Logout handler
//     const handleLogout = async () => {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             alert("You are already logged out");
//             navigate("/");
//             return;
//         }

//         try {
//             const res = await axios.post(
//                 `${Config.BACKEND_URL}/recruiter/logout`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (res.data.success) {
//                 localStorage.removeItem("token"); // remove token
//                 navigate("/"); // redirect to home page
//             } else {
//                 alert("Logout failed. Try again.");
//             }
//         } catch (err) {
//             console.error("Logout error:", err.response || err);
//             alert("Logout failed. Try again.");
//         }
//     };

//     return (
//         <div style={sidebar}>
//             {/* MAIN MENU */}
//             <div>
//                 <h2 style={{ marginBottom: 30 }}>HR Panel</h2>

//                 <div style={item} onClick={() => navigate("/dashboard")}>
//                     Dashboard
//                 </div>

//                 <div style={item} onClick={() => navigate("/dashboard/overview")}>
//                     Overview
//                 </div>

//                 <div style={item} onClick={() => navigate("/dashboard/candidates")}>
//                     Candidates
//                 </div>

//                 <div style={item} onClick={() => navigate("/dashboard/company")}>
//                     Company
//                 </div>

//                 <div style={item} onClick={() => navigate("/dashboard/jobs")}>
//                     Jobs
//                 </div>
//             </div>

//             {/* LOGOUT BUTTON */}
//             <div style={logoutContainer}>
//                 <button onClick={handleLogout} style={logoutBtn}>
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// }

// /* STYLES */
// const sidebar = {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between", // push logout to bottom
//     width: 240,
//     background: "#0f172a",
//     color: "white",
//     height: "100vh",
//     padding: 20,
//     boxSizing: "border-box"
// };

// const item = {
//     padding: "14px 0",
//     borderBottom: "1px solid #1f2937",
//     cursor: "pointer"
// };

// const logoutContainer = {
//     textAlign: "center"
// };

// const logoutBtn = {
//     padding: "8px 16px",       // thin button
//     background: "#ef4444",     // red color
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//     width: "100%",
//     fontWeight: "bold"
// };

import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "./config/config";

export default function Sidebar() {
    const navigate = useNavigate();

    // Logout handler
    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are already logged out");
            navigate("/", { replace: true });
            return;
        }

        try {
            const res = await axios.post(
                `${Config.BACKEND_URL}/recruiter/logout`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data === true || res.data.success === true) {
                localStorage.clear(); // remove all stored HR info
                navigate("/", { replace: true });
            } else {
                alert("Logout failed. Try again.");
            }
        } catch (err) {
            console.error("Logout error:", err.response || err);
            alert("Logout failed. Try again.");
        }
    };

    // Profile handler
    const handleProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first");
            navigate("/", { replace: true });
            return;
        }

        try {
            const res = await axios.get(`${Config.BACKEND_URL}/profile/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data) {
                // Store or use data as needed
                console.log("Profile data:", res.data);
                alert(`Hello ${res.data.basicSetting?.companyName || "User"}!`);
            } else {
                alert("Failed to fetch profile data");
            }
        } catch (err) {
            console.error("Profile fetch error:", err.response || err);
            alert("Failed to fetch profile data");
        }
    };

    return (
        <div style={sidebar}>
            {/* MAIN MENU */}
            <div>
                <h2 style={{ marginBottom: 30 }}>HR Panel</h2>

                <div style={item} onClick={() => navigate("/dashboard/overview")}>
                    Overview
                </div>

                <div style={item} onClick={() => navigate("/dashboard/candidates")}>
                    Candidates
                </div>

                <div style={item} onClick={() => navigate("/dashboard/company")}>
                    Company
                </div>

                <div style={item} onClick={() => navigate("/dashboard/jobs")}>
                    Jobs
                </div>
            </div>

            {/* PROFILE & LOGOUT BUTTONS */}
            <div>
                <button onClick={() => navigate("/dashboard")} style={profileBtn} >
                    Profile
                </button>
                <button onClick={handleLogout} style={logoutBtn}>
                    Logout
                </button>
            </div>
        </div>
    );
}

/* STYLES */
const sidebar = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: 240,
    background: "#0f172a",
    color: "white",
    height: "100vh",
    padding: 20,
    boxSizing: "border-box"
};

const item = {
    padding: "14px 0",
    borderBottom: "1px solid #1f2937",
    cursor: "pointer"
};

const profileBtn = {
    padding: "8px 16px",
    background: "#4f46e5", // blue button
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    width: "100%",
    marginBottom: 10,
    fontWeight: "bold"
};

const logoutBtn = {
    padding: "8px 16px",
    background: "#ef4444", // red logout
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold"
};

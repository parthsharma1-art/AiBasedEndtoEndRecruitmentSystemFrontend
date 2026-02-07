// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Config from "./config/config";

// export default function AuthCheck({ children }) {
//     const navigate = useNavigate();

//     useEffect(() => {
//         checkAuth();
//     }, []);

//     const checkAuth = async () => {
//         const token = localStorage.getItem("token");

//         if (!token) {
//             navigate("/recruiter-auth");
//             return;
//         }

//         try {
//             const res = await fetch(
//                 Config.BACKEND_URL + "/profile/me",   // create this API if not exists
//                 {
//                     headers: {
//                         Authorization: "Bearer " + token,
//                     },
//                 }
//             );

//             if (!res.ok) {
//                 throw new Error("Token invalid");
//             }

//             console.log("User still logged in");

//         } catch (err) {
//             console.log("Session expired");
//             localStorage.removeItem("token");
//             navigate("/recruiter-auth");
//         }
//     };

//     return children;
// }


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CONFIG, { getApiUrl } from "./config/config";

export default function AuthCheck({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/recruiter-auth");
      return;
    }

    try {
      // Use getApiUrl to build full backend URL
      const res = await fetch(getApiUrl("/profile/me"), {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        throw new Error("Token invalid or expired");
      }

      console.log("User still logged in");
    } catch (err) {
      console.log("Session expired:", err.message);
      localStorage.removeItem("token");
      navigate("/recruiter-auth");
    }
  };

  return children;
}

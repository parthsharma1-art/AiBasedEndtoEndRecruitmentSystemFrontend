import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Config from "./config/config";

export default function AuthCheck({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/recruiter-auth");
            return;
        }

        try {
            const res = await fetch(
                Config.BACKEND_URL + "/profile/me",   // create this API if not exists
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Token invalid");
            }

            console.log("User still logged in");

        } catch (err) {
            console.log("Session expired");
            localStorage.removeItem("token");
            navigate("/recruiter-auth");
        }
    };

    return children;
}

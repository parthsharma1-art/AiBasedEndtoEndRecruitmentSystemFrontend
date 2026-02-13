import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleSuccess() {
    const nav = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get("token");
        const id = params.get("id");

        // If token already stored, go to dashboard
        const existingToken = localStorage.getItem("token");
        if (existingToken) {
            nav("/dashboard");
            return;
        }

        console.log("Google login success:", tokenFromUrl, id);

        if (tokenFromUrl) {
            localStorage.setItem("token", tokenFromUrl);
            localStorage.setItem("hrId", id);
            // Store login timestamp for 4-hour session check
            localStorage.setItem("loginTimestamp", Date.now().toString());

            // redirect to dashboard
            nav("/dashboard");
        } else {
            nav("/");
        }
    }, [nav]);

    return <h2 style={{ textAlign: "center" }}>Signing you in...</h2>;
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Config from "./config/config";

const API = Config.BACKEND_URL + "/public/profiles";

export default function Companies() {
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await axios.get(API);
            setCompanies(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            alert("Failed to load companies");
        }
    };

    const openCompany = (domain) => {
        const subdomain = domain.split(".")[0];
        navigate(`/companies/${subdomain}`);
    };

    return (
        <div style={page}>
            <h1>🏢 Companies</h1>
            <div style={grid}>
                {companies.map((c, i) => (
                    <div key={i} style={card}>
                        <h2>{c.basicSetting.companyName}</h2>
                        <p>Domain: {c.basicSetting.companyDomain}</p>
                        <p>Email: {c.contactDetails.companyEmail}</p>
                        <p>Phone: {c.contactDetails.companyMobileNumber}</p>
                        <p>Address: {c.contactDetails.companyAddress}</p>

                        <button
                            style={btn}
                            onClick={() => openCompany(c.basicSetting.companyDomain)}
                        >
                            View Company
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ====== STYLES ====== */
const page = { padding: 40, maxWidth: 1200, margin: "auto" };
const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
};
const card = {
    padding: 20,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,.1)",
};
const btn = {
    marginTop: 15,
    padding: 10,
    width: "100%",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
};

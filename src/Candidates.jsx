import React, { useEffect, useState } from "react";
import axios from "axios";
import Config from "./config/config";

const API = Config.BACKEND_URL + "/recruiter";

export default function Candidates() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API + "/candidate/get-all");
            setList(res.data);
        } catch (e) {
            console.log(e);
            alert("Failed to load candidates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    return (
        <div style={{ flex: 1, background: "#f3f4f6", height: "100vh", padding: 30 }}>
            <div style={card}>
                <h2 style={{ marginBottom: 20 }}>All Candidates</h2>

                {loading && <p>Loading candidates...</p>}

                {!loading && list.length === 0 && <p>No candidates found</p>}

                {!loading && list.map((c, index) => (
                    <div key={index} style={row}>
                        <div style={{ flex: 2 }}>
                            <b>{c.name}</b>
                            <p style={sub}>{c.email}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p><b>Experience:</b> {c.experience || 0} yrs</p>
                        </div>
                        <div style={{ flex: 1 }}>
                            <a href={c.resumeUrl} target="_blank" rel="noreferrer">View Resume</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const card = { background: "white", borderRadius: 12, padding: 25, boxShadow: "0 10px 25px rgba(0,0,0,.1)" };
const row = { display: "flex", alignItems: "center", padding: "15px 10px", borderBottom: "1px solid #eee" };
const sub = { margin: 0, fontSize: 13, color: "gray" };

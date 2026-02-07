import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8081/api";
const API_PROFILE = `${API_BASE}/profile`;
const API_CREATE = `${API_BASE}/profile/update`;

export default function Company() {
    const [form, setForm] = useState({
        companyName: "",
        companyDomain: "",
        companyEmail: "",
        companyMobileNumber: "",
        companyAddress: "",
        facebook: "",
        instagram: "",
        google: "",
        twitter: ""
    });

    const [originalForm, setOriginalForm] = useState(form);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    // Get JWT token from localStorage
    const getToken = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("JWT token not found, please login again.");
            return null;
        }
        return token;
    };

    // Handle input changes
    const handle = (e) => {
        const updatedForm = { ...form, [e.target.name]: e.target.value };
        setForm(updatedForm);
        setIsChanged(JSON.stringify(updatedForm) !== JSON.stringify(originalForm));
    };

    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = getToken();
                if (!token) return;

                const res = await axios.get(`${API_PROFILE}/details`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data) {
                    const { basicSetting, contactDetails, socialLinks } = res.data;
                    const loadedForm = {
                        companyName: basicSetting?.companyName || "",
                        companyDomain: basicSetting?.companyDomain || "",
                        companyEmail: contactDetails?.companyEmail || "",
                        companyMobileNumber: contactDetails?.companyMobileNumber || "",
                        companyAddress: contactDetails?.companyAddress || "",
                        facebook: socialLinks?.facebook || "",
                        instagram: socialLinks?.instagram || "",
                        google: socialLinks?.google || "",
                        twitter: socialLinks?.twitter || ""
                    };
                    setForm(loadedForm);
                    setOriginalForm(loadedForm);
                    setDataLoaded(true);
                }
            } catch (err) {
                console.error("Error fetching profile:", err.response || err);
            }
        };

        fetchProfile();
    }, []);

    // Save or Update
    const saveOrUpdateCompany = async () => {
        try {
            const token = getToken();
            if (!token) return;

            const payload = {
                basicSetting: {
                    companyName: form.companyName,
                    companyDomain: form.companyDomain
                },
                contactDetails: {
                    companyEmail: form.companyEmail,
                    companyMobileNumber: form.companyMobileNumber,
                    companyAddress: form.companyAddress
                },
                socialLinks: {
                    facebook: form.facebook,
                    instagram: form.instagram,
                    google: form.google,
                    twitter: form.twitter
                }
            };

            if (dataLoaded) {
                await axios.put(`${API_PROFILE}/update`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Company profile updated successfully 🚀");
            } else {
                await axios.post(
                    API_CREATE,
                    { recruiterId: localStorage.getItem("hrId"), ...payload },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Company profile created successfully 🚀");
                setDataLoaded(true);
            }

            setOriginalForm(form);
            setIsChanged(false);
        } catch (err) {
            console.error("Error saving profile:", err.response || err);
            alert("Error saving profile");
        }
    };

    return (
        <div style={{ flex: 1, background: "#f3f4f6", height: "100vh", padding: 30 }}>
            <div style={card}>
                <h2 style={{ marginBottom: 20 }}>Company Profile</h2>

                <Section title="Basic Settings">
                    <input name="companyName" placeholder="Company Name" style={inp} value={form.companyName} onChange={handle} />
                    <input name="companyDomain" placeholder="Company Domain" style={inp} value={form.companyDomain} onChange={handle} />
                </Section>

                <Section title="Contact Details">
                    <input name="companyEmail" placeholder="Company Email" style={inp} value={form.companyEmail} onChange={handle} />
                    <input name="companyMobileNumber" placeholder="Company Phone" style={inp} value={form.companyMobileNumber} onChange={handle} />
                    <input name="companyAddress" placeholder="Company Address" style={inp} value={form.companyAddress} onChange={handle} />
                </Section>

                <Section title="Social Links">
                    <input name="facebook" placeholder="Facebook" style={inp} value={form.facebook} onChange={handle} />
                    <input name="instagram" placeholder="Instagram" style={inp} value={form.instagram} onChange={handle} />
                    <input name="google" placeholder="Google" style={inp} value={form.google} onChange={handle} />
                    <input name="twitter" placeholder="Twitter" style={inp} value={form.twitter} onChange={handle} />
                </Section>

                <button
                    onClick={saveOrUpdateCompany}
                    disabled={!isChanged}
                    style={{
                        ...btn,
                        background: isChanged ? "#4f46e5" : "#9ca3af",
                        cursor: isChanged ? "pointer" : "not-allowed",
                        opacity: isChanged ? 1 : 0.6
                    }}
                >
                    {dataLoaded ? "Save Changes" : "Create Company Profile"}
                </button>

            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: 30 }}>
            <h3 style={{ marginBottom: 10, color: "#4f46e5" }}>{title}</h3>
            {children}
        </div>
    );
}

const card = { background: "white", borderRadius: 12, padding: 30, boxShadow: "0 10px 25px rgba(0,0,0,.1)", maxWidth: 700 };
const inp = { width: "100%", padding: 12, marginTop: 10, border: "1px solid #ddd", borderRadius: 8 };
const btn = { marginTop: 20, padding: 14, width: "100%", background: "#4f46e5", color: "white", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" };

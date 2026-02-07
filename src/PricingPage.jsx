import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PricingPage() {
    const navigate = useNavigate();
    const [isYearly, setIsYearly] = useState(false);

    const plans = [
        {
            name: "Basic",
            monthly: 499,
            yearly: 3999,
            features: ["Post 5 Jobs", "Basic AI Screening", "Email Support"]
        },
        {
            name: "Pro",
            monthly: 999,
            yearly: 7999,
            features: ["Unlimited Jobs", "Advanced AI Matching", "Priority Support"]
        },
        {
            name: "Enterprise",
            monthly: 1999,
            yearly: 15999,
            features: ["Unlimited Everything", "Full AI Automation", "Dedicated Manager"]
        }
    ];

    return (
        <div style={{ fontFamily: "Arial", background: "#0f172a", minHeight: "100vh", color: "white" }}>

            {/* HEADER */}
            <div style={header}>
                <h2 style={{ color: "#6366f1" }}>AI Recruitment Pricing</h2>
                <button onClick={() => navigate("/")} style={backBtn}>← Back Home</button>
            </div>

            {/* TOGGLE */}
            <div style={toggleContainer}>
                <span style={!isYearly ? activeText : normalText}>Monthly</span>

                <div style={toggleSwitch} onClick={() => setIsYearly(!isYearly)}>
                    <div style={{
                        ...toggleCircle,
                        marginLeft: isYearly ? 26 : 3
                    }} />
                </div>

                <span style={isYearly ? activeText : normalText}>Yearly</span>
            </div>

            {/* PRICING CARDS */}
            <div style={cardContainer}>
                {plans.map((plan, index) => (
                    <div key={index} style={card}>
                        <h3 style={{ fontSize: 24 }}>{plan.name}</h3>

                        <h1 style={{ fontSize: 40, margin: "15px 0" }}>
                            ₹ {isYearly ? plan.yearly : plan.monthly}
                            <span style={{ fontSize: 16 }}>
                                /{isYearly ? "year" : "month"}
                            </span>
                        </h1>

                        <div style={{ marginTop: 20 }}>
                            {plan.features.map((f, i) => (
                                <p key={i} style={{ margin: 8 }}>✔ {f}</p>
                            ))}
                        </div>

                        <button style={subscribeBtn}>
                            Subscribe
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* HEADER */
const header = {
    display: "flex",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center"
};

const backBtn = {
    padding: "10px 18px",
    background: "#6366f1",
    border: "none",
    borderRadius: 6,
    color: "white",
    cursor: "pointer"
};

/* TOGGLE */
const toggleContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginTop: 20
};

const toggleSwitch = {
    width: 55,
    height: 28,
    background: "#374151",
    borderRadius: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
};

const toggleCircle = {
    width: 22,
    height: 22,
    background: "white",
    borderRadius: "50%",
    transition: "0.3s"
};

const activeText = { color: "#22c55e", fontWeight: "bold" };
const normalText = { color: "#9ca3af" };

/* CARDS */
const cardContainer = {
    display: "flex",
    justifyContent: "center",
    gap: 30,
    flexWrap: "wrap",
    padding: 40
};

const card = {
    background: "#111827",
    padding: 30,
    borderRadius: 12,
    width: 260,
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
};

const subscribeBtn = {
    marginTop: 25,
    padding: "12px 20px",
    background: "#6366f1",
    border: "none",
    borderRadius: 6,
    color: "white",
    cursor: "pointer",
    fontSize: 16,
    width: "100%"
};

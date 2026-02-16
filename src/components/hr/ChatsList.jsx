import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function ChatsList() {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recruiterId, setRecruiterId] = useState(null);
    const [candidateMap, setCandidateMap] = useState({});

    useEffect(() => {
        fetchRecruiterId();
    }, []);

    useEffect(() => {
        if (recruiterId) {
            fetchChats();
        }
    }, [recruiterId]);

    const fetchRecruiterId = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const res = await axios.get(CONFIG.BACKEND_URL + "/recruiter/get", {
                headers: { Authorization: "Bearer " + token },
            });
            if (res.data && res.data.id) {
                setRecruiterId(res.data.id);
            }
        } catch (e) {
            console.error("Failed to fetch recruiter ID:", e);
        }
    };

    const fetchChats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            // Try to fetch all chats - the endpoint might return a list or single chat
            // If backend has a list endpoint, use that; otherwise use recruiterId
            let chatsData = [];
            
            try {
                // First, try to get chats using recruiterId
                const res = await axios.get(CONFIG.BACKEND_URL + `/recruiter/chats/${recruiterId}`, {
                    headers: { Authorization: "Bearer " + token },
                });

                // Handle response - could be single chat or array
                if (Array.isArray(res.data)) {
                    chatsData = res.data;
                } else if (res.data && res.data.id) {
                    // Single chat object
                    chatsData = [res.data];
                } else if (res.data && Array.isArray(res.data.chats)) {
                    // Response wrapped in an object with chats array
                    chatsData = res.data.chats;
                }
            } catch (e) {
                // If that fails, try alternative endpoint (if exists)
                console.log("Primary endpoint failed, trying alternatives...");
                // Could try: /recruiter/chats?recruiterId={id} or similar
                // For now, set empty array
                chatsData = [];
            }

            setChats(chatsData);

            // Fetch candidate names for display
            if (chatsData.length > 0) {
                const candidateIds = [...new Set(chatsData.map(chat => chat.candidateId).filter(Boolean))];
                await fetchCandidateNames(candidateIds);
            }
        } catch (e) {
            console.error("Failed to fetch chats:", e);
            setChats([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCandidateNames = async (candidateIds) => {
        if (candidateIds.length === 0) return;

        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(CONFIG.BACKEND_URL + "/recruiter/candidate/get-all", {
                headers: { Authorization: "Bearer " + token },
            });

            const candidates = Array.isArray(res.data) ? res.data : [];
            const map = {};
            candidates.forEach(candidate => {
                const id = candidate.id || candidate.candidateId;
                if (id) {
                    map[id] = candidate.name || candidate.email || `Candidate ${id}`;
                }
            });
            setCandidateMap(map);
        } catch (e) {
            console.error("Failed to fetch candidate names:", e);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateString;
        }
    };

    const getLastMessage = (chat) => {
        if (!chat.chatData || chat.chatData.length === 0) return "No messages yet";
        const lastMsg = chat.chatData[chat.chatData.length - 1];
        return lastMsg.message || "Message sent";
    };

    const openChat = (chatId) => {
        navigate(`/dashboard/chats/${chatId}`);
    };

    return (
        <div className="dashboard-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b" }}>Chats</h1>
            </div>

            {loading && <p style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading chats...</p>}

            {!loading && chats.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
                    <p>No chats found. Start a conversation with a candidate!</p>
                </div>
            )}

            {!loading && chats.length > 0 && (
                <div className="chats-list-container">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className="chat-item"
                            onClick={() => openChat(chat.id)}
                        >
                            <div className="chat-item-header">
                                <div className="chat-item-info">
                                    <h3 className="chat-item-title">
                                        {candidateMap[chat.candidateId] || `Candidate ${chat.candidateId}`}
                                    </h3>
                                    <span className="chat-item-meta">
                                        {formatDate(chat.updateAt || chat.createdAt)}
                                    </span>
                                </div>
                                {chat.chatData && chat.chatData.length > 0 && (
                                    <span className="chat-item-badge">{chat.chatData.length}</span>
                                )}
                            </div>
                            <p className="chat-item-preview">{getLastMessage(chat)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../../config/config";
import "../../styles/dashboard.css";

export default function ChatDetail() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [recruiterId, setRecruiterId] = useState(null);
    const [candidateName, setCandidateName] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchRecruiterId();
        if (chatId) {
            fetchChat();
        }
    }, [chatId]);

    useEffect(() => {
        // Auto-scroll to bottom when messages change
        scrollToBottom();
    }, [chat?.chatData]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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

    const fetchChat = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get(CONFIG.BACKEND_URL + `/recruiter/chats/${chatId}`, {
                headers: { Authorization: "Bearer " + token },
            });

            setChat(res.data);

            // Fetch candidate name
            if (res.data.candidateId) {
                fetchCandidateName(res.data.candidateId);
            }
        } catch (e) {
            console.error("Failed to fetch chat:", e);
            alert("Failed to load chat");
        } finally {
            setLoading(false);
        }
    };

    const fetchCandidateName = async (candidateId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(CONFIG.BACKEND_URL + `/recruiter/candidate/${candidateId}`, {
                headers: { Authorization: "Bearer " + token },
            });
            if (res.data) {
                setCandidateName(res.data.name || res.data.email || `Candidate ${candidateId}`);
            }
        } catch (e) {
            console.error("Failed to fetch candidate name:", e);
            setCandidateName(`Candidate ${candidateId}`);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !recruiterId || !chat) return;

        try {
            setSending(true);
            const token = localStorage.getItem("token");
            const res = await axios.post(
                CONFIG.BACKEND_URL + "/recruiter/chats",
                {
                    recruiterId: recruiterId,
                    candidateId: chat.candidateId,
                    message: newMessage.trim(),
                },
                {
                    headers: { Authorization: "Bearer " + token },
                }
            );

            // Refresh chat to get updated messages
            await fetchChat();
            setNewMessage("");
        } catch (e) {
            console.error("Failed to send message:", e);
            const errorMsg = e.response?.data?.message || e.message || "Failed to send message";
            alert(errorMsg);
        } finally {
            setSending(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="dashboard-content">
                <p style={{ textAlign: "center", padding: 40 }}>Loading chat...</p>
            </div>
        );
    }

    if (!chat) {
        return (
            <div className="dashboard-content">
                <p style={{ textAlign: "center", padding: 40 }}>Chat not found</p>
            </div>
        );
    }

    return (
        <div className="chat-detail-container">
            <div className="chat-detail-header">
                <button
                    type="button"
                    className="btn-back-to-chats"
                    onClick={() => navigate("/dashboard/chats")}
                >
                    ← Back to Chats
                </button>
                <h2 className="chat-detail-title">
                    Chat with {candidateName || `Candidate ${chat.candidateId}`}
                </h2>
            </div>

            <div className="chat-messages-container">
                {chat.chatData && chat.chatData.length > 0 ? (
                    chat.chatData.map((msg, index) => {
                        const isRecruiter = msg.source === "RECRUITER";
                        return (
                            <div
                                key={msg.messageId || index}
                                className={`chat-message ${isRecruiter ? "chat-message-sent" : "chat-message-received"}`}
                            >
                                <div className="chat-message-content">
                                    {msg.message && <p className="chat-message-text">{msg.message}</p>}
                                    <span className="chat-message-time">
                                        {formatDate(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="chat-empty-state">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                <textarea
                    className="chat-input-textarea"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    rows={3}
                    disabled={sending}
                />
                <button
                    type="button"
                    className="btn-chat-send"
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                >
                    {sending ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
}

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import CONFIG from "../../config/config";
import { getCandidateChatsCache, setCandidateChatsCache } from "../../utils/chatsCache";
import "../../styles/dashboard.css";

const FILE_BASE = CONFIG.BACKEND_URL + "/file";

const PersonIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

export default function CandidateChatsView() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [candidateId, setCandidateId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const isOnChatsPage = location.pathname.includes("/chats");

    // Emoji mapping with IDs
    const emojis = [
        { emoji: '❤️', id: 'heart' },
        { emoji: '😊', id: 'smile' },
        { emoji: '😄', id: 'big_smile' },
        { emoji: '😂', id: 'laugh' },
        { emoji: '👍', id: 'thumbs_up' },
        { emoji: '🎉', id: 'celebration' }
    ];

    useEffect(() => {
        if (!isOnChatsPage) return;
        const cached = getCandidateChatsCache();
        if (Array.isArray(cached) && cached.length >= 0) setChats(cached);
        fetchCandidateId();
        fetchChats(true); // Initial load when on chats page
    }, [isOnChatsPage]);

    // When on chats tab: poll every 3s; when not on tab, dashboard polls every 30s
    useEffect(() => {
        if (!isOnChatsPage) return;
        const interval = setInterval(() => fetchChats(false), 3000);
        return () => clearInterval(interval);
    }, [isOnChatsPage]);

    useEffect(() => {
        if (chatId && chats.length > 0) {
            const chat = chats.find(c => c.chatId === chatId || c.chat?.id === chatId);
            if (chat) {
                setSelectedChat(chat);
            }
        }
        // Removed auto-selection - only open chat when user clicks
    }, [chatId, chats]);

    useEffect(() => {
        scrollToBottom();
    }, [selectedChat?.chat?.chatData]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchCandidateId = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const res = await axios.get(CONFIG.BACKEND_URL + "/candidate/get", {
                headers: { Authorization: "Bearer " + token },
            });
            if (res.data && res.data.id) {
                setCandidateId(res.data.id);
            }
        } catch (e) {
            console.error("Failed to fetch candidate ID:", e);
        }
    };

    const fetchChats = async (isInitialLoad = false) => {
        try {
            // Only show loading spinner on initial load
            if (isInitialLoad) {
                setLoading(true);
            }
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get(CONFIG.BACKEND_URL + "/candidate/chats", {
                headers: { Authorization: "Bearer " + token },
            });

            // Handle ChatResponse array
            const chatsData = Array.isArray(res.data) ? res.data : [];
            setChats(chatsData);
            setCandidateChatsCache(chatsData);

            // If there's a selected chat, update it with latest data
            if (selectedChat) {
                const updatedChat = chatsData.find(c => 
                    c.chatId === selectedChat.chatId || 
                    c.chatId === chatId ||
                    c.chat?.id === selectedChat.chat?.id ||
                    c.chat?.id === chatId
                );
                if (updatedChat) {
                    setSelectedChat(updatedChat);
                }
            } else if (chatId) {
                // If there's a chatId in URL but no selected chat, select it
                const chat = chatsData.find(c => c.chatId === chatId || c.chat?.id === chatId);
                if (chat) {
                    setSelectedChat(chat);
                }
            }
        } catch (e) {
            console.error("Failed to fetch chats:", e);
            // Don't clear chats on error during polling
            if (chats.length === 0) {
                setChats([]);
            }
        } finally {
            if (isInitialLoad) {
                setLoading(false);
            }
        }
    };

    const handleChatSelect = (chatResponse) => {
        setSelectedChat(chatResponse);
        const chatIdToUse = chatResponse.chatId || chatResponse.chat?.id;
        if (chatIdToUse) {
            navigate(`/candidate-dashboard/chats/${chatIdToUse}`);
        }
    };

    const handleSendMessage = async (emojiId = null) => {
        if ((!newMessage.trim() && !emojiId) || !candidateId || !selectedChat) return;

        try {
            setSending(true);
            const token = localStorage.getItem("token");
            
            // If emojiId is provided, send it in the message field
            const messageToSend = emojiId ? `emojiId:${emojiId}` : newMessage.trim();
            
            const res = await axios.post(
                CONFIG.BACKEND_URL + "/candidate/chats",
                {
                    recruiterId: selectedChat.recruiterResponse?.id || selectedChat.recruiterResponse?.recruiterId,
                    candidateId: candidateId,
                    message: messageToSend,
                },
                {
                    headers: { Authorization: "Bearer " + token },
                }
            );

            // Refresh chats to get updated messages
            await fetchChats();
            setNewMessage("");
            setShowEmojiPicker(false);
        } catch (e) {
            console.error("Failed to send message:", e);
            const errorMsg = e.response?.data?.message || e.message || "Failed to send message";
            alert(errorMsg);
        } finally {
            setSending(false);
        }
    };

    // Helper function to get emoji from emojiId
    const getEmojiFromId = (emojiId) => {
        const emojiData = emojis.find(e => e.id === emojiId);
        return emojiData ? emojiData.emoji : null;
    };

    // Helper function to check if message contains emojiId and extract it
    const getMessageDisplay = (message, emojiId = null) => {
        // If emojiId is provided as separate field, use it
        if (emojiId) {
            const emoji = getEmojiFromId(emojiId);
            if (emoji) return emoji;
        }
        
        // Check if message contains emojiId prefix
        if (message && message.startsWith('emojiId:')) {
            const extractedEmojiId = message.replace('emojiId:', '');
            return getEmojiFromId(extractedEmojiId) || message;
        }
        
        return message;
    };

    const handleEmojiClick = (e) => {
        e.stopPropagation();
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiSelect = (emojiData) => {
        handleSendMessage(emojiData.id);
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) return "Today";
            if (diffDays === 2) return "Yesterday";
            if (diffDays <= 7) return `${diffDays - 1} days ago`;
            
            return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
        } catch (e) {
            return dateString;
        }
    };

    const formatMessageTime = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateString;
        }
    };

    const getLastMessage = (chatResponse) => {
        if (!chatResponse.chat?.chatData || chatResponse.chat.chatData.length === 0) {
            return "No messages yet";
        }
        const lastMsg = chatResponse.chat.chatData[chatResponse.chat.chatData.length - 1];
        if (!lastMsg.message && !lastMsg.emojiId) return "Message sent";
        
        // Check if message is an emojiId or if emojiId is a separate field
        const displayMessage = getMessageDisplay(lastMsg.message, lastMsg.emojiId);
        return displayMessage || "Message sent";
    };

    const getRecruiterName = (chatResponse) => {
        return chatResponse.recruiterResponse?.name || 
               chatResponse.recruiterResponse?.email || 
               chatResponse.recruiterResponse?.companyName ||
               `Recruiter ${chatResponse.recruiterResponse?.id || chatResponse.recruiterResponse?.recruiterId || ""}`;
    };

    const getRecruiterImage = (chatResponse) => {
        const imageId = chatResponse.recruiterResponse?.profileImageId || chatResponse.recruiterResponse?.profileImageUrl;
        return imageId ? `${FILE_BASE}/${imageId}` : null;
    };

    const filteredChats = chats.filter(chat => {
        if (!searchQuery.trim()) return true;
        const name = getRecruiterName(chat).toLowerCase();
        const query = searchQuery.toLowerCase().trim();
        return name.includes(query);
    });

    return (
        <div className="chats-view-container">
            {/* Left Sidebar - Chat List */}
            <div className="chats-sidebar">
                <div className="chats-sidebar-header">
                    <h3 className="chats-sidebar-title">Chats</h3>
                    <div className="chats-search-wrapper">
                        <input
                            type="text"
                            className="chats-search-input"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg className="chats-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>
                </div>

                <div className="chats-list-scrollable">
                    {loading && (
                        <div className="chats-loading">
                            <p>Loading chats...</p>
                        </div>
                    )}

                    {!loading && filteredChats.length === 0 && (
                        <div className="chats-empty">
                            <p>
                                {searchQuery.trim() 
                                    ? `No recruiters found matching "${searchQuery}"` 
                                    : "No chats found. Start a conversation with a recruiter!"}
                            </p>
                        </div>
                    )}

                    {!loading && filteredChats.map((chatResponse) => {
                        const isSelected = selectedChat?.chatId === chatResponse.chatId;
                        const recruiterName = getRecruiterName(chatResponse);
                        const recruiterImage = getRecruiterImage(chatResponse);
                        const lastMessage = getLastMessage(chatResponse);
                        const chat = chatResponse.chat;
                        const lastUpdate = chat?.updateAt || chat?.createdAt;

                        return (
                            <div
                                key={chatResponse.chatId}
                                className={`chat-list-item ${isSelected ? "chat-list-item-selected" : ""}`}
                                onClick={() => handleChatSelect(chatResponse)}
                            >
                                <div className="chat-list-item-avatar">
                                    {recruiterImage ? (
                                        <img
                                            src={recruiterImage}
                                            alt={recruiterName}
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display = "flex";
                                            }}
                                        />
                                    ) : null}
                                    <div className="chat-list-item-avatar-placeholder" style={{ display: recruiterImage ? "none" : "flex" }}>
                                        <PersonIcon />
                                    </div>
                                </div>
                                <div className="chat-list-item-content">
                                    <div className="chat-list-item-header">
                                        <span className="chat-list-item-name">{recruiterName}</span>
                                        <span className="chat-list-item-date">{formatDate(lastUpdate)}</span>
                                    </div>
                                    <p className="chat-list-item-preview">{lastMessage}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Panel - Chat Detail */}
            <div className="chats-detail-panel">
                {selectedChat ? (
                    <>
                        <div className="chats-detail-header">
                            <div className="chats-detail-header-info">
                                <div className="chats-detail-header-avatar">
                                    {getRecruiterImage(selectedChat) ? (
                                        <img
                                            src={getRecruiterImage(selectedChat)}
                                            alt={getRecruiterName(selectedChat)}
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display = "flex";
                                            }}
                                        />
                                    ) : null}
                                    <div className="chats-detail-header-avatar-placeholder" style={{ display: getRecruiterImage(selectedChat) ? "none" : "flex" }}>
                                        <PersonIcon />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="chats-detail-header-name">{getRecruiterName(selectedChat)}</h3>
                                    {selectedChat.recruiterResponse?.email && (
                                        <p className="chats-detail-header-email">{selectedChat.recruiterResponse.email}</p>
                                    )}
                                    {selectedChat.recruiterResponse?.companyName && (
                                        <p className="chats-detail-header-email">{selectedChat.recruiterResponse.companyName}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="chats-messages-container">
                            {selectedChat.chat?.chatData && selectedChat.chat.chatData.length > 0 ? (
                                selectedChat.chat.chatData.map((msg, index) => {
                                    const isRecruiter = msg.source === "RECRUITER";
                                    return (
                                        <div
                                            key={msg.messageId || index}
                                            className={`chat-message ${isRecruiter ? "chat-message-received" : "chat-message-sent"}`}
                                        >
                                            <div className="chat-message-content">
                                                {(msg.message || msg.emojiId) && (
                                                    <p className={`chat-message-text ${(msg.message && msg.message.startsWith('emojiId:')) || msg.emojiId ? 'chat-message-emoji' : ''}`}>
                                                        {getMessageDisplay(msg.message, msg.emojiId)}
                                                    </p>
                                                )}
                                                <span className="chat-message-time">
                                                    {formatMessageTime(msg.createdAt)}
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

                        <div className="chats-input-container">
                            <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
                                <button 
                                    type="button"
                                    className="chats-input-emoji-btn"
                                    onClick={handleEmojiClick}
                                    title="Add emoji"
                                >
                                    😊
                                </button>
                                {showEmojiPicker && (
                                    <div className="chat-emoji-picker" onClick={(e) => e.stopPropagation()}>
                                        {emojis.map((emojiData) => (
                                            <button
                                                key={emojiData.id}
                                                type="button"
                                                className="chat-emoji-option"
                                                onClick={() => handleEmojiSelect(emojiData)}
                                                title={emojiData.id}
                                            >
                                                {emojiData.emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <textarea
                                className="chats-input-textarea"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                rows={1}
                                disabled={sending}
                            />
                            <button className="chats-input-attach-btn">📎</button>
                            <button
                                type="button"
                                className="chats-input-send-btn"
                                onClick={() => handleSendMessage()}
                                disabled={sending || !newMessage.trim()}
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="chats-detail-empty">
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}

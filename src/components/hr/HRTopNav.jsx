import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../config/config";

export default function HRTopNav({ onMenuClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [processingNotification, setProcessingNotification] = useState(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  
  // Hook for responsive design
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${Config.BACKEND_URL}/recruiter/get`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications(true);
    }
  }, [showNotifications]);

  // Poll notifications every 5s so red dot stays up to date
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchSilent = async () => {
      try {
        const response = await axios.get(`${Config.BACKEND_URL}/recruiter/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(prev => {
          const next = response.data || [];
          return Array.isArray(next) ? next : prev;
        });
      } catch {
        // keep previous state on background fetch error
      }
    };
    fetchSilent();
    const interval = setInterval(fetchSilent, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const fetchNotifications = async (showLoading = true) => {
    try {
      if (showLoading) setLoadingNotifications(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${Config.BACKEND_URL}/recruiter/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      if (showLoading) setLoadingNotifications(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Prevent multiple clicks
    if (processingNotification) return;
    
    try {
      setProcessingNotification(notification.id);
      const token = localStorage.getItem("token");
      if (!token) return;

      // Mark notification as read
      if (notification.id) {
        try {
          await axios.post(`${Config.BACKEND_URL}/recruiter/notification/${notification.id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Update local state to mark as read
          setNotifications(prev => 
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
          );
        } catch (error) {
          console.error("Failed to mark notification as read:", error);
        }
      }

      // Close notification dropdown
      setShowNotifications(false);

      // If relativeId exists, fetch the chat and navigate to it
      if (notification.relativeId) {
        try {
          const chatResponse = await axios.get(`${Config.BACKEND_URL}/recruiter/chats/${notification.relativeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Extract chat ID from response - handle different possible response structures
          const responseData = chatResponse.data;
          const chatId = responseData?.chatId || 
                        responseData?.chat?.id || 
                        responseData?.id ||
                        (responseData?.chat && (responseData.chat.id || responseData.chat.chatId));
          
          if (chatId) {
            navigate(`/dashboard/chats/${chatId}`);
          } else {
            console.warn("Chat ID not found in response:", responseData);
            // Fallback to chats page if chat ID not found
            navigate("/dashboard/chats");
          }
        } catch (error) {
          console.error("Failed to fetch chat:", error);
          // Fallback to chats page on error
          navigate("/dashboard/chats");
        }
      } else {
        // If no relativeId, just navigate to chats page
        navigate("/dashboard/chats");
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
      navigate("/dashboard/chats");
    } finally {
      setProcessingNotification(null);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    setShowDropdown(false);
    if (!token) {
      localStorage.clear();
      navigate("/");
      return;
    }
    try {
      await fetch(`${Config.BACKEND_URL}/recruiter/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {}
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="top-nav" style={{ position: "relative" }}>
      {isMobile && onMenuClick && (
        <button
          onClick={onMenuClick}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            padding: "8px",
            marginRight: "10px",
            color: "#1e293b"
          }}
        >
          ☰
        </button>
      )}
      <div 
        className="top-nav-logo" 
        onClick={() => navigate("/")}
        style={{ 
          fontSize: isMobile ? "16px" : "inherit",
          cursor: "pointer",
          userSelect: "none",
          transition: "opacity 0.2s"
        }}
        onMouseEnter={(e) => e.target.style.opacity = "0.8"}
        onMouseLeave={(e) => e.target.style.opacity = "1"}
      >
        {isMobile ? "AI Recruitment" : "AI-Based Recruitment System"}
      </div>
      <div className="top-nav-right">
        <div className="top-nav-notify-container" ref={notificationRef}>
          <div 
            className="top-nav-notify" 
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span>🔔</span>
            {unreadCount > 0 && (
              <span className="top-nav-notify-badge" aria-label={`${unreadCount} unread`}>
                {unreadCount}
              </span>
            )}
          </div>
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h4>Notifications</h4>
              </div>
              <div className="notifications-list">
                {loadingNotifications ? (
                  <div className="notifications-loading">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="notifications-empty">No notifications</div>
                ) : (
                  <table className="notifications-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Message</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map((notification) => (
                        <tr
                          key={notification.id}
                          className={`notification-row ${!notification.read ? 'unread' : ''} ${processingNotification === notification.id ? 'processing' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                          style={{ cursor: processingNotification === notification.id ? 'wait' : 'pointer' }}
                        >
                          <td className="notification-title">{notification.title || 'Notification'}</td>
                          <td className="notification-message">{notification.message || ''}</td>
                          <td className="notification-status">
                            {notification.read ? (
                              <span className="status-read">Read</span>
                            ) : (
                              <span className="status-unread">New</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="top-nav-profile">
          <button
            type="button"
            className="top-nav-profile-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>{profile?.name || "HR"}</span>
            <span>▼</span>
          </button>
          {showDropdown && (
            <>
              <div
                role="presentation"
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
                onClick={() => setShowDropdown(false)}
              />
              <div className="top-nav-dropdown">
                <button type="button" onClick={() => { setShowDropdown(false); navigate("/dashboard"); }}>
                  Dashboard
                </button>
                <button type="button" onClick={() => { setShowDropdown(false); navigate("/dashboard/profile"); }}>
                  Profile
                </button>
                <button type="button" onClick={() => { setShowDropdown(false); navigate("/dashboard/settings"); }}>
                  Settings
                </button>
                <button type="button" onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

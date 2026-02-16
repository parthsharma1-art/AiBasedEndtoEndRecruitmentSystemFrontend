import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../config/config";
import "../../styles/dashboard.css";

export default function CandidateTopNav({ onMenuClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [processingNotification, setProcessingNotification] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // When user clicks bell, open dropdown and fetch all notifications
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
        const response = await axios.get(
          `${Config.BACKEND_URL}/candidate/notifications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const list = Array.isArray(response.data) ? response.data : [];
        setNotifications(list);
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

      const response = await axios.get(
        `${Config.BACKEND_URL}/candidate/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const list = Array.isArray(response.data) ? response.data : [];
      setNotifications(list);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      if (showLoading) setLoadingNotifications(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (processingNotification) return;

    try {
      setProcessingNotification(notification.id);
      const token = localStorage.getItem("token");
      if (!token) return;

      // POST /candidate/notification/{id} - mark notification as read
      if (notification.id) {
        try {
          await axios.post(
            `${Config.BACKEND_URL}/candidate/notification/${notification.id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setNotifications(prev =>
            prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
          );
        } catch (error) {
          console.error("Failed to mark notification as read:", error);
        }
      }

      setShowNotifications(false);

      // Open chats: if relativeId present, fetch chat by id then navigate
      if (notification.relativeId) {
        try {
          const chatRes = await axios.get(
            `${Config.BACKEND_URL}/candidate/chats/${notification.relativeId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = chatRes.data;
          const chatId =
            data?.chatId ||
            data?.chat?.id ||
            data?.id ||
            (data?.chat && (data.chat.id || data.chat.chatId));
          if (chatId) {
            navigate(`/candidate-dashboard/chats/${chatId}`);
          } else {
            navigate("/candidate-dashboard/chats");
          }
        } catch (error) {
          console.error("Failed to fetch chat:", error);
          navigate("/candidate-dashboard/chats");
        }
      } else {
        navigate("/candidate-dashboard/chats");
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
      navigate("/candidate-dashboard/chats");
    } finally {
      setProcessingNotification(null);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/");
  };

  return (
    <nav className="top-nav candidate-top-nav">
      {isMobile && onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          style={{
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            padding: "8px",
            marginRight: "10px",
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ☰
        </button>
      )}
      <div
        className="top-nav-logo"
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleLogoClick(e);
          }
        }}
        style={{
          cursor: "pointer",
          userSelect: "none",
          transition: "opacity 0.2s",
          outline: "none",
          fontSize: isMobile ? "1rem" : "1.25rem",
        }}
        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
      >
        {isMobile ? "AI Recruitment" : "AI-Based Recruitment System"}
      </div>
      <div className="top-nav-right">
        <div className="top-nav-notify-container" ref={notificationRef}>
          <button
            type="button"
            className="top-nav-notify"
            title="Notifications"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <span>🔔</span>
            {unreadCount > 0 && (
              <span className="top-nav-notify-badge" aria-label={`${unreadCount} unread`}>
                {unreadCount}
              </span>
            )}
          </button>
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
                          className={`notification-row ${!notification.read ? "unread" : ""} ${processingNotification === notification.id ? "processing" : ""}`}
                          onClick={() => handleNotificationClick(notification)}
                          style={{
                            cursor:
                              processingNotification === notification.id
                                ? "wait"
                                : "pointer",
                          }}
                        >
                          <td className="notification-title">
                            {notification.title || "Notification"}
                          </td>
                          <td className="notification-message">
                            {notification.message || ""}
                          </td>
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
            <span>Profile</span>
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
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/candidate-dashboard/profile");
                  }}
                >
                  Profile
                </button>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

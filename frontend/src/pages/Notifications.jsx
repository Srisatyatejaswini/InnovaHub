import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view notifications.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Notifications error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark as read error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to mark notification as read."
      );
    }
  };

  const getIcon = (type) => {
    if (type === "collaboration") {
      return "🤝";
    }

    if (type === "idea") {
      return "💡";
    }

    if (type === "profile") {
      return "📝";
    }

    return "🔔";
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>Loading notifications...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <Link
          to="/dashboard"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to Dashboard
        </Link>

        <div style={{ marginTop: "30px" }}>
          <h1>🔔 Notifications</h1>

          <p style={{ color: "#666" }}>
            Stay updated with your InnovaHub activities.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "25px",
            }}
          >
            {error}
          </div>
        )}

        {!error && notifications.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "35px",
              borderRadius: "12px",
              marginTop: "25px",
              textAlign: "center",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "45px" }}>
              🔔
            </div>

            <h2>No notifications yet</h2>

            <p style={{ color: "#666" }}>
              You will see collaboration requests and
              other updates here.
            </p>
          </div>
        )}

        <div style={{ marginTop: "25px" }}>
          {notifications.map((notification) => (
            <div
              key={notification._id}
              style={{
                background: notification.read
                  ? "white"
                  : "#eff6ff",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.07)",
                display: "flex",
                gap: "15px",
                alignItems: "flex-start",
                borderLeft: notification.read
                  ? "4px solid transparent"
                  : "4px solid #2563eb",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "#e0ecff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                }}
              >
                {getIcon(notification.type)}
              </div>

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: "0 0 7px",
                    color: "#222",
                  }}
                >
                  {notification.title}
                </h3>

                <p
                  style={{
                    margin: "0 0 8px",
                    color: "#555",
                  }}
                >
                  {notification.message}
                </p>

                <small style={{ color: "#888" }}>
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </small>

                {!notification.read && (
                  <div style={{ marginTop: "12px" }}>
                    <button
                      onClick={() =>
                        markAsRead(notification._id)
                      }
                      style={{
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Mark as Read
                    </button>
                  </div>
                )}

                {notification.read && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#16a34a",
                      fontSize: "14px",
                    }}
                  >
                    ✓ Read
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
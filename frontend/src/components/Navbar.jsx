import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#2563eb",
        color: "white",
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      {/* LOGO */}
      <Link
        to="/dashboard"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        InnovaHub
      </Link>

      {/* NAVIGATION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
        }}
      >
        <Link
          to="/dashboard"
          style={linkStyle}
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/explore-ideas"
          style={linkStyle}
        >
          💡 Ideas
        </Link>

        <Link
          to="/my-ideas"
          style={linkStyle}
        >
          📚 My Ideas
        </Link>

        <Link
          to="/teams"
          style={linkStyle}
        >
          🤝 Teams
        </Link>

        <Link
          to="/notifications"
          style={linkStyle}
        >
          🔔 Notifications
        </Link>

        <Link
          to="/profile"
          style={linkStyle}
        >
          👤 Profile
        </Link>

        <button
          onClick={handleLogout}
          style={{
            background: "white",
            color: "#2563eb",
            border: "none",
            padding: "11px 22px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
  fontWeight: "bold",
};

export default Navbar;
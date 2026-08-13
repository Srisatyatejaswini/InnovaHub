import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    textDecoration: "none",
    color: "#222",
    display: "block",
    transition: "transform 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      {/* Dashboard content */}
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "50px 20px",
        }}
      >
        <h1 style={{ color: "#222" }}>
          Welcome, {user?.name || "User"}! 👋
        </h1>

        <p style={{ color: "#666", fontSize: "18px" }}>
          Welcome to your InnovaHub dashboard.
        </p>

        {/* User information */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            marginTop: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Your Profile</h2>

          <p>
            <strong>Name:</strong>{" "}
            {user?.name || "Not available"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user?.email || "Not available"}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {user?.role || "Not available"}
          </p>

          <p>
            <strong>Skills:</strong>{" "}
            {user?.skills?.length
              ? user.skills.join(", ")
              : "No skills added"}
          </p>

          <p>
            <strong>Bio:</strong>{" "}
            {user?.bio || "No bio added"}
          </p>

          <Link
            to="/profile"
            style={{
              display: "inline-block",
              marginTop: "15px",
              background: "#2563eb",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            View Profile
          </Link>
        </div>

        {/* Feature cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {/* Explore Ideas */}
          <Link
            to="/explore-ideas"
            style={cardStyle}
          >
            <h3>💡 Explore Ideas</h3>

            <p>
              Discover innovative ideas submitted by users.
            </p>

            <strong style={{ color: "#2563eb" }}>
              Explore →
            </strong>
          </Link>

          {/* Submit Idea */}
          <Link
            to="/submit-idea"
            style={cardStyle}
          >
            <h3>🚀 Submit an Idea</h3>

            <p>
              Share your innovative idea with the community.
            </p>

            <strong style={{ color: "#2563eb" }}>
              Submit →
            </strong>
          </Link>

          {/* My Ideas */}
          <Link
            to="/my-ideas"
            style={cardStyle}
          >
            <h3>📚 My Ideas</h3>

            <p>
              View, edit and manage the ideas you have submitted.
            </p>

            <strong style={{ color: "#2563eb" }}>
              Manage Ideas →
            </strong>
          </Link>

          {/* Teams */}
          <Link
            to="/teams"
            style={cardStyle}
          >
            <h3>🤝 Teams</h3>

            <p>
              Find people and collaborate on projects.
            </p>

            <strong style={{ color: "#2563eb" }}>
              Find Teams →
            </strong>
          </Link>

          {/* Collaborations */}
          <Link
            to="/collaborations"
            style={cardStyle}
          >
            <h3>🤝 Collaborations</h3>

            <p>
              Manage collaboration requests and connect
              with other innovators.
            </p>

            <strong style={{ color: "#2563eb" }}>
              View Collaborations →
            </strong>
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            style={cardStyle}
          >
            <h3>🔔 Notifications</h3>

            <p>
              Check your latest notifications and updates.
            </p>

            <strong style={{ color: "#2563eb" }}>
              View Notifications →
            </strong>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
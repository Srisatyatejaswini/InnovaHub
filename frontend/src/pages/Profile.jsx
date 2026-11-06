import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // =========================
  // DELETE ACCOUNT
  // =========================
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?\n\n" +
        "This will permanently delete your profile, ideas, likes, collaborations and notifications.\n\n" +
        "This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const secondConfirmation = window.confirm(
      "FINAL CONFIRMATION:\n\n" +
        "Delete your InnovaHub account permanently?"
    );

    if (!secondConfirmation) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      await axios.delete(
        "/api/auth/account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Your account has been deleted successfully.");

      // Clear login information
      logout();

      // Go to registration page
      navigate("/register");
    } catch (error) {
      console.error("Delete account error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete your account."
      );
    }
  };

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
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#2563eb",
            fontWeight: "bold",
          }}
        >
          ← Back to Dashboard
        </Link>

        <div
          style={{
            background: "white",
            marginTop: "25px",
            padding: "35px",
            borderRadius: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          {/* PROFILE HEADER */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "#2563eb",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "40px",
                fontWeight: "bold",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h1 style={{ marginBottom: "5px" }}>
              {user?.name || "User"}
            </h1>

            <p style={{ color: "#666" }}>
              {user?.role || "Student"}
            </p>
          </div>

          <hr
            style={{
              margin: "30px 0",
              border: "none",
              borderTop: "1px solid #ddd",
            }}
          />

          {/* PERSONAL INFORMATION */}
          <div>
            <h3>Personal Information</h3>

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
              <strong>Bio:</strong>{" "}
              {user?.bio || "No bio added"}
            </p>
          </div>

          {/* SKILLS */}
          <div style={{ marginTop: "25px" }}>
            <h3>Skills</h3>

            {user?.skills?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      background: "#e0ecff",
                      color: "#2563eb",
                      padding: "7px 14px",
                      borderRadius: "20px",
                      fontSize: "14px",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p>No skills added.</p>
            )}
          </div>

          {/* BUTTONS */}
          <div
            style={{
              textAlign: "center",
              marginTop: "35px",
            }}
          >
            {/* EDIT PROFILE */}
            <Link
              to="/edit-profile"
              style={{
                display: "inline-block",
                background: "#2563eb",
                color: "white",
                padding: "11px 25px",
                borderRadius: "7px",
                textDecoration: "none",
              }}
            >
              Edit Profile
            </Link>

            {/* DELETE ACCOUNT */}
            <button
              onClick={handleDeleteAccount}
              style={{
                display: "block",
                margin: "18px auto 0",
                background: "#dc2626",
                color: "white",
                padding: "11px 25px",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              🗑️ Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
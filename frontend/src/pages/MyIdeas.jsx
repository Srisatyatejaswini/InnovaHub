import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyIdeas();
  }, []);

  const fetchMyIdeas = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "/api/ideas/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIdeas(response.data.ideas || []);
    } catch (error) {
      console.error("My ideas error:", error);

      setError(
        error.response?.data?.message ||
          "Server error while fetching my ideas."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIdea = async (ideaId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this idea?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(ideaId);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await axios.delete(
        `/api/ideas/${ideaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        response.data.message ||
          "Idea deleted successfully."
      );

      setIdeas((previousIdeas) =>
        previousIdeas.filter(
          (idea) => idea._id !== ideaId
        )
      );
    } catch (error) {
      console.error("Delete idea error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete idea."
      );
    } finally {
      setDeletingId(null);
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
          maxWidth: "1100px",
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "30px",
            marginBottom: "30px",
            gap: "15px",
          }}
        >
          <div>
            <h1 style={{ marginBottom: "8px" }}>
              💡 My Ideas
            </h1>

            <p style={{ color: "#666" }}>
              Manage the innovative ideas you have submitted.
            </p>
          </div>

          <Link
            to="/submit-idea"
            style={{
              background: "#2563eb",
              color: "white",
              padding: "11px 18px",
              borderRadius: "7px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            + Submit New Idea
          </Link>
        </div>

        {loading && (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3>Loading your ideas...</h3>
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          ideas.length === 0 && (
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.08)",
              }}
            >
              <h2>
                You haven't submitted any ideas yet.
              </h2>

              <p style={{ color: "#666" }}>
                Share your first innovative idea with
                the InnovaHub community.
              </p>

              <Link
                to="/submit-idea"
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  background: "#2563eb",
                  color: "white",
                  padding: "11px 18px",
                  borderRadius: "7px",
                  textDecoration: "none",
                }}
              >
                🚀 Submit Your First Idea
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          ideas.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "25px",
              }}
            >
              {ideas.map((idea) => (
                <div
                  key={idea._id}
                  style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow:
                      "0 2px 10px rgba(0,0,0,0.08)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      background: "#e0ecff",
                      color: "#2563eb",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      fontSize: "13px",
                    }}
                  >
                    {idea.category}
                  </span>

                  <h2>{idea.title}</h2>

                  <p
                    style={{
                      color: "#555",
                      lineHeight: "1.6",
                    }}
                  >
                    {idea.description}
                  </p>

                  {idea.technologies?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "7px",
                        marginTop: "15px",
                      }}
                    >
                      {idea.technologies.map(
                        (technology, index) => (
                          <span
                            key={index}
                            style={{
                              background: "#f1f5f9",
                              padding: "5px 9px",
                              borderRadius: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {technology}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: "20px",
                      paddingTop: "15px",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <p style={{ color: "#666" }}>
                      ❤️ {idea.likes || 0} Likes
                    </p>

                    <p style={{ color: "#666" }}>
                      📌 Status:{" "}
                      <strong>
                        {idea.status || "submitted"}
                      </strong>
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "15px",
                    }}
                  >
                    <Link
                      to={`/ideas/${idea._id}`}
                      style={{
                        display: "inline-block",
                        background: "#2563eb",
                        color: "white",
                        padding: "10px 15px",
                        borderRadius: "6px",
                        textDecoration: "none",
                      }}
                    >
                      View Idea →
                    </Link>

                    <button
                      onClick={() =>
                        handleDeleteIdea(idea._id)
                      }
                      disabled={
                        deletingId === idea._id
                      }
                      style={{
                        background:
                          deletingId === idea._id
                            ? "#94a3b8"
                            : "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "10px 15px",
                        borderRadius: "6px",
                        cursor:
                          deletingId === idea._id
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "14px",
                      }}
                    >
                      {deletingId === idea._id
                        ? "Deleting..."
                        : "🗑️ Delete Idea"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default MyIdeas;
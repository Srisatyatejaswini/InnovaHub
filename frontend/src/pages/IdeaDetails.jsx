import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const IdeaDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sendingRequest, setSendingRequest] = useState(false);

  // Like states
  const [liking, setLiking] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchIdea();
  }, [id]);

  // =========================
  // FETCH IDEA DETAILS
  // =========================
  const fetchIdea = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `/api/ideas/${id}`
      );

      const ideaData = response.data.idea;

      setIdea(ideaData);
      setLikes(ideaData.likes || 0);

      // Backend can return whether current user liked it
      setLiked(ideaData.liked || false);
    } catch (error) {
      console.error("Error fetching idea:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load idea."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LIKE / UNLIKE IDEA
  // =========================
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      setLiking(true);

      const response = await axios.post(
        `/api/ideas/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLikes(response.data.likes);

      if (
        typeof response.data.liked !==
        "undefined"
      ) {
        setLiked(response.data.liked);
      } else {
        setLiked(true);
      }

      setIdea((previousIdea) => ({
        ...previousIdea,
        likes: response.data.likes,
      }));
    } catch (error) {
      console.error("Like error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to like the idea."
      );
    } finally {
      setLiking(false);
    }
  };

  // =========================
  // REQUEST COLLABORATION
  // =========================
  const handleCollaboration = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      setSendingRequest(true);

      const response = await axios.post(
        "/api/collaborations/request",
        {
          ideaId: id,
          message:
            "I am interested in collaborating on this idea.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(
        response.data.message ||
          "Collaboration request sent successfully!"
      );
    } catch (error) {
      console.error(
        "Collaboration request error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to send collaboration request."
      );
    } finally {
      setSendingRequest(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f7fb",
        }}
      >
        Loading idea...
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "red" }}>
          {error}
        </h2>

        <Link
          to="/explore-ideas"
          style={{
            display: "inline-block",
            marginTop: "20px",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to Explore Ideas
        </Link>
      </div>
    );
  }

  // =========================
  // IDEA NOT FOUND
  // =========================
  if (!idea) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h2>Idea not found.</h2>

        <Link
          to="/explore-ideas"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to Explore Ideas
        </Link>
      </div>
    );
  }

  // =========================
  // CHECK IDEA OWNER
  // =========================
  const currentUserId =
    user?._id || user?.id;

  const creatorId =
    idea.creator?._id || idea.creator?.id;

  const isCreator =
    currentUserId &&
    creatorId &&
    currentUserId.toString() ===
      creatorId.toString();

  // =========================
  // MAIN PAGE
  // =========================
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
        {/* Back button */}

        <Link
          to="/explore-ideas"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to Explore Ideas
        </Link>

        {/* Main card */}

        <div
          style={{
            background: "white",
            marginTop: "25px",
            padding: "35px",
            borderRadius: "15px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          {/* Category */}

          <span
            style={{
              display: "inline-block",
              background: "#e0ecff",
              color: "#2563eb",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            {idea.category || "General"}
          </span>

          {/* Title */}

          <h1
            style={{
              marginTop: "15px",
              marginBottom: "10px",
              color: "#222",
            }}
          >
            {idea.title}
          </h1>

          {/* Description */}

          <p
            style={{
              color: "#555",
              fontSize: "17px",
              lineHeight: "1.7",
            }}
          >
            {idea.description}
          </p>

          <hr
            style={{
              margin: "30px 0",
              border: "none",
              borderTop: "1px solid #eee",
            }}
          />

          {/* Problem */}

          <section>
            <h2 style={{ color: "#222" }}>
              🧠 Problem
            </h2>

            <p
              style={{
                color: "#555",
                lineHeight: "1.7",
              }}
            >
              {idea.problem ||
                "No problem description provided."}
            </p>
          </section>

          {/* Solution */}

          <section
            style={{
              marginTop: "25px",
            }}
          >
            <h2 style={{ color: "#222" }}>
              💡 Solution
            </h2>

            <p
              style={{
                color: "#555",
                lineHeight: "1.7",
              }}
            >
              {idea.solution ||
                "No solution description provided."}
            </p>
          </section>

          {/* Technologies */}

          <section
            style={{
              marginTop: "25px",
            }}
          >
            <h2 style={{ color: "#222" }}>
              🛠 Technologies
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              {idea.technologies &&
              idea.technologies.length > 0 ? (
                idea.technologies.map(
                  (technology, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#f1f5f9",
                        color: "#333",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                    >
                      {technology}
                    </span>
                  )
                )
              ) : (
                <p style={{ color: "#666" }}>
                  No technologies listed.
                </p>
              )}
            </div>
          </section>

          <hr
            style={{
              margin: "30px 0",
              border: "none",
              borderTop: "1px solid #eee",
            }}
          />

          {/* Creator */}

          <section>
            <h2 style={{ color: "#222" }}>
              👤 Idea Creator
            </h2>

            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "10px",
                marginTop: "15px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  color: "#222",
                }}
              >
                {idea.creator?.name ||
                  "Unknown User"}
              </h3>

              <p>
                <strong>Email:</strong>{" "}
                {idea.creator?.email ||
                  "Not available"}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {idea.creator?.role ||
                  "Not available"}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {idea.creator?.skills?.length
                  ? idea.creator.skills.join(", ")
                  : "No skills listed"}
              </p>

              {idea.creator?.bio && (
                <p>
                  <strong>Bio:</strong>{" "}
                  {idea.creator.bio}
                </p>
              )}
            </div>
          </section>

          {/* =========================
              EDIT + STATUS + LIKE
          ========================= */}

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "30px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* EDIT BUTTON */}

            {isCreator && (
              <Link
                to={`/edit-idea/${idea._id}`}
                style={{
                  background: "#16a34a",
                  color: "white",
                  padding: "10px 18px",
                  borderRadius: "7px",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                ✏️ Edit Idea
              </Link>
            )}

            {/* LIKE BUTTON */}

            <button
              onClick={handleLike}
              disabled={liking}
              style={{
                background: liked
                  ? "#fee2e2"
                  : "#2563eb",
                color: liked
                  ? "#dc2626"
                  : "white",
                border: liked
                  ? "1px solid #fecaca"
                  : "none",
                padding: "10px 18px",
                borderRadius: "7px",
                cursor: liking
                  ? "not-allowed"
                  : "pointer",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              {liking
                ? "Processing..."
                : liked
                ? `❤️ Liked ${likes}`
                : `👍 Like ${likes}`}
            </button>

            {/* STATUS */}

            <div
              style={{
                background: "#f1f5f9",
                padding: "10px 15px",
                borderRadius: "7px",
              }}
            >
              📌 {idea.status || "submitted"}
            </div>
          </div>

          {/* =========================
              COLLABORATION
          ========================= */}

          {!isCreator && (
            <div
              style={{
                marginTop: "30px",
                paddingTop: "25px",
                borderTop: "1px solid #eee",
              }}
            >
              <h2 style={{ color: "#222" }}>
                🤝 Interested in this idea?
              </h2>

              <p
                style={{
                  color: "#666",
                  lineHeight: "1.6",
                }}
              >
                Connect with the creator and
                collaborate on developing this idea.
              </p>

              <button
                onClick={handleCollaboration}
                disabled={sendingRequest}
                style={{
                  background: sendingRequest
                    ? "#94a3b8"
                    : "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "7px",
                  cursor: sendingRequest
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "15px",
                }}
              >
                {sendingRequest
                  ? "Sending..."
                  : "🤝 Request Collaboration"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;
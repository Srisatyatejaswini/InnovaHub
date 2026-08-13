import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "/api/collaborations/teams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeams(response.data.teams || []);
    } catch (error) {
      console.error("Get teams error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load teams."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fb",
        }}
      >
        <h2>Loading teams...</h2>
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
          maxWidth: "1000px",
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
          <h1>🤝 My Teams</h1>

          <p style={{ color: "#666" }}>
            View the ideas and people you are collaborating with.
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

        {!error && teams.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "12px",
              marginTop: "25px",
              textAlign: "center",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "50px" }}>
              🤝
            </div>

            <h2>No teams yet</h2>

            <p style={{ color: "#666" }}>
              Accepted collaboration requests will appear here.
            </p>

            <Link
              to="/explore-ideas"
              style={{
                display: "inline-block",
                marginTop: "15px",
                background: "#2563eb",
                color: "white",
                padding: "10px 20px",
                borderRadius: "7px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Explore Ideas
            </Link>
          </div>
        )}

        <div style={{ marginTop: "25px" }}>
          {teams.map((team) => {
            const creator = team.creator;
            const requester = team.requester;
            const idea = team.idea;

            return (
              <div
                key={team._id}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        background: "#dcfce7",
                        color: "#166534",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      ✓ Accepted
                    </span>

                    <h2
                      style={{
                        marginTop: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      💡 {idea?.title || "Untitled Idea"}
                    </h2>

                    <p
                      style={{
                        color: "#666",
                        lineHeight: "1.6",
                      }}
                    >
                      {idea?.description ||
                        "No description available."}
                    </p>
                  </div>

                  {idea?._id && (
                    <Link
                      to={`/ideas/${idea._id}`}
                      style={{
                        background: "#2563eb",
                        color: "white",
                        padding: "10px 16px",
                        borderRadius: "7px",
                        textDecoration: "none",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      View Idea →
                    </Link>
                  )}
                </div>

                <hr
                  style={{
                    margin: "25px 0",
                    border: "none",
                    borderTop: "1px solid #eee",
                  }}
                />

                <h3>👥 Team Members</h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "15px",
                    marginTop: "15px",
                  }}
                >
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "18px",
                      borderRadius: "8px",
                    }}
                  >
                    <strong>👤 Idea Creator</strong>

                    <p>
                      {creator?.name ||
                        "Unknown User"}
                    </p>

                    <small
                      style={{ color: "#666" }}
                    >
                      {creator?.role ||
                        "No role specified"}
                    </small>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "18px",
                      borderRadius: "8px",
                    }}
                  >
                    <strong>🤝 Collaborator</strong>

                    <p>
                      {requester?.name ||
                        "Unknown User"}
                    </p>

                    <small
                      style={{ color: "#666" }}
                    >
                      {requester?.role ||
                        "No role specified"}
                    </small>
                  </div>
                </div>

                {idea?.technologies?.length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <strong>🛠 Technologies</strong>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginTop: "10px",
                      }}
                    >
                      {idea.technologies.map(
                        (technology, index) => (
                          <span
                            key={index}
                            style={{
                              background: "#e0ecff",
                              color: "#2563eb",
                              padding: "6px 10px",
                              borderRadius: "15px",
                              fontSize: "13px",
                            }}
                          >
                            {technology}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Teams;
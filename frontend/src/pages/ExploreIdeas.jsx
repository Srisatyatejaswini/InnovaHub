import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ExploreIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await axios.get(
        "/api/ideas"
      );

      setIdeas(response.data.ideas);
    } catch (error) {
      console.error(error);
      setError("Unable to load ideas.");
    } finally {
      setLoading(false);
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
            textDecoration: "none",
            color: "#2563eb",
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
            marginTop: "25px",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1 style={{ marginBottom: "8px" }}>
              Explore Ideas 💡
            </h1>

            <p style={{ color: "#666" }}>
              Discover innovative ideas from the InnovaHub community.
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
            }}
          >
            + Submit Idea
          </Link>
        </div>

        {loading && <p>Loading ideas...</p>}

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {!loading && !error && ideas.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2>No ideas available</h2>
            <p>Be the first person to submit an innovative idea.</p>
          </div>
        )}

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
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
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
                  marginBottom: "12px",
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
                  {idea.technologies.map((technology, index) => (
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
                  ))}
                </div>
              )}

              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "15px",
                  borderTop: "1px solid #eee",
                }}
              >
                <p style={{ fontSize: "14px", color: "#666" }}>
                  Created by:{" "}
                  <strong>
                    {idea.creator?.name || "Unknown"}
                  </strong>
                </p>

                <p style={{ fontSize: "14px", color: "#666" }}>
                  ❤️ {idea.likes} likes
                </p>
              </div>

              <Link
                to={`/ideas/${idea._id}`}
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreIdeas;
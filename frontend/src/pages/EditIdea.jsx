import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditIdea = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");

  useEffect(() => {
    fetchIdea();
  }, [id]);

  const fetchIdea = async () => {
    try {
      const response = await axios.get(
        `/api/ideas/${id}`
      );

      const idea = response.data.idea;

      setTitle(idea.title || "");
      setDescription(idea.description || "");
      setCategory(idea.category || "");
      setTechnologies(
        idea.technologies?.join(", ") || ""
      );
      setProblem(idea.problem || "");
      setSolution(idea.solution || "");
    } catch (error) {
      console.error("Fetch idea error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load idea."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      if (!title || !description || !category) {
        setError(
          "Title, description and category are required."
        );
        return;
      }

      setSaving(true);
      setError("");

      const technologyList = technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter((technology) => technology.length > 0);

      await axios.put(
        `/api/ideas/${id}`,
        {
          title,
          description,
          category,
          technologies: technologyList,
          problem,
          solution,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Idea updated successfully.");

      navigate("/my-ideas");
    } catch (error) {
      console.error("Update idea error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update idea."
      );
    } finally {
      setSaving(false);
    }
  };

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
          to="/my-ideas"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to My Ideas
        </Link>

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
          <h1>✏️ Edit Idea</h1>

          <p style={{ color: "#666" }}>
            Update your submitted idea.
          </p>

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

          <form
            onSubmit={handleSubmit}
            style={{ marginTop: "25px" }}
          >
            <label>
              <strong>Title</strong>
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                boxSizing: "border-box",
              }}
            />

            <label>
              <strong>Description</strong>
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="5"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />

            <label>
              <strong>Category</strong>
            </label>

            <input
              type="text"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                boxSizing: "border-box",
              }}
            />

            <label>
              <strong>Technologies</strong>
            </label>

            <input
              type="text"
              value={technologies}
              onChange={(event) =>
                setTechnologies(event.target.value)
              }
              placeholder="Example: React, Node.js, MongoDB"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                boxSizing: "border-box",
              }}
            />

            <label>
              <strong>Problem</strong>
            </label>

            <textarea
              value={problem}
              onChange={(event) =>
                setProblem(event.target.value)
              }
              rows="4"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />

            <label>
              <strong>Solution</strong>
            </label>

            <textarea
              value={solution}
              onChange={(event) =>
                setSolution(event.target.value)
              }
              rows="4"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                marginBottom: "25px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />

            <button
              type="submit"
              disabled={saving}
              style={{
                background: saving
                  ? "#94a3b8"
                  : "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: "7px",
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
                fontSize: "15px",
              }}
            >
              {saving
                ? "Saving..."
                : "💾 Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditIdea;
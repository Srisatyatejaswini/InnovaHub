import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SubmitIdea = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    technologies: "",
    problem: "",
    solution: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login before submitting an idea.");
        setLoading(false);
        return;
      }

      const ideaData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        technologies: formData.technologies
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
        problem: formData.problem,
        solution: formData.solution,
      };

      const response = await axios.post(
        "/api/ideas",
        ideaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(
        response.data.message || "Idea submitted successfully!"
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        technologies: "",
        problem: "",
        solution: "",
      });

      setTimeout(() => {
        navigate("/explore-ideas");
      }, 1200);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to submit the idea."
      );
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
          maxWidth: "800px",
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
            background: "white",
            marginTop: "25px",
            padding: "35px",
            borderRadius: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h1>🚀 Submit an Idea</h1>

          <p style={{ color: "#666" }}>
            Share your innovative idea with the InnovaHub community.
          </p>

          {message && (
            <div
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "20px",
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Idea Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your idea title"
              required
              style={inputStyle}
            />

            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your idea"
              rows="5"
              required
              style={inputStyle}
            />

            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select category</option>
              <option value="Education">Education</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Technology">Technology</option>
              <option value="Environment">Environment</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>

            <label>Technologies</label>

            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              style={inputStyle}
            />

            <small style={{ color: "#666" }}>
              Separate technologies using commas.
            </small>

            <label>Problem</label>

            <textarea
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              placeholder="What problem does your idea solve?"
              rows="4"
              style={inputStyle}
            />

            <label>Solution</label>

            <textarea
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              placeholder="How does your idea solve the problem?"
              rows="4"
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                marginTop: "20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "7px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit Idea 🚀"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "7px",
  marginBottom: "20px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  boxSizing: "border-box",
  fontSize: "15px",
};

export default SubmitIdea;
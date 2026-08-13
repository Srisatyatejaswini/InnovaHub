import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    skills: "",
    bio: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
        bio: formData.bio,
      };

      await register(userData);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          InnovaHub
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Create your account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength="6"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="student">Student</option>
              <option value="innovator">Innovator</option>
              <option value="mentor">Mentor</option>
              <option value="organization">Organization</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Java, React, Python"
              className="w-full border rounded-lg px-4 py-2"
            />

            <p className="text-sm text-gray-500 mt-1">
              Separate skills using commas.
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Bio
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows="3"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
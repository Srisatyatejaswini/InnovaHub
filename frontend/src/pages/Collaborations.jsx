import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Collaborations = () => {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view collaborations.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [receivedResponse, sentResponse] = await Promise.all([
        axios.get(
          "/api/collaborations/received",
          config
        ),
        axios.get(
          "/api/collaborations/sent",
          config
        ),
      ]);

      setReceived(receivedResponse.data.collaborations || []);
      setSent(sentResponse.data.collaborations || []);
    } catch (error) {
      console.error("Collaborations error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load collaborations."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      setActionLoading(id);

      const token = localStorage.getItem("token");

      await axios.put(
        `/api/collaborations/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Collaboration request accepted!");

      await fetchCollaborations();
    } catch (error) {
      console.error("Accept collaboration error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to accept collaboration request."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this collaboration request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);

      const token = localStorage.getItem("token");

      await axios.put(
        `/api/collaborations/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Collaboration request rejected!");

      await fetchCollaborations();
    } catch (error) {
      console.error("Reject collaboration error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to reject collaboration request."
      );
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading collaborations...
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
            textDecoration: "none",
            color: "#2563eb",
            fontWeight: "bold",
          }}
        >
          ← Back to Dashboard
        </Link>

        <h1 style={{ marginTop: "30px" }}>
          🤝 Collaboration Requests
        </h1>

        <p style={{ color: "#666" }}>
          Manage collaboration requests for your ideas.
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "25px",
            }}
          >
            {error}
          </div>
        )}

        {/* Received Requests */}
        <section style={{ marginTop: "30px" }}>
          <h2>📥 Received Requests</h2>

          {received.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "12px",
                marginTop: "15px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              }}
            >
              <p style={{ color: "#666" }}>
                You have no collaboration requests.
              </p>
            </div>
          ) : (
            received.map((collaboration) => (
              <div
                key={collaboration._id}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  marginTop: "15px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2 style={{ marginTop: 0 }}>
                      💡{" "}
                      {collaboration.idea?.title ||
                        "Untitled Idea"}
                    </h2>

                    <p style={{ color: "#555" }}>
                      {collaboration.idea?.description ||
                        "No description available."}
                    </p>
                  </div>

                  <span
                    style={{
                      height: "fit-content",
                      background:
                        collaboration.status === "pending"
                          ? "#fef3c7"
                          : collaboration.status === "accepted"
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        collaboration.status === "pending"
                          ? "#92400e"
                          : collaboration.status === "accepted"
                          ? "#166534"
                          : "#991b1b",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    {collaboration.status}
                  </span>
                </div>

                <hr
                  style={{
                    margin: "20px 0",
                    border: "none",
                    borderTop: "1px solid #eee",
                  }}
                />

                <h3>👤 Requester</h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {collaboration.requester?.name ||
                    "Unknown"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {collaboration.requester?.email ||
                    "Not available"}
                </p>

                <p>
                  <strong>Role:</strong>{" "}
                  {collaboration.requester?.role ||
                    "Student"}
                </p>

                <p>
                  <strong>Skills:</strong>{" "}
                  {collaboration.requester?.skills?.length
                    ? collaboration.requester.skills.join(
                        ", "
                      )
                    : "No skills listed"}
                </p>

                <div
                  style={{
                    background: "#f8fafc",
                    padding: "15px",
                    borderRadius: "8px",
                    marginTop: "15px",
                  }}
                >
                  <strong>Message:</strong>

                  <p
                    style={{
                      marginBottom: 0,
                      color: "#555",
                    }}
                  >
                    {collaboration.message ||
                      "No message provided."}
                  </p>
                </div>

                {collaboration.status === "pending" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleAccept(collaboration._id)
                      }
                      disabled={
                        actionLoading === collaboration._id
                      }
                      style={{
                        background: "#16a34a",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                    >
                      {actionLoading === collaboration._id
                        ? "Processing..."
                        : "Accept"}
                    </button>

                    <button
                      onClick={() =>
                        handleReject(collaboration._id)
                      }
                      disabled={
                        actionLoading === collaboration._id
                      }
                      style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                    >
                      {actionLoading === collaboration._id
                        ? "Processing..."
                        : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>

        {/* Sent Requests */}
        <section style={{ marginTop: "45px" }}>
          <h2>📤 Sent Requests</h2>

          {sent.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "12px",
                marginTop: "15px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              }}
            >
              <p style={{ color: "#666" }}>
                You have not sent any collaboration requests.
              </p>
            </div>
          ) : (
            sent.map((collaboration) => (
              <div
                key={collaboration._id}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  marginTop: "15px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                <h2 style={{ marginTop: 0 }}>
                  💡{" "}
                  {collaboration.idea?.title ||
                    "Untitled Idea"}
                </h2>

                <p style={{ color: "#555" }}>
                  {collaboration.idea?.description ||
                    "No description available."}
                </p>

                <hr
                  style={{
                    margin: "20px 0",
                    border: "none",
                    borderTop: "1px solid #eee",
                  }}
                />

                <p>
                  <strong>Idea Creator:</strong>{" "}
                  {collaboration.creator?.name ||
                    "Unknown"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {collaboration.creator?.email ||
                    "Not available"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {collaboration.status}
                  </span>
                </p>

                <p>
                  <strong>Message:</strong>{" "}
                  {collaboration.message ||
                    "No message provided."}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default Collaborations;
const Home = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            color: "#2563eb",
            marginBottom: "15px",
          }}
        >
          Welcome to InnovaHub
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#555",
            marginBottom: "30px",
          }}
        >
          A Digital Innovation Marketplace
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/login"
            style={{
              background: "#2563eb",
              color: "white",
              padding: "12px 25px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Login
          </a>

          <a
            href="/register"
            style={{
              background: "#16a34a",
              color: "white",
              padding: "12px 25px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Register
          </a>
        </div>

        <div
          style={{
            marginTop: "60px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h2>💡 Share Ideas</h2>
            <p>
              Submit and showcase innovative ideas.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h2>🤝 Collaborate</h2>
            <p>
              Find people with similar interests and skills.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h2>🎓 Get Mentorship</h2>
            <p>
              Connect with mentors and organizations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
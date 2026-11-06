const UserCard = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      {/* Profile Image */}
      {user.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.name}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "15px",
          }}
        />
      ) : (
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "#e0ecff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 15px",
            fontSize: "40px",
          }}
        >
          👤
        </div>
      )}

      {/* Name */}
      <h2
        style={{
          margin: "5px 0",
          color: "#222",
        }}
      >
        {user.name}
      </h2>

      {/* Role */}
      <p
        style={{
          color: "#2563eb",
          fontWeight: "bold",
          textTransform: "capitalize",
        }}
      >
        {user.role || "student"}
      </p>

      {/* Email */}
      <p style={{ color: "#555" }}>
        📧 {user.email}
      </p>

      {/* Skills */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ color: "#222" }}>🛠 Skills</h3>

        {user.skills?.length > 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {user.skills.map((skill, index) => (
              <span
                key={index}
                style={{
                  background: "#f1f5f9",
                  padding: "7px 12px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: "#666" }}>
            No skills added
          </p>
        )}
      </div>

      {/* Bio */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ color: "#222" }}>📝 Bio</h3>

        <p
          style={{
            color: "#666",
            lineHeight: "1.6",
          }}
        >
          {user.bio || "No bio added"}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
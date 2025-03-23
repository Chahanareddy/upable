import { useNavigate } from "react-router-dom";

function InvitationPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#1a1a2e", // Dark blue background
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "32px", color: "#e5bf26", marginBottom: "20px" }}>
        Welcome to the Upskilling App
      </h1>
      <button
        style={{
          backgroundColor: "#e5bf26", // Orange/yellow
          color: "white",
          padding: "14px 24px",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          marginTop: "20px",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#c5a41f")} // Darker shade on hover
        onMouseOut={(e) => (e.target.style.backgroundColor = "#e5bf26")} // Revert on mouse out
        onClick={() => navigate("/user-info")}
      >
        Start
      </button>
    </div>
  );
}

export default InvitationPage;
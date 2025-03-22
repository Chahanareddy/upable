import { useNavigate } from "react-router-dom";

function InvitationPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to the Upskilling App</h1>
      <button onClick={() => navigate("/user-info")}>Start</button>
    </div>
  );
}

export default InvitationPage;

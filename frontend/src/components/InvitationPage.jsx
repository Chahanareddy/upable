import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './InvitationPage.css'; // Use InvitationPage.css for styling

function InvitationPage() {
  const navigate = useNavigate();
  const [dyslexiaMode, setDyslexiaMode] = useState(false);

  const toggleDyslexiaMode = () => {
    setDyslexiaMode(!dyslexiaMode);
  };

  return (
    <div className="container">
      <h1 style={{ fontFamily: dyslexiaMode ? "dyslexic" : "Arial, sans-serif" }}>
        Welcome to the Upskilling App
      </h1>
      <button 
        className="btn" // Apply the button class
        onClick={() => navigate("/user-info")}
      >
        Start
      </button>

      <button
        className="btn" // Apply the button class
        onClick={toggleDyslexiaMode}
      >
        {dyslexiaMode ? "Switch to Standard Font" : "Switch to Dyslexia Font"}
      </button>
    </div>
  );
}

export default InvitationPage;
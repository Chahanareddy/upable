//success stories to network w similar ppl button on top right of two pages?
// src/components/SuccessStoriesButton.jsx
import { useNavigate } from "react-router-dom";
import "./SuccessStoriesButton.css";

function SuccessStoriesButton() {
  const navigate = useNavigate();

  return (
    <button
      className="success-stories-fixed-btn"
      onClick={() => navigate("/success-stories")}
    >
      Success Stories
    </button>
  );
}

export default SuccessStoriesButton;

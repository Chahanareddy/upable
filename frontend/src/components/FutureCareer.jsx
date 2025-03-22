import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './FutureCareer.css';

function FutureCareer() {
  const [career, setCareer] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { job } = location.state || {};

  const handleNext = () => {
    console.log("Next button clicked");
    if (career.trim() !== "") {
      console.log("Navigating to /results"); 
      navigate("/results", { state: { job, career } });
    } else {
      console.log("Career input is empty"); 
      alert("Please enter a career before proceeding.");
    }
  };


  return (
    <div className="container">
      <h2>What career do you want to pursue?</h2>
      <input
        type="text"
        placeholder="Enter desired career"
        value={career}
        onChange={(e) => setCareer(e.target.value)}
      />
      <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>
    </div>
  );
}

export default FutureCareer;

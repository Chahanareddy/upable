import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function FutureCareer() {
  const [career, setCareer] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { job } = location.state || {};

  const handleNext = () => {
    if (career.trim() !== "") {
      navigate("/results", { state: { job, career } });
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
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default FutureCareer;

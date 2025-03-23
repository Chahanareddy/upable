import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Results.css";
import SuccessStoriesButton from "./SuccessStoriesButton";


function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { job, career, disability } = location.state || {};

  const [phases, setPhases] = useState([]);
  const [description, setDescription] = useState("");
  const [currentPhase, setCurrentPhase] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState([]);

  useEffect(() => {
    if (job && career) {
      axios
        .post("http://localhost:5000/get-upskilling", { job, career, disability })
        .then((res) => {
          setDescription(res.data.description);
          setPhases(res.data.phases);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [job, career, disability]);

  const handleNext = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const handleMarkDone = () => {
    setDone((prev) => [...prev, currentPhase]);
  };

  return (
    
    <div className="results-container">
    <SuccessStoriesButton />
      <h2>📚 Roadmap to <em>{career}</em></h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {currentPhase === 0 && (
            <div className="description-card">
              <p>{description}</p>
              <button className="btn btn-primary" onClick={handleNext}>Start Phase 1</button>
            </div>
          )}

          {currentPhase > 0 && (
            <div className="phase-section">
              <h3>{phases[currentPhase - 1].title}</h3>
              <div className="card-grid">
                {phases[currentPhase - 1].courses.map((course, idx) => (
                  <div className="resource-card" key={idx}>
                    <p>{course.name}</p>
                    <a href={course.link} target="_blank" rel="noopener noreferrer">
                      Visit Course →
                    </a>
                  </div>
                ))}
              </div>
              {!done.includes(currentPhase) ? (
                <button className="btn btn-success" onClick={handleMarkDone}>Mark as Done</button>
              ) : (
                <button className="btn btn-secondary" onClick={handleNext}>
                  {currentPhase === phases.length ? "Finish" : "Next Phase →"}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
    
  );
}

export default Results;

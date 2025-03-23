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

  //if user menations dyslex in userinfo, web uses dyslexic font
  const isDyslexic = disability?.toLowerCase().includes("dyslex");
  

  //get upskilling data from backend when job/career info is there
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

  const handleNext = () => { //next phase
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const handleMarkDone = () => { //mark current phase as done and so lets u move on to next pahse
    setDone((prev) => [...prev, currentPhase]);
  };

  return (
  
<div className={isDyslexic ? "dyslexic-font" : ""}>
    <div className="results-container">
    <SuccessStoriesButton />
      <h2>📚 Roadmap to <em>{career}</em></h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
        
          {currentPhase === 0 && ( //first page that shoes like ur custom description for ur roadmap and button to get to phase 1
            <div className="description-card">
              <p>{description}</p>
              <button className="btn btn-primary" onClick={handleNext}>Start Phase 1</button> 
            </div>
          )}


          {currentPhase > 0 && ( //shows each phase and 3 links per phase and also done or next buttons
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
              {!done.includes(currentPhase) ? ( //successfully finish all phses so finish button but it's not working rn??
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
    </div>
    
  );
}

export default Results;

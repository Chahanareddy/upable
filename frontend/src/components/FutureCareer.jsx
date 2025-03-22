import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './FutureCareer.css';
import axios from "axios";


function FutureCareer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { job } = location.state || {};


  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [finalCareer, setFinalCareer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleYes = () => setStep(2);
  const handleNo = () => setStep(6);

  const handleInput = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  };

  const getGeminiSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/gemini-career-structured", {
        job,
        answers,
      });
      setSuggestions(res.data.suggestions);
      setStep(99);
    } catch (err) {
      alert("Gemini failed to generate suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    navigate("/results", {
      state: {
        job,
        career: selectedCareer || finalCareer,
      },
    });
  };

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h2>Explore Your Future Career</h2>

      {step === 1 && (
        <>
          <p>Do you already know what career you want to pursue?</p>
          <button type="button" className="btn btn-primary" onClick={handleYes}>Yes</button>
          <button type="button" className="btn btn-primary" onClick={handleNo}>No</button>
        </>
      )}

      {step === 2 && (
        <>
          <p>What career do you have in mind?</p>
          <input
            type="text"
            onBlur={(e) => handleInput("initialCareer", e.target.value)}
            placeholder="e.g. Software Engineer"
          />
        </>
      )}

{step === 3 && (
  <>
    <p>Do you prefer working in teams or alone?</p>
    <div style={{ display: "flex", gap: "1rem" }}>
      {["Teams", "Alone"].map((option) => (
        <button
          key={option}
          onClick={() => handleInput("teamStyle", option)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "1px solid gray",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  </>
)}

{step === 4 && (
  <>
    <p>Do you prefer remote, hybrid, or on-site work?</p>
    <div style={{ display: "flex", gap: "1rem" }}>
      {["Remote", "Hybrid", "On-site"].map((option) => (
        <button
          key={option}
          onClick={() => handleInput("workType", option)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "1px solid gray",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  </>
)}


{step === 5 && (
  <>
    <p>Do you enjoy building things or solving problems more?</p>
    <div style={{ display: "flex", gap: "1rem" }}>
      {["Building", "Solving problems"].map((option) => (
        <button
          key={option}
          onClick={() => handleInput("interestFocus", option)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "1px solid gray",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  </>
)}


{step === 6 && (
  <>
    <p>What type of work are you interested in?</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
      {[
        "Technical",
        "Hands-on",
        "Creative",
        "People-oriented",
        "Business",
        "Medical",
        "Analytical",
        "Artistic",
        "Social work"
      ].map((option) => (
        <button
          key={option}
          onClick={() => setAnswers((prev) => ({ ...prev, interestArea: option }))}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: answers.interestArea === option ? "2px solid black" : "1px solid gray",
            backgroundColor: answers.interestArea === option ? "#e0e0e0" : "#fff",
            cursor: "pointer",
          }}
        >
          {option}
        </button>
      ))}
    </div>
    <button
      onClick={() => setStep(7)}
      disabled={!answers.interestArea}
    >
      Next
    </button>
  </>
)}


      {[ 6].includes(step - 1) && step !== 99 && (
        <button type="button" className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={getGeminiSuggestions}>
          Get Career Suggestions
        </button>
      )}

      {loading && <p>Thinking...</p>}

      {step === 99 && (
        <>
          <p><strong>Here are some career paths you might like:</strong></p>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>
                <label>
                  <input
                    type="radio"
                    name="career"
                    value={s}
                    checked={selectedCareer === s}
                    onChange={() => setSelectedCareer(s)}
                  />{" "}
                  {s}
                </label>
              </li>
            ))}
          </ul>

          <p>Or type your own career path:</p>
          <input
            value={finalCareer}
            onChange={(e) => setFinalCareer(e.target.value)}
            placeholder="Type your own career..."
          />

          <button type="button" onClick={handleConfirm} style={{ marginTop: "1rem" }}>
            Continue
          </button>
        </>
      )}
    </div>
  );
}

export default FutureCareer;

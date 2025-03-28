import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './FutureCareer.css';
import axios from "axios";
import SuccessStoriesButton from "./SuccessStoriesButton";

function FutureCareer() {


  const navigate = useNavigate(); //for navigating to diff pages
  const location = useLocation();
  const { job } = location.state || {}; //sends this "answer key" ig for the page to use

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [finalCareer, setFinalCareer] = useState("");
  const [loading, setLoading] = useState(false);
  const { disability } = location.state || {}; //another answer key for fonts

  //bascially if the word dyslex is in user's input from userinfo page, the web changes to align for dyslexic ppl
  const isDyslexic = disability?.toLowerCase().includes("dyslex"); 

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
    navigate("/career-chat", {
      state: { job, career: selectedCareer || finalCareer }
    });
  };

  //dyslexic font resumes if needed
  //A lot of the questions are here for generrrating specialized responeses when you get ur 5 suggested career pths
  return (
    <div className={isDyslexic ? "dyslexic-font" : ""}> 
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
      placeholder="e.g. Software Engineer"
      value={answers.initialCareer || ""}
      onChange={(e) =>
        setAnswers((prev) => ({ ...prev, initialCareer: e.target.value }))
      }
      className="form-input"
    />
    <button
      type="button"
      className="btn btn-primary"
      style={{ marginTop: "1rem" }}
      disabled={!answers.initialCareer}
      onClick={() => setStep(3)}
    >
      Next
    </button>
  </>
)}


      {step === 3 && (
        <>
          <p>Do you prefer working in teams or alone?</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            {["Teams", "Alone"].map((option) => (
              <button key={option} onClick={() => handleInput("teamStyle", option)} className="btn btn-outline-secondary">
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
            {["Remote", "Hybrid", "On-site", "Does Not Matter"].map((option) => (
              <button key={option} onClick={() => handleInput("workType", option)} className="btn btn-outline-secondary">
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
                onClick={() => {
                  handleInput("interestFocus", option);
                  getGeminiSuggestions(); // Trigger Gemini here to give siggestions
                }}
                className="btn btn-outline-secondary"
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
                //list of diff disciplinaries of like jobs ig
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
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, interestArea: option }));
                  setStep(3); // ➡️ continue to ask folow-up questns
                }}
                className="btn btn-outline-secondary"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}

      {loading && <p>Thinking...</p>}


      {step === 99 && ( //thsi is where ai suggests like 5 paths you can go into and u can pick one
  <div className="suggestion-step">
    <p><strong>Here are some career paths you might like:</strong></p>
    <div className="career-options">
      {suggestions.map((s, i) => (
        <label key={i} className="career-option">
        <input
          type="radio"
          name="career"
          value={s}
          checked={selectedCareer === s}
          onChange={() => setSelectedCareer(s)}
        />
        <span>{s}</span>
      </label>
      
      ))}
    </div>


    <p style={{ marginTop: "2rem" }}>Or type your own career path:</p> 
    <input //if u dont like the suggested ones u can pick ur own lol
      value={finalCareer}
      onChange={(e) => setFinalCareer(e.target.value)}
      placeholder="Type your own career..."
      className="form-input"
    />


    <button  //button to continue to next page
      type="button"
      onClick={handleConfirm}
      className="btn btn-primary"
      style={{ marginTop: "1.5rem" }}
    >
      Continue
    </button>
  </div>
)}
</div>
    </div>
    
  );

  
}

export default FutureCareer;

// frontend/src/components/UserInfo.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserInfo() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [disability, setDisability] = useState("");
  const [job, setJob] = useState("");
  const navigate = useNavigate();
  
  //Writing every country w the law for now- will find a way to not hardcode it like this later
  const countrieswlaw = [
    "Germany", "France", "Italy", "Japan", "South Korea", "India",
    "Brazil", "China", "Turkey", "Thailand", "Other"
  ];
  

  const handleNext = () => {
    if (job.trim() !== "") {
      navigate("/future-career", {
        state: { name, age, city, disability, job },
      });
    }
  };

  return (
    <div className="container">
      <h2>Let's get to know you!</h2>

      <label>Name:</label>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Age:</label>
      <input
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      

<label>Country:</label>
<select value={city} onChange={(e) => setCountry(e.target.value)}>
  <option value="">Select a country</option>
  {countrieswlaw.map((c, i) => (
    <option key={i} value={c}>{c}</option>
  ))}
</select>


      <label>Disability (optional):</label>
      <input
        type="text"
        placeholder="e.g. Vision impairment, mobility issues"
        value={disability}
        onChange={(e) => setDisability(e.target.value)}
      />

      <label>What is your current job?</label>
      <input
        type="text"
        placeholder="Enter your job title"
        value={job}
        onChange={(e) => setJob(e.target.value)}
      />

      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default UserInfo;

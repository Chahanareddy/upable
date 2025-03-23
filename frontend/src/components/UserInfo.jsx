import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './UserInfo.css';

//stores form inputs in like a single state object
function UserInfo() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    country: "",
    disability: "",
    job: "",
  });

  const navigate = useNavigate();

  //countries where the disability workers mandatory law is
  const countriesWithLaw = [
    "Germany", "France", "Italy", "Japan", "South Korea", "India",
    "Brazil", "Turkey", "Thailand", "Other"
  ];

  //if input is changed this handles it by updating
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => {
    if (formData.job.trim()) {
      navigate("/future-career", { state: formData }); //pass form data to future-career page
    } else {
      alert("Please enter your job title before proceeding.");
    }
  };

  return (
    <div className="full-screen-container">
      <div className="user-info-wrapper">
        <h2 className="section-title">Let's get to know you</h2>


        <form className="user-info-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
            //name
              id="name" 
              type="text"
              name="name"
              placeholder="Enter your name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age" className="form-label">Age:</label>
            <input
            //age
              id="age"
              type="number"
              name="age"
              placeholder="Enter your age"
              className="form-input"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="country" className="form-label">Country:</label>
            <select id="country" name="country" value={formData.country} onChange={handleChange} className="form-select">
              <option value="">Select a country</option>
              {countriesWithLaw.map((country, index) => (
                <option key={index} value={country}>{country}</option> //country
              ))}
            </select>
          </div>

          <div className="form-group">
            
            <label htmlFor="disability" className="form-label">Disability:</label> 
            <input
            //disability
              id="disability"
              type="text"
              name="disability"
              placeholder="e.g. Vision impairment, mobility issues"
              className="form-input"
              value={formData.disability}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="job" className="form-label">Current Job:</label>
            <input
            //current job they have
              id="job"
              type="text"
              name="job"
              placeholder="Enter your job title"
              className="form-input"
              value={formData.job}
              onChange={handleChange}
              required
            />
          </div>

          <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>
        </form>
      </div>
    </div>
  );
}

export default UserInfo;
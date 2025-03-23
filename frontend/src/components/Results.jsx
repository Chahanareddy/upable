import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Results.css"; // ✅ Make sure this CSS file exists!

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { job, career, disability, timeframe } = location.state || {};

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (job && career) {
      axios
        .post("http://localhost:5000/get-upskilling", {
          job,
          career,
          disability,
          timeframe,
        })
        .then((res) => {
          setResources(res.data.resources);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [job, career, disability, timeframe]);

  return (
    <div className="results-container">
      <h2>📚 Recommended Roadmap for <em>{career}</em></h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-grid">
          {resources.map((resource, index) => (
            <div className="resource-card" key={index}>
              <h4>{resource.name}</h4>
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                Visit Course →
              </a>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/success-stories")}
        className="btn btn-secondary"
        style={{ marginTop: "2rem" }}
      >
        View Success Stories
      </button>
    </div>
  );
}

export default Results;

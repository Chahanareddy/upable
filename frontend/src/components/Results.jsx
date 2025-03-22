import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Results.css"; // 💡 Make sure this file exists!

function Results() {
  const location = useLocation();
  const { job, career } = location.state || {};
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (job && career) {
      axios
        .post("http://localhost:5000/get-upskilling", {job, career })
        .then((res) => {
          setResources(res.data.resources);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [job, career]);

  return (
    <div className="results-container">
      <h2>📚 Recommended Certifications for <em>{career}</em></h2>

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
    </div>
  );
}

export default Results;

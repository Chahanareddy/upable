import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Results() {
  const location = useLocation();
  const { job, career } = location.state || {};
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (job && career) {
      axios
        .post("http://localhost:5000/get-upskilling", { job, career })
        .then((res) => {
          setResources(res.data.resources);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [job, career]);

  return (
    <div className="container">
      <h2>Recommended Certifications for {career}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {resources.map((resource, index) => (
            <li key={index}>
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                {resource.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Results;

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function FutureCareer() {
  const [career, setCareer] = useState("");
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { job } = location.state || {};

  const handleChatSend = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: "user", text: input }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/gemini-career-chat", {
        messages: updatedMessages,
      });

      setMessages([...updatedMessages, { role: "bot", text: res.data.reply }]);
    } catch (err) {
      alert("Gemini API error");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (career.trim() !== "") {
      navigate("/results", { state: { job, career } });
    }
  };

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h2>Explore Your Future Career</h2>

      {/* Chatbot UI */}
      <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1rem", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
        {messages.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
            <strong>{msg.role === "user" ? "You" : "Coach"}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Ask something about your career..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <button onClick={handleChatSend} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      <hr style={{ margin: "2rem 0" }} />

      {/* Final Career Selection */}
      <h4>Once you decide, type your final career below:</h4>
      <input
        type="text"
        placeholder="e.g. Data Scientist"
        value={career}
        onChange={(e) => setCareer(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default FutureCareer;
